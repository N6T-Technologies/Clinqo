import { RedisManger } from "@/lib/RedisManager";
import { MessageFromEngine } from "@/types/fromEngine";
import { NextRequest, NextResponse } from "next/server";
import { GET_ONGOING_RESHIPI } from "shefu/from-api";
import { ONGOING_RESHIPI, RETRY_GET_ONGOING_RESHIPI } from "shefu/to-api";

export async function POST(req: NextRequest) {
    if (req.body) {
        const data = await req.json();

        const result: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
            type: GET_ONGOING_RESHIPI,
            data: {
                clinic_doctor: data.title,
            },
        });

        if (result.type === ONGOING_RESHIPI) {
            return NextResponse.json({ ok: true, currentAppointment: result.payload.reshipi });
        }

        if (result.type === RETRY_GET_ONGOING_RESHIPI) {
            console.log(result.payload.msg);
            return NextResponse.json({ ok: false, msg: `${result.payload.error}` });
        }
        return NextResponse.json({ ok: false });
    } else {
        return NextResponse.json({ msg: "Body not found" });
    }
}
