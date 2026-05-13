import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { sendEmail } from "../utils/mailer.js"


const registerUserService = async (userData) => {
    const { first_name, last_name, email, password, role, phone } = userData
    console.log(first_name, last_name, email, password, role)

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    // Insert user
    const newUser = await sql`
        INSERT INTO "Users" ("email", "first_name", "last_name", "password", "role", "phone")
    VALUES (${email}, ${first_name}, ${last_name}, ${hashedPassword}, ${role}, ${phone})
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

export{
    registerUserService,
    userExistbyemailService,
    loginUserService
}