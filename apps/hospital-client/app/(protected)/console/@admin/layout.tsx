import { Appbar } from "@/components/ui/appbar";
import { Route } from "@/types";
import { FaHome } from "react-icons/fa";
import { FaHospital } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { ReactNode } from "react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { Sidebar } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const routes: Route[] = [
        { href: "/console", icon: <FaHome className="h-6 w-6" />, title: "Console" },
        { href: "/console/clinics", icon: <FaHospital className="h-6 w-6" />, title: "Clinics" },
        { href: "/console/doctors", icon: <FaUserDoctor className="h-6 w-6" />, title: "Doctors" },
    ];

    return (
        <div className="h-full w-full grid grid-cols-12">
            <Sidebar routes={routes} help={false} />
            <div className="col-span-10 w-full bg-clinqoHover h-full">
                <Appbar pic={"MP"} icon={<EnvelopeClosedIcon className="h-6 w-6" />} />
                <div className="h-full w-full">{children}</div>
            </div>
        </div>
    );
}
