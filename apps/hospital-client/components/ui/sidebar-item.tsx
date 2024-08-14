"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface SidebarItemProps {
    href: string;
    icon: ReactNode;
    title: string;
}

export const SidebarItem = ({ href, icon, title }: SidebarItemProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const selected = pathname == href;
    return (
        <div
            className={`flex items-center ${selected ? "bg-[#7B9FEF] bg-opacity-40 cursor-default pointer-events-none" : "bg-transparent cursor-pointer"} p-2 pl-6 mt-2`}
            onClick={() => router.push(href)}
        >
            <div className={`font-bold ${selected ? "text-white" : "text-white opacity-40"} pr-2`}>{icon}</div>

            <div className={`font ${selected ? "text-white" : "text-white opacity-40"} pt-[3px]`}>{title}</div>
        </div>
    );
};
