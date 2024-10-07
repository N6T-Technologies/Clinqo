import { Appbar } from "@/components/ui/appbar";
import { Route } from "@/types";
import { FaChartArea } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { ReactNode } from "react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { Sidebar } from "@/components/ui/sidebar";
import { FaUserDoctor } from "react-icons/fa6";

export default function DeskMangerLayout({ children }: { children: ReactNode }) {
    const routes: Route[] = [
        { href: "/console/dashboard", icon: <FaChartArea className="h-6 w-6" />, title: "Dashboard" },
        { href: "/console/appointments", icon: <FaClipboardList className="h-6 w-6" />, title: "Appointments" },
        { href: "/console/doctors", icon: <FaUserDoctor className="h-6 w-6" />, title: "Doctors" },
    ];

    return (
        <div className="h-full w-full grid grid-cols-12">
            <Sidebar routes={routes} help={true} />
            <div className="w-full col-span-10 bg-clinqoHover h-full">
                <Appbar
                    alt={"MP"}
                    src="https://github.com/shadcn.png"
                    icon={<EnvelopeClosedIcon className="h-6 w-6" />}
                />
                <div className="h-full w-full">{children}</div>
            </div>
        </div>
    );
}
