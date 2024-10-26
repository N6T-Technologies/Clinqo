"use server";

import {
    CredentailEmailTemplate,
    CredentialEmailTemplateProps,
} from "@/components/templates/credentials-email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCreadentailEmail(to: string, emailData: CredentialEmailTemplateProps) {
    try {
        const { data, error } = await resend.emails.send({
            from: "Clinqo <noreply@l3xlabs.com>",
            to: [to],
            subject: "Login Credentials",
            react: CredentailEmailTemplate(emailData),
        });

        if (error) {
            return { ok: false, error, status: 500 };
        }

        return { ok: true, data: data };
    } catch (error) {
        return { ok: false, error, status: 500 };
    }
}
