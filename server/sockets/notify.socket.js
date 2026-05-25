import sql from "../db/database.js";




const notifyBirthday = async (io, users) => {

    for (const user of users) {

        const message = `
            🎉Wish Happy Birthday ${user.name}! 🎉 \n
            (${user.position} - ${user.department})
        `;

        io.emit("birthdayNotification", {
            title: "🎉 Happy Birthday!",
            message,
        });

        await sql`
            INSERT INTO "Notifications" ("user_id", "message")
            VALUES (${user.id}, ${message})
        `;
    }
};

export{
    notifyBirthday
}