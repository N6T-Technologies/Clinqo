import { RedisManger } from "@/lib/RedisManager";
import { MessageFromEngine } from "@/types/fromEngine";
import { NextRequest, NextResponse } from "next/server";
import { CURRENT_SESSION, RETRY_GET_SESSION } from "shefu/to-api";

export async function POST(req: NextRequest) {
    if (req.body) {
        const data = await req.json();

        const result: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
            type: "GET_SESSION",
            data: {
                doctor: data.doctorId,
            },
        });

        if (result.type === CURRENT_SESSION) {
            return NextResponse.json({ ok: true, currentSessionId: result.payload.clinicId });
        }

        if (result.type === RETRY_GET_SESSION) {
            return NextResponse.json({ ok: false, msg: "Session Not Found" });
        }
        return NextResponse.json({ ok: false });
    } else {
        return NextResponse.json({ msg: "Body not found" });
    }
}
