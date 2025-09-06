import { Appbar } from "@/components/ui/appbar";
import { Route } from "@/types";
import { FaChartArea } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { ReactNode } from "react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { Sidebar } from "@/components/ui/sidebar";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { auth } from "@/auth";
import { getEmployeeByUserId } from "@/data/employees";

export default async function DeskMangerLayout({ children }: { children: ReactNode }) {
    const session = await auth();
    
    // Get employee information including clinic logo
    const employee = session?.user?.id ? await getEmployeeByUserId(session.user.id) : null;
    
    // Generate initials for fallback
    const userInitials = session?.user?.name 
        ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'DM';
      const routes: Route[] = [
        { href: "/console/dashboard", icon: <FaChartArea className="h-6 w-6" />, title: "Dashboard" },
        { href: "/console/appointments", icon: <FaClipboardList className="h-6 w-6" />, title: "Appointments" },
        { href: "/console/doctors", icon: <FaUserDoctor className="h-6 w-6" />, title: "Doctors" },
        { href: "/console/previous-patients", icon: <FaUsers className="h-6 w-6" />, title: "Previous Patients" },
    ];

    return (
        <div className="h-screen w-full grid grid-cols-12">
            <Sidebar routes={routes} help={true} />
            <div className="w-full col-span-10 bg-clinqoHover flex flex-col h-screen">                
                <Appbar
                    alt={userInitials}
                    src={employee?.clinic?.logo}
                    icon={<EnvelopeClosedIcon className="h-6 w-6" />}
                />
                <div className="flex-1 overflow-y-auto relative">{children}</div>
            </div>
        </div>
    );
}
