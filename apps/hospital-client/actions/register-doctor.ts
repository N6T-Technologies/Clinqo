"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { DoctorRegError, DoctorRegSchema, DoctorRegSchemaType } from "@/types";
import prisma, { UserRoles } from "@repo/db/client";
import { createUser, getUserByEmial } from "@/data/user";
import { generatePass } from "@/lib/utils";

export async function registerDoctor(data: DoctorRegSchemaType): Promise<{
    ok: boolean;
    error?: DoctorRegError;
    msg?: string;
}> {
    const session = await auth();

    if (!session || !session.user) {
        return { ok: false, error: DoctorRegError.No_Creadentials };
    }

    //@ts-ignore
    if (session.user.role != UserRoles.CLINIC_HEAD) {
        return { ok: false, error: DoctorRegError.Unauthorized };
    }

    const clinicHead = await prisma.clinicHead.findUnique({
        where: { userId: session.user.id },
    });

    if (!clinicHead) {
        return { ok: false, error: DoctorRegError.Clinic_Head_Not_Found };
    }

    const clinic = await prisma.clinic.findUnique({
        where: { id: clinicHead.clinicId },
    });

    if (!clinic) {
        return { ok: false, error: DoctorRegError.Clinic_Not_Found };
    }

    const validatedFields = DoctorRegSchema.safeParse(data);

    if (!validatedFields.success) {
        return { ok: false, error: DoctorRegError.Invalid_Fields };
    }

    const existingUser = await getUserByEmial(validatedFields.data.email);

    if (existingUser) {
        return { ok: false, error: DoctorRegError.Employee_Already_Exists };
    }

    const password = generatePass();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(validatedFields.data, hashedPassword, UserRoles.DOCTOR);

    if (!newUser) {
        return { ok: false, error: DoctorRegError.Something_Went_Wrong };
    }

    const newDoctor = await prisma.doctor.create({
        data: {
            userId: newUser.id,
            clinics: {
                connect: clinic,
            },
            specialisation: validatedFields.data.specialisation,
            mciNumber: validatedFields.data.mciNumber,
        },
    });

    //TODO: Send Email and password by email to doctor and revalidate path
    console.log(password);
    return { ok: true, msg: `Employee with id ${newDoctor.id}` };
}
