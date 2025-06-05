import { Appbar } from "@/components/ui/appbar";
import { Route } from "@/types";
import { FaChartArea } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { ReactNode } from "react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { Sidebar } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { getClinicLogoByClinicHeadId } from "@/data/clinic";

export default async function clinicHeadLayout({ children }: { children: ReactNode }) {
    const routes: Route[] = [
        { href: "/console/dashboard", icon: <FaChartArea className="h-6 w-6" />, title: "dashboard" },
        { href: "/console/employees", icon: <FaUsers className="h-6 w-6" />, title: "Employees" },
        { href: "/console/doctors", icon: <FaUserDoctor className="h-6 w-6" />, title: "Doctors" },
    ];

    // Get session and clinic logo
    const session = await auth();
    let clinicLogo = "https://github.com/shadcn.png"; // fallback
    let clinicInitials = "CH"; // fallback

    if (session?.user) {
        // @ts-ignore
        const clinicHeadId = session.user.clinicHeadId;
        
        if (clinicHeadId) {
            const clinicData = await getClinicLogoByClinicHeadId(clinicHeadId);
            
            if (clinicData) {
                clinicLogo = clinicData.logo || "https://github.com/shadcn.png";
                // Generate initials from clinic name
                clinicInitials = clinicData.name
                    .split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
            }
        }
    }    return (
        <div className="h-screen w-full grid grid-cols-12">
            <Sidebar routes={routes} help={true} />
            <div className="col-span-10 w-full bg-clinqoHover h-screen flex flex-col">
                <Appbar
                    href="/console/profile"
                    alt={clinicInitials}
                    src={clinicLogo}
                    icon={<EnvelopeClosedIcon className="h-6 w-6" />}
                />
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}
