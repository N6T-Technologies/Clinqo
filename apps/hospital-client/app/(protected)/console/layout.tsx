//@ts-nocheck
import { auth } from "@/auth";
import { UserRoles } from "@repo/db/client";

export default async function ConsoleLayout({
    admin,
    clinicHead,
    deskManager,
    doctor,
}: {
    admin: React.ReactNode;
    clinicHead: React.ReactNode;
    deskManager: React.ReactNode;
    doctor: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="h-full">
            {session?.user.role === UserRoles.ADMIN
                ? admin
                : session?.user.role === UserRoles.CLINIC_HEAD
                  ? clinicHead
                  : session?.user.role === UserRoles.EMPLOYEE
                    ? deskManager
                    : doctor}
        </div>
    );
}
