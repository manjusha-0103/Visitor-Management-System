import sql from "../db/database.js";




const notifyBirthday = async (socket,io) => {

    const users = await sql`
        SELECT 
            n.message,
            u.*,
            e.*,
            d.name AS department

        FROM "Notifications" n
        JOIN "Users" u
            ON u.id = n.user_id
        JOIN "Employee" e
            ON e.user_id = u.id
        LEFT JOIN "Departments" d
            ON d.id = e.department
        WHERE DATE(n.created_at) = CURRENT_DATE
        AND u.role = 'user'
    `

    for (const user of users) {

        const message = `
            🎉Wish Happy Birthday ${user.first_name} ${user.last_name}! 🎉 \n
            (${user.position} - ${user.department})
        `;

        io.emit("birthdayNotification", {
            title: "🎉 Happy Birthday!",
            message,
        });

        
    }
};

export{
    notifyBirthday
}