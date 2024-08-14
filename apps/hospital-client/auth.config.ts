import type { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "./types";
import { getUserByEmial } from "./data/user";

export default {
    providers: [
        credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);
                if (!validatedFields.success) {
                    return null;
                }

                const { email, password } = validatedFields.data;

                const user = await getUserByEmial(email);
                if (!user || !user.password) {
                    //user without the password can exisits because we have providers like gihub and google
                    return null;
                }

                //Now user exits we want to check if the users password is same as password in the form
                const passwordCheck = await bcrypt.compare(password, user.password);
                if (!passwordCheck) {
                    return null;
                }

                return user;
            },
        }),
    ],
} satisfies NextAuthConfig;
