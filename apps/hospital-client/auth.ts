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

            //TODO: Add more role based ids like this
            if (token.role === UserRoles.EMPLOYEE) {
                const employee = await prisma.employee.findUnique({
                    where: { userId: session.user.id },
                });
                //@ts-ignore
                session.user.employeeId = employee?.id;
                //@ts-ignore
                session.user.clinicId = employee?.clinicId;
            }

            if (token.role === UserRoles.CLINIC_HEAD) {
                const clinicHead = await prisma.clinicHead.findUnique({
                    where: { userId: session.user.id },
                });

                //@ts-ignore
                session.user.clinicHeadId = clinicHead?.id;
            }

            if (token.role === UserRoles.DOCTOR) {
                const doctor = await prisma.doctor.findUnique({
                    where: { userId: session.user.id },
                });

                const user = await prisma.user.findUnique({
                    where: { id: session.user.id },
                });

                const clinics = await prisma.clinic.findMany({
                    where: {
                        doctors: {
                            some: {
                                userId: session.user.id,
                            },
                        },
                    },
                });

                session.user.name = `Dr. ${user?.firstName} ${user?.lastName}`;
                //@ts-ignore
                session.user.doctorId = doctor?.id;
                //@ts-ignore
                session.user.clinics = clinics.map((c: any) => {
                    return { clinicId: c.id, clinicName: c.name };
                });
            }

            if (token.role === UserRoles.ADMIN) {
                const admin = await prisma.admin.findUnique({
                    where: {
                        userId: session.user.id,
                    },
                });

                //@ts-ignore
                session.user.adminId = admin?.id;
            }

            if (token.role && session.user) {
                //@ts-ignore
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
