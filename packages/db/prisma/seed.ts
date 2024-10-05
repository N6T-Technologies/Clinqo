import { Genders, Roles } from "@prisma/client";
import db from "../src";
import seedsData from "./seedsData";

async function main() {
    try {
        for (const admin of seedsData.admins) {
            const createdUser = await db.user.create({
                data: admin,
            });

            await db.admin.create({
                data: {
                    userId: createdUser.id,
                },
            });
        }

        // for (const clinicHead of seedsData.clinicHeads) {
        //     const createdUser = await db.user.create({
        //         data: clinicHead,
        //     });
        //
        //     await db.clinicHead.create({
        //         data: {
        //             userId: createdUser.id,
        //         },
        //     });
        // }
        console.log("Database has been seeded successfully.");
    } catch (error) {
        console.error("Error seeding database: ", error);
    }
}

main();
