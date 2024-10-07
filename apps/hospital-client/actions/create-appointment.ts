"use server";

import { auth } from "@/auth";
import { CreateAppointmentError, CreateAppointmentSchema, CreateAppointmentSchemaType } from "@/types";
import { CreateAppointmentData } from "shefu/from-api";

export async function createAppointment(data: CreateAppointmentSchemaType): Promise<{
    ok: boolean;
    error?: CreateAppointmentError;
    msg?: string;
}> {
    const session = await auth();

    if (!session || !session.user) {
        return { ok: false, error: CreateAppointmentError.No_Creadentials };
    }

    //@ts-ignore
    if (!session.user.employeeId) {
        return { ok: false, error: CreateAppointmentError.Unauthorized };
    }

    //@ts-ignore
    if (!session.user.clinicId) {
        return { ok: false, error: CreateAppointmentError.Clinic_Not_Found };
    }

    const validatedFields = CreateAppointmentSchema.safeParse(data);

    if (!validatedFields.success) {
        return { ok: false, error: CreateAppointmentError.Invalid_Fields };
    }

    const { firstName, lastName, dateOfBirth, gender, contactNumber, symptoms, doctor, followup, paymentMethod } =
        validatedFields.data;

    const appointmentData: CreateAppointmentData = {
        patientFirstName: firstName,
        patientLastName: lastName,
        patientDateOfBirth: new Date(dateOfBirth),
        gender: gender,
        phoneNumber: contactNumber,
        symptoms: symptoms,
        //@ts-ignore
        clinic_doctor: `${session.user.clinicId}_${doctor}`,
        followup: followup,
        paymentMethod: paymentMethod,
        //@ts-ignore
        managerId: session.user.employeeId,
    };

    return { ok: true, msg: "Appointment created!" };
}
