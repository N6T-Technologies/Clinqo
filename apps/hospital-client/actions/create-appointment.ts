"use server";

import { auth } from "@/auth";
import { RedisManger } from "@/lib/RedisManager";
import { CreateAppointmentError, CreateAppointmentSchema, CreateAppointmentSchemaType } from "@/types";
import { MessageFromEngine } from "@/types/fromEngine";
import { CREATE_RESHIPI, CreateAppointmentData } from "shefu/from-api";
import { RESHIPI_CREATED } from "shefu/to-api";

export async function createAppointment(
    data: CreateAppointmentSchemaType,
    selfData: { self: boolean; clinicId: string }
): Promise<{
    ok: boolean;
    error?: CreateAppointmentError;
    msg?: string;
}> {
    if (selfData.self) {
        const validatedFields = CreateAppointmentSchema.safeParse(data);

        if (!validatedFields.success) {
            return { ok: false, error: CreateAppointmentError.Invalid_Fields };
        }

        const { firstName, lastName, dateOfBirth, gender, contactNumber, symptoms, doctor, followup, paymentMethod } =
            validatedFields.data;

        const doctorName = doctor.split("_")[0];
        const doctorId = doctor.split("_")[1];

        const appointmentData: CreateAppointmentData = {
            patientFirstName: firstName,
            patientLastName: lastName,
            patientDateOfBirth: new Date(dateOfBirth),
            //@ts-ignore
            doctorName: doctorName,
            gender: gender,
            phoneNumber: contactNumber,
            symptoms: symptoms,
            //@ts-ignore
            clinic_doctor: `${selfData.clinicId}_${doctorId}`,
            followup: followup,
            paymentMethod: paymentMethod,
            //@ts-ignore
            managerId: selfData.clinicId,
        };

        const response: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
            type: CREATE_RESHIPI,
            data: appointmentData,
        });

        if (!response.payload.ok) {
            return { ok: false, error: CreateAppointmentError.Something_Went_Wrong };
        }

        if (response.type === RESHIPI_CREATED) {
            return { ok: true, msg: `Appointment with id ${response.payload.newReshipi.id} created` };
        }

        return { ok: false, error: CreateAppointmentError.Something_Went_Wrong };
    }

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

    const doctorName = doctor.split("_")[0];
    const doctorId = doctor.split("_")[1];

    const appointmentData: CreateAppointmentData = {
        patientFirstName: firstName,
        patientLastName: lastName,
        patientDateOfBirth: new Date(dateOfBirth),
        //@ts-ignore
        doctorName: doctorName,
        gender: gender,
        phoneNumber: contactNumber,
        symptoms: symptoms,
        //@ts-ignore
        clinic_doctor: `${session.user.clinicId}_${doctorId}`,
        followup: followup,
        paymentMethod: paymentMethod,
        //@ts-ignore
        managerId: session.user.employeeId,
    };

    const response: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
        type: CREATE_RESHIPI,
        data: appointmentData,
    });

    if (!response.payload.ok) {
        return { ok: false, error: CreateAppointmentError.Something_Went_Wrong };
    }

    if (response.type === RESHIPI_CREATED) {
        return { ok: true, msg: `Appointment with id ${response.payload.newReshipi.id} created` };
    }

    return { ok: false, error: CreateAppointmentError.Something_Went_Wrong };
}
