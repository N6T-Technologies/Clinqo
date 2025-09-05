"use server";

import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { getClinicByGSTIN } from "@/data/clinic";
import { createUser, getUserByEmail } from "@/data/user";
import { generatePass } from "@/lib/utils";
import { ClinicRegError, CliniqRegSchema, CliniqRegSchemaType } from "@/types";
import prisma, { EmployeeDesignation, EmployeeStatus, Genders, UserRoles } from "@repo/db/client";
import { sendEmail } from "./send-email";
import { sendClinicWelcomeEmail } from "@/data/password-reset-token";
import {
    CredentailEmailTemplate,
    CredentialEmailTemplateProps,
    Title,
} from "@/components/templates/credentials-email-template";

export async function registerClinic(
    data: CliniqRegSchemaType
): Promise<{ ok: boolean; error?: ClinicRegError; msg?: string }> {
    const session = await auth();

    if (!session || !session.user) {
        return { ok: false, error: ClinicRegError.No_Creadentials };
    }

    //@ts-ignore
    if (session.user.role != UserRoles.ADMIN) {
        return { ok: false, error: ClinicRegError.Unauthorized };
    }

    const admin = await prisma.admin.findUnique({
        where: { userId: session.user.id },
    });

    if (!admin) {
        return { ok: false, error: ClinicRegError.Admin_Not_Found };
    }

    const validatedFields = CliniqRegSchema.safeParse(data);

    if (!validatedFields.success) {
        return { ok: false, error: ClinicRegError.Invalid_Fields };
    }

    const { email, clinicName, logo, gstin, country, addressLine1, addressLine2, city, state, pincode } =
        validatedFields.data;

    const existingUser = await getUserByEmail(email);

    console.log(logo);

    if (existingUser) {
        return { ok: false, error: ClinicRegError.Clinic_Head_Already_Exits };
    }

    const clinic = await getClinicByGSTIN(gstin);

    if (clinic) {
        return { ok: false, error: ClinicRegError.Clinic_Already_Exits };
    }

    const password = generatePass();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(validatedFields.data, hashedPassword, UserRoles.CLINIC_HEAD);

    if (!newUser) {
        return { ok: false, error: ClinicRegError.Something_Went_Wrong };
    }    
    const newClinic = await prisma.clinic.create({
        data: {
            name: clinicName,
            logo: logo || "https://github.com/shadcn.png",
            clinicHeads: {
                create: [
                    {
                        userId: newUser.id,
                    },
                ],
            },
            gstin: gstin,
            admin: {
                connect: admin,
            },
            employees: {
                create: [
                    {
                        userId: newUser.id,
                        employeeDesignation: EmployeeDesignation.CLINIC_HEAD,
                        employeeStatus: EmployeeStatus.ACTIVE,
                    },
                ],
            },
            address: {
                create: {
                    addressLine1: addressLine1,
                    addressLine2: addressLine2,
                    city: city,
                    state: state,
                    pincode: pincode,
                    country: country,
                },
            },
        },
    });

    const title = newUser.gender === Genders.MALE ? Title.Mr : Title.Ms;
    
    // Send welcome email with credentials to the clinic head
    try {

        await sendClinicWelcomeEmail(email, newUser.firstName, password, clinicName);
        
        console.log(`Welcome email sent successfully to ${email}`);
    } catch (error) {
        console.error("Failed to send welcome email:", error);
        // Note: We don't fail the clinic creation if email fails
    }

    return { ok: true, msg: `The clinic with id ${newClinic.id} created and welcome email sent to ${email}` };
}
