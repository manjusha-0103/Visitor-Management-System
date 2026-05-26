import bcrypt from "bcryptjs";
import sql from "../db/database.js";
import ApiError from "../utils/ApiError.js";
import { sendEmail } from "../utils/mailer.js";
import { userExistbyemailService } from "./auth.service.js";
import { getPublicAppUrl } from "../config/runtimeUrls.js";
import escapeHtml from "../utils/escapeHtml.js";

const getALLEmployeesservice = async ({
  page = 1,
  limit = 10,
  search = "",
  department = null,
}) => {
  const offset = (page - 1) * limit;

  // Employee Data
  const emp = await sql`
        SELECT 
            e.*,
            u.email,
            u.phone,
            u.birth_date,
            u.last_login,
            u.role,
            DATE(u.birth_date AT TIME ZONE 'Asia/Kolkata'),

            CONCAT(u.first_name, ' ', u.last_name) AS full_name,

            d.name AS department_name

        FROM "Employee" e

        JOIN "Users" u
            ON u.id = e.user_id

        JOIN "Departments" d
            ON d.id = e.department

        WHERE 
            (
                ${search || ""} = ''

                OR u.email ILIKE ${"%" + search + "%"}
                OR u.first_name ILIKE ${"%" + search + "%"}
                OR u.last_name ILIKE ${"%" + search + "%"}
                OR d.name ILIKE ${"%" + search + "%"}
            )

            AND (
                ${department}::varchar IS NULL
                OR d.name = ${department}
            )
            
            AND(
                u.role = 'employee'
                OR u.role = 'user'
            )

        ORDER BY e.created_at DESC

        LIMIT ${limit}
        OFFSET ${offset}
    `;

  // Total Count
  const [total_count] = await sql`
        SELECT 
            COUNT(*) AS total_count

        FROM "Employee" e

        JOIN "Users" u
            ON u.id = e.user_id

        JOIN "Departments" d
            ON d.id = e.department

        WHERE 
            (
                ${search || ""} = ''

                OR u.email ILIKE ${"%" + search + "%"}
                OR u.first_name ILIKE ${"%" + search + "%"}
                OR u.last_name ILIKE ${"%" + search + "%"}
                OR d.name ILIKE ${"%" + search + "%"}
            )

            AND (
                ${department}::varchar IS NULL
                OR d.name = ${department}
            )
    `;

  const total = Number(total_count.total_count);

  return {
    data: emp,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

const getAllUserService = async ({
  page = 1,
  limit = 10,
  search = "",
  role = null,
}) => {
  const offset = (page - 1) * limit;

  // Users
  const users = await sql`
        SELECT 
            id,
            CONCAT(first_name, ' ', last_name) AS full_name,
            first_name,
            last_name,
            email,
            phone,
            role,
            last_login,
            created_at

        FROM "Users"

        WHERE 
         role IN (
        'visitor'
    )
        AND (
                ${search || ""} = ''

                OR email ILIKE ${"%" + search + "%"}
                OR first_name ILIKE ${"%" + search + "%"}
                OR last_name ILIKE ${"%" + search + "%"}
            )

            AND (
                ${role || ""} = ''
                OR role = ${role}
            )

        ORDER BY created_at DESC

        LIMIT ${limit}
        OFFSET ${offset}
    `;

  // Total Count
  const [total_count] = await sql`
        SELECT 
            COUNT(*) AS total_count

        FROM "Users"

        WHERE 
            (
                ${search || ""} = ''

                OR email ILIKE ${"%" + search + "%"}
                OR first_name ILIKE ${"%" + search + "%"}
                OR last_name ILIKE ${"%" + search + "%"}
            )

            AND (
                ${role || ""} = ''
                OR role = ${role}
            )    `;

  const total = Number(total_count.total_count);

  return {
    data: users,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

const addEmployeeService = async ({
  first_name,
  last_name,
  email,
  phone,
  company,
  department,
  position,
  role,
  birth_date,
}) => {
  const userExist = await userExistbyemailService(email);

  if (userExist.length) {
    throw new ApiError(409, "Employee already exists");
  }

  const password = "Pass@123";

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [user] = await sql`
        INSERT INTO "Users"
        ("first_name", "last_name", "email", "phone", "role", "password", "birth_date")
        VALUES
        (${first_name}, ${last_name}, ${email}, ${phone}, ${role}, ${hashedPassword}, ${birth_date})
        RETURNING "id", "first_name", "last_name", "email", "phone", "role"
    `;

  const [emp] = await sql`
        INSERT INTO "Employee"
        ("company", "department", "position", "user_id")
        VALUES
        (${company}, ${department}, ${position}, ${user.id})
        RETURNING *
    `;
  const publicAppUrl = getPublicAppUrl();

  if (role === "user") {
    await sendEmail({
      to: email,
      subject: "Welcome to VisitMi | Account Creation",
      html: `
                <h2>Welcome ${escapeHtml(first_name)}</h2>
                <p>Thank you for registering with VMS. Your account has been created successfully.
                Below are the details -- please keep them safe and do not share your credentials
                with anyone.</p>
                <p>Your Signup Details</p>
                <p>Name: ${escapeHtml(first_name)} ${escapeHtml(last_name)}</p>
                <p>Email: ${escapeHtml(email)}</p>
                <p>Password: ${escapeHtml(password)}</p>
                <div >
                    <a href="${escapeHtml(publicAppUrl)}">Signin to Your Account →</a>
                </div>
            `,
    });
  }

  return {
    user,
    emp,
  };
};

const addDepartmentService = async ({ name }) => {
  const dept = await sql`
        INSERT INTO "Departments" ("name")
        VALUES (${name})
        RETURNING *
    `;
  return dept;
};

const updateEmployeeService = async (
  id,
  { first_name, last_name, email, phone, company, department, position, role },
) => {
  // Check user exists
  const [existingUser] = await sql`
        SELECT *
        FROM "Employee"
        WHERE "id" = ${id}
    `;

  if (!existingUser) {
    throw new ApiError(404, "Employee not found");
  }

  // Update Employee table
  const [updatedEmployee] = await sql`
        UPDATE "Employee"
        SET
            "company" = ${company},
            "department" = ${department},
            "position" = ${position}
          
        WHERE "id" = ${id}
        RETURNING *
    `;

  // Update Users table
  const [updatedUser] = await sql`
        UPDATE "Users"
        SET
            "first_name" = ${first_name},
            "last_name" = ${last_name},
            "email" = ${email},
            "phone" = ${phone},
            "role" = ${role}
        WHERE "id" = ${updatedEmployee.user_id}
        RETURNING
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "role"
    `;

  return {
    user: updatedUser,
    employee: updatedEmployee,
  };
};

const updateUserService = async (
  id,
  { first_name, last_name, email, phone, role },
) => {
  const [existingUser] = await sql`
        SELECT *
        FROM "Users"
        WHERE "id" = ${id}
    `;

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }
  const [user] = await sql`
        UPDATE "Users"
        SET
            "first_name" = ${first_name},
            "last_name" = ${last_name},
            "email" = ${email},
            "phone" = ${phone},
            "role" = ${role}
        WHERE "id" = ${id}
        RETURNING
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "role"
    `;
  return user;
};

const deleteDeparmentService = async (id) => {
  const dept = await sql`
        DELETE FROM "Departments"
        WHERE id = ${id}
        RETURNING *
    `;
  return dept;
};
const deleteEmployeeService = async (id) => {
  const emp = await sql`
        DELETE FROM "Employee"
        WHERE id = ${id}
        RETURNING *
    `;

  return emp;
};
export {
  getALLEmployeesservice,
  getAllUserService,
  addEmployeeService,
  addDepartmentService,
  updateEmployeeService,
  updateUserService,
  deleteDeparmentService,
  deleteEmployeeService,
};
