import { auth } from "@/auth";
import { UserRoles } from "@repo/db/client";

export default async function ConsoleLayout({
    admin,
    clinicHead,
}: {
    admin: React.ReactNode;
    clinicHead: React.ReactNode;
}) {
    const session = await auth();

    //@ts-ignore
    return <div className="h-full">{session?.user.role === UserRoles.ADMIN ? admin : clinicHead}</div>;
}
