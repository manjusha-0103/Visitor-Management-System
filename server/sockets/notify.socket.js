import sql from "../db/database.js";




const notifyBirthday = async (io, users) => {

    for (const user of users) {

        const message = `🎉 Happy Birthday ${user.name}! 🎉`;

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