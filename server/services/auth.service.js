import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { sendEmail } from "../utils/mailer.js"

const getMeService = async (id) => {
    const me = await sql`
        SELECT 
            u.id,
            CONCAT(u.first_name, ' ', u.last_name) AS name,
            u.email,
            u.phone,
            u.birth_date,
            u.role,

            e.position,
            e.company,

            d.name AS department
            
        FROM "Users" u

        LEFT JOIN "Employee" e
            ON u.id = e.user_id

        LEFT JOIN "Departments" d
            ON d.id = e.department

        WHERE u.id = ${id}
    `

    return me
}

const registerUserService = async (userData) => {
    const { first_name, last_name, email, password, role, phone, birth_date } = userData
    console.log(first_name, last_name, email, password, role)

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    // Insert user
    const newUser = await sql`
        INSERT INTO "Users" ("email", "first_name", "last_name", "password", "role", "phone", "birth_date")
    VALUES (${email}, ${first_name}, ${last_name}, ${hashedPassword}, ${role}, ${phone}, ${birth_date})
    RETURNING "id", "first_name", "last_name", "email", "role", "phone"
    `
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
    //             <a href="https://localhost:/">Signin to Your Account →</a>
    //         </div>
    //     `
    // })
    return newUser[0]
}

const loginUserService = async (email, password) => {
    const users = await sql`
        SELECT 
            *
        FROM "Users" WHERE "email" = ${email}
    `
    const user = users[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new ApiError(401,"Invalid credentials")
    }

    const [userData] = await sql`
        UPDATE "Users"
        SET "last_login" = NOW()
        WHERE "id" = ${user.id}
        RETURNING  "id", 
            "first_name", 
            "last_name", 
            "email", 
            "role", 
            "phone",
            "last_login",
            "created_at"
    `
    return userData
}

const userExistbyemailService = async (email) =>{
    const userExists = await sql`
        SELECT * FROM "Users" WHERE "email" = ${email}
    `
    return userExists
}

const changePasswordService = async ({old_pass, new_pass}, id) => {
    
    const user = await sql`
        SELECT password
        FROM "Users"
        WHERE id = ${id}
    `

    const isPasswordCorrect = await bcrypt.compare(
        old_pass,
        user[0].password
    )

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Old password is incorrect")
    }

    if (old_pass === new_pass) {
        throw new ApiError(
            400,
            "Old and new password should not be the same"
        )
    }

    const hashedPassword = await bcrypt.hash(new_pass, 10)

    const user_= await sql`
        UPDATE "Users"
        SET password = ${hashedPassword}
        WHERE id = ${id}
        RETURNING "first_name", "last_name", "email", "phone"
    `
    return user_
}

const updateMeService = async (data, id) => {

    const {
        first_name = null,
        last_name = null,
        phone = null,
        birth_date = null,
        position = null,
        company = null,
        department = null
    } = data

    const user = await sql`
        SELECT id, role
        FROM "Users"
        WHERE id = ${id}
    `

    if (!user.length) {
        throw new ApiError(404, "User not found")
    }

    await sql`
        UPDATE "Users"
        SET
            first_name = COALESCE(${first_name}, first_name),
            last_name = COALESCE(${last_name}, last_name),
            phone = COALESCE(${phone}, phone),
            birth_date = COALESCE(${birth_date}, birth_date)
        WHERE id = ${id}
    `

    await sql`
        UPDATE "Employee"
        SET
            position = COALESCE(${position}, position),
            company = COALESCE(${company}, company),
            department = COALESCE(${department}, department)
        WHERE user_id = ${id}
    `

    const profile = await sql`
        SELECT 
            u.id,
            CONCAT(u.first_name, ' ', u.last_name) AS name,
            u.email,
            u.phone,
            u.birth_date,
            u.role,

            e.position,
            e.company,

            d.name AS department

        FROM "Users" u

        LEFT JOIN "Employee" e
            ON u.id = e.user_id

        LEFT JOIN "Departments" d
            ON d.id = e.department

        WHERE u.id = ${id}
    `

    return profile[0]
}

export{
    registerUserService,
    userExistbyemailService,
    loginUserService,
    getMeService,
    changePasswordService,
    updateMeService
}