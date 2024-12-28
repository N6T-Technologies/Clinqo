"use server";

import { AuthError } from "next-auth";
import { signIn } from "../auth";
import { DEFAULT_LOGGEDIN_REDIRECT } from "../routes";
import { LoginSchema, type LoginSchemaType } from "@/types";
import { getUserByEmail } from "../data/user";
import { LoginActionsError } from "@/types";

export const login = async (
    values: LoginSchemaType
): Promise<{ ok: boolean; error?: LoginActionsError; msg?: string }> => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { ok: false, error: LoginActionsError.Invalid_Fields };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { ok: false, error: LoginActionsError.User_Not_Found };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGGEDIN_REDIRECT,
        });
        return { ok: true, error: undefined, msg: "Logged In" };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { ok: false, error: LoginActionsError.Invalid_Credentials };
                default:
                    return { ok: false, error: LoginActionsError.Something_Went_Wrong };
            }
        }

        throw error;
    }
};
