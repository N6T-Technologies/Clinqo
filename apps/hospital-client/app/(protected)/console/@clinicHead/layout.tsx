import { Appbar } from "@/components/ui/appbar";
import { Route } from "@/types";
import { FaChartArea } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { ReactNode } from "react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { Sidebar } from "@/components/ui/sidebar";

export default function clinicHeadLayout({ children }: { children: ReactNode }) {
    const routes: Route[] = [
        { href: "/console/analytics", icon: <FaChartArea className="h-6 w-6" />, title: "Analysis" },
        { href: "/console/employees", icon: <FaUsers className="h-6 w-6" />, title: "Employees" },
        { href: "/console/doctors", icon: <FaUserDoctor className="h-6 w-6" />, title: "Doctors" },
    ];

    return (
        <div className="h-full w-full grid grid-cols-12">
            <Sidebar routes={routes} help={true} />
            <div className="col-span-10 w-full bg-clinqoHover h-full">
                <Appbar
                    href="/console/profile"
                    alt={"MP"}
                    src="https://github.com/shadcn.png"
                    icon={<EnvelopeClosedIcon className="h-6 w-6" />}
                />
                <div className="h-full w-full">{children}</div>
            </div>
        </div>
    );
}
