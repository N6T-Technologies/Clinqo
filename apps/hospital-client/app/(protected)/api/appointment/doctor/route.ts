import { RedisManger } from "@/lib/RedisManager";
import { MessageFromEngine } from "@/types/fromEngine";
import { NextRequest, NextResponse } from "next/server";
import { GET_DEPTH_DOCTOR, GET_ONGOING_RESHIPI } from "shefu/from-api";
import {
    CURRENT_SESSION,
    DEPTH_DOCTOR,
    ONGOING_RESHIPI,
    RETRY_DEPTH_DOCTOR,
    RETRY_GET_ONGOING_RESHIPI,
    RETRY_GET_SESSION,
} from "shefu/to-api";
import { Errors } from "../../../../../../shefu/src/state/ReshipiBook";

export async function POST(req: NextRequest) {
    if (req.body) {
        const data = await req.json();

        const session: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
            type: "GET_SESSION",
            data: {
                doctor: data.doctorId,
            },
        });

        if (session.type === RETRY_GET_SESSION) {
            return NextResponse.json({ ok: false, msg: "Session Not Found" });
        }

        if (session.type === CURRENT_SESSION) {
            const title = `${session.payload.clinicId}_${data.doctorId}`;

            const depth: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
                type: GET_DEPTH_DOCTOR,
                data: {
                    clinic_doctor: title,
                },
            });

            if (depth.type === RETRY_DEPTH_DOCTOR) {
                if (depth.payload.error === Errors.NOT_FOUND) {
                    return NextResponse.json({
                        ok: true,
                        session: true,
                        depth: false,
                        ongoing: false,
                        currentSessionId: session.payload.clinicId,
                        msg: "No Appointments",
                    });
                } else if (depth.payload.error === Errors.SOMETHING_WENT_WRONG) {
                    return NextResponse.json({
                        ok: true,
                        session: true,
                        depth: false,
                        ongoing: false,
                        currentSessionId: session.payload.clinicId,
                        msg: "Internal Server Error, Try Reloading",
                    });
                }
            }

            if (depth.type === DEPTH_DOCTOR) {
                const ongoing: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
                    type: GET_ONGOING_RESHIPI,
                    data: {
                        clinic_doctor: title,
                    },
                });
                if (ongoing.type === ONGOING_RESHIPI) {
                    return NextResponse.json({
                        ok: true,
                        session: true,
                        depth: true,
                        ongoing: true,
                        currentAppointment: ongoing.payload.reshipi,
                        appointments: depth.payload.reshipies,
                        currentSessionId: session.payload.clinicId,
                    });
                }
                if (ongoing.type === RETRY_GET_ONGOING_RESHIPI) {
                    return NextResponse.json({
                        ok: true,
                        session: true,
                        depth: true,
                        ongoing: false,
                        appointments: depth.payload.reshipies,
                        currentSessionId: session.payload.clinicId,
                    });
                }
            }
        }

        return NextResponse.json({ ok: false, msg: "Internal Server Error" });
    } else {
        return NextResponse.json({ msg: "Body not found" });
    }
}
