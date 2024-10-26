"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { EmployeeRegError, EmployeeRegSchema, EmployeeRegSchemaType } from "@/types";
import prisma, { EmployeeDesignation, EmployeeStatus, Genders, UserRoles } from "@repo/db/client";
import { createUser, getUserByEmial } from "@/data/user";
import { generatePass } from "@/lib/utils";
import { sendCreadentailEmail } from "./send-email";
import { Title } from "@/components/templates/credentials-email-template";

export async function registerEmployee(data: EmployeeRegSchemaType): Promise<{
    ok: boolean;
    error?: EmployeeRegError;
    msg?: string;
}> {
    const session = await auth();

    if (!session || !session.user) {
        return { ok: false, error: EmployeeRegError.No_Creadentials };
    }

    //@ts-ignore
    if (session.user.role != UserRoles.CLINIC_HEAD) {
        return { ok: false, error: EmployeeRegError.Unauthorized };
    }

    const clinicHead = await prisma.clinicHead.findUnique({
        where: { userId: session.user.id },
    });

    if (!clinicHead) {
        return { ok: false, error: EmployeeRegError.Clinic_Head_Not_Found };
    }

    const validatedFields = EmployeeRegSchema.safeParse(data);

    if (!validatedFields.success) {
        return { ok: false, error: EmployeeRegError.Invalid_Fields };
    }

    const existingUser = await getUserByEmial(validatedFields.data.email);

    if (existingUser) {
        return { ok: false, error: EmployeeRegError.Employee_Already_Exists };
    }

    const password = generatePass();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(validatedFields.data, hashedPassword, UserRoles.EMPLOYEE);

    if (!newUser) {
        return { ok: false, error: EmployeeRegError.Something_Went_Wrong };
    }

    const newEmployee = await prisma.employee.create({
        data: {
            clinicId: clinicHead.clinicId,
            userId: newUser.id,
            employeeDesignation: EmployeeDesignation.FRONT_DESK_MANAGER,
            employeeStatus: EmployeeStatus.ACTIVE,
        },
    });

    const title = newUser.gender === Genders.MALE ? Title.Mr : Title.Ms;
    await sendCreadentailEmail(newUser.email, { title: title, firstName: newUser.firstName, password: password });

    return { ok: true, msg: `Employee with id ${newEmployee.id}` };
}
