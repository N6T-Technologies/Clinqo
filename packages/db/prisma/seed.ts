import db from "../src";
import seedsData from "./seedsData";

async function main() {
    try {
        for (const user of seedsData.users) {
            await db.user.upsert({
                where: { email: user.email },
                update: {},
                create: user,
            });
        }

        for (const clinic of seedsData.clinics) {
            await db.clinic.upsert({
                where: { id: clinic.id },
                update: {},
                create: clinic,
            });
        }

        for (const employee of seedsData.employees) {
            await db.employee.upsert({
                where: { id: employee.id },
                update: {},
                create: employee,
            });
        }

        for (const appointment of seedsData.appointments) {
            await db.appointment.create({
                data: appointment,
            });
        }

        console.log("Database has been seeded successfully.");
    } catch (error) {
        console.error("Error seeding database: ", error);
    }
}

main();
