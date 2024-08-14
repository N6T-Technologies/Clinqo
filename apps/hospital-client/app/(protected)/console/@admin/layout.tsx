import { SidebarItem } from "@/components/ui/SidebarItem";
import { FaHome } from "react-icons/fa";
import { FaHospital } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-full grid grid-cols-12">
            <div className="col-span-2 bg-clinqoNormal">
                <div className="flex items-center ml-12 mt-7">
                    <div className="border border-black rounded-full text-white bg-black h-10 w-10 mr-2 flex justify-center items-center">
                        logo
                    </div>
                    <div className="text-xl text-white">Clinqo</div>
                </div>
                <div className="mt-16">
                    <SidebarItem href={"/console"} icon={<FaHome className="h-6 w-6" />} title="Console" />
                    <SidebarItem href={"/console/clinics"} icon={<FaHospital className="h-6 w-6" />} title="Clinics" />
                    <SidebarItem
                        href={"/console/doctors"}
                        icon={<FaUserDoctor className="h-6 w-6" />}
                        title="Doctors"
                    />
                </div>
            </div>
            <div className="col-span-10">{children}</div>
        </div>
    );
}
