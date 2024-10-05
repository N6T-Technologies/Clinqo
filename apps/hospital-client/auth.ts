import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma, { UserRoles } from "@repo/db/client";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";

export const { auth, handlers, signIn, signOut } = NextAuth({
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") {
                return true;
            }

            if (!user.id) {
                return false;
            }

            const existingUser = await getUserById(user.id);

            if (!existingUser || !existingUser.email || !existingUser.password) {
                return false;
            }

            //TODO: Add email verification
            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRoles;
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) {
                return token;
            }
            const existringUser = await getUserById(token.sub);

            if (!existringUser) return token;

            token.role = existringUser.role;

            return token;
        },
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
});
