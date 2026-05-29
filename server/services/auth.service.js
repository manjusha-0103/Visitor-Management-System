import bcrypt from "bcryptjs";
import sql from "../db/database.js";
import ApiError from "../utils/ApiError.js";
import { auditService } from "./audit.service.js";

const getMeService = async (id) => {
  const me = await sql`
        SELECT 
            u.id,
            u.first_name, 
            u.last_name,
            u.email,
            u.last_login,
            u.created_at,
            u.google_calendar_connected,
            u.phone,
            DATE(u.birth_date AT TIME ZONE 'Asia/Kolkata') AS birth_date,
            u.role,

            e.position,
            e.company,

            d.id AS department_id,
            d.name AS department
            
        FROM "Users" u

        LEFT JOIN "Employee" e
            ON u.id = e.user_id

        LEFT JOIN "Departments" d
            ON d.id = e.department

        WHERE u.id = ${id}
    `;

  return me;
};

const registerUserService = async (userData) => {
  const { first_name, last_name, email, password, role, phone, birth_date } =
    userData;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert user
  const newUser = await sql`
        INSERT INTO "Users" ("email", "first_name", "last_name", "password", "role", "phone", "birth_date")
    VALUES (${email}, ${first_name}, ${last_name}, ${hashedPassword}, ${role}, ${phone}, ${birth_date})
    RETURNING "id", "first_name", "last_name", "email", "role", "phone"
    `;
  // await sendEmail({
  //     to: email,
  //     subject: "Welcome to Iravya | Account Creation",
  //     html: `
  //         <h2>Welcome ${first_name}</h2>
  //         <p>Thank you for registering with VMS. Your account has been created successfully.
  //         Below are the details you submitted during signup — please keep them safe and do not share your credentials
  //         with anyone.</p>
  //         <p>Your Signup Details</p>
  //         <p>Name: ${first_name} ${last_name}</p>
  //         <p>Email: ${email}</p>
  //         <p>Password: ${password}</p>
  //         <div >
  //             <a href="${getPublicAppUrl()}">Signin to Your Account →</a>
  //         </div>
  //     `
  // })
  return newUser[0];
};

const loginUserService = async (email, password, ip) => {
  const users = await sql`
        SELECT 
            *
        FROM "Users" WHERE "email" = ${email}
    `;
  if (!users || users.length === 0) {
    const audit_data = {
        "ip": req.ip,
        "action" : 'signin_failed',
        "audit_record" :{
            
            "email": email,
            "password" : password,
            "error": "Invalid credentials"
        },
        "message" : "Invalid credentials"
    }

    await auditService(audit_data)
    throw new ApiError(401, "Invalid credentials");
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const audit_data = {
        "ip": ip,
        "action" : 'signin_failed',
        "audit_record" :{
            
            "email": email,
            "password" : password,
            "error": "Invalid credentials"
        },
    }
    throw new ApiError(401, "Invalid credentials");
  }

  await sql`
    UPDATE "Users"
    SET "last_login" = NOW()
    WHERE "id" = ${user.id}
`;

  const [userData] = await sql`
    SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.role,
        u.google_calendar_connected,
        u.phone,
        u.birth_date,
        u.last_login,
        u.created_at,

        e.position,
        e.company,

        d.id AS department_id,
        d.name AS department

    FROM "Users" u

    LEFT JOIN "Employee" e
        ON u.id = e.user_id

    LEFT JOIN "Departments" d
        ON d.id = e.department

    WHERE u.id = ${user.id}
`;
  return userData;
};

const userExistbyemailService = async (email) => {
  const userExists = await sql`
        SELECT * FROM "Users" WHERE "email" = ${email}
    `;
  return userExists;
};

const changePasswordService = async ({ old_pass, new_pass }, user, ip) => {
  const user_ = await sql`
        SELECT password
        FROM "Users"
        WHERE id = ${user.id}
    `;

  if (!user_ || user_.length === 0) {
    const audit_data = {
      "ip": ip,
      "action" : 'change_password_failed',
      "audit_record" :{
          "updated_by" : {
              "email" :user.email,
              "name" : `${user.first_name } ${user.last_name }`,
              "phone" : user.phone
          },
           "old_pass" : old_pass,
          "new_pass" : new_pass,
          
          "message" : "User not found"
      },
    }
    await auditService(audit_data)
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(old_pass, user_[0].password);

  if (!isPasswordCorrect) {
    const audit_data = {
      "ip": ip,
      "action" : 'change_password_failed',
      "audit_record" :{
          "updated_by" : {
              "email" :user.email,
              "name" : `${user.first_name } ${user.last_name }`,
              "phone" : user.phone
          },
          "old_pass" : old_pass,
          "new_pass" : new_pass,
          
          "message" : "Old password is incorrect"
      },
    }
    await auditService(audit_data)
    throw new ApiError(400, "Old password is incorrect");
  }

  if (old_pass === new_pass) {
    const audit_data = {
      "ip": ip,
      "action" : 'change_password_failed',
      "audit_record" :{
          "updated_by" : {
              "email" :user.email,
              "name" : `${user.first_name } ${user.last_name }`,
              "phone" : user.phone
          },
          "old_pass" : old_pass,
          "new_pass" : new_pass,
          
          "message" : "Old and new password should not be the same"
      },
    }
    await auditService(audit_data)
    throw new ApiError(400, "Old and new password should not be the same");
  }

  const hashedPassword = await bcrypt.hash(new_pass, 10);

  const user__= await sql`
        UPDATE "Users"
        SET password = ${hashedPassword}
        WHERE id = ${user.id}
        RETURNING "first_name", "last_name", "email", "phone"
    `;
  return user__;
};

const updateMeService = async (data,user, ip) => {
  const {
    first_name = null,
    last_name = null,
    phone = null,
    birth_date = null,
    position = null,
    company = null,
    department = null,
  } = data;

  const user_ = await sql`
        SELECT id, role
        FROM "Users"
        WHERE id = ${user.id}
    `;

  if (!user_.length) {
    const audit_data = {
        "ip": req.ip,
        "action" : 'update_profile',
        "audit_record" :{
            "updated_by" : {
                "email" :user.email,
                "name" : `${user.first_name } ${user.last_name }`,
                "phone" : user.phone
            },
            ...data,

            "error" : "User not found"

        },
    }

    await auditService(audit_data)
    throw new ApiError(404, "User not found");
  }

  await sql`
        UPDATE "Users"
        SET
            first_name = COALESCE(${first_name}, first_name),
            last_name = COALESCE(${last_name}, last_name),
            phone = COALESCE(${phone}, phone),
            birth_date = COALESCE(${birth_date}, birth_date)
        WHERE id = ${user.id}
    `;
  if (user.role !== "super_admin") {
    await sql`
        UPDATE "Employee"
        SET
            position = COALESCE(${position}, position),
            company = COALESCE(${company}, company),
            department = COALESCE(${department}, department)
        WHERE user_id = ${user.id}
    `;
  }

  const profile = await sql`
        SELECT 
            u.id,
            CONCAT(u.first_name, ' ', u.last_name) AS name,
            u.email,
            u.phone,
            DATE(u.birth_date AT TIME ZONE 'Asia/Kolkata'),
            u.role,

            e.position,
            e.company,

            d.name AS department

        FROM "Users" u

        LEFT JOIN "Employee" e
            ON u.id = e.user_id

        LEFT JOIN "Departments" d
            ON d.id = e.department

        WHERE u.id = ${user.id}
    `;

  return profile[0];
};

export {
  registerUserService,
  userExistbyemailService,
  loginUserService,
  getMeService,
  changePasswordService,
  updateMeService,
};
