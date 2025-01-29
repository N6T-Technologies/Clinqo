"use server";

import { Resend } from "resend";
import { ReactElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY environment variable");
}

export async function sendEmail<T>(
    to: string,
    emailData: T,
    subject:string,
    template: (emailData: T) => ReactElement
) {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: [to],
            subject,
            react: template(emailData),
        });

        if (error) {
            console.error("Resend API error:", error);
            return { 
                ok: false, 
                error: error.message || "Failed to send email",
                status: 500 
            };
        }

        return { 
            ok: true, 
            data,
            status: 200
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return { 
            ok: false, 
            error: error instanceof Error ? error.message : "Internal server error",
            status: 500 
        };
    }
}