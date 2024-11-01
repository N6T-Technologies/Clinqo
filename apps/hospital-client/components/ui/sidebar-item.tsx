"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface SidebarItemProps {
    href: string;
    icon: ReactNode;
    title: string;
    router: AppRouterInstance;
}

export const SidebarItem = ({ href, icon, title, router }: SidebarItemProps) => {
    const pathname = usePathname();
    const selected = pathname == href;
    return (
        <div
            className={`flex items-center ${selected ? "bg-[#7B9FEF] bg-opacity-40 cursor-default pointer-events-none" : "bg-transparent cursor-pointer hover:bg-[#7B9FEF] hover:bg-opacity-20"} p-2 pl-6 mt-2`}
            onClick={() => router.push(href)}
        >
            <div className={`font-bold ${selected ? "text-white" : "text-white opacity-40"} pr-2`}>{icon}</div>

            <div className={`font ${selected ? "text-white" : "text-white opacity-40"} pt-[3px]`}>{title}</div>
        </div>
    );
};
