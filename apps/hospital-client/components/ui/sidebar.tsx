"use client";

import { SidebarItem } from "./sidebar-item";
import { signOut } from "@/auth";
import { useRouter } from "next/navigation";
import { Route } from "@/types";
import { SlLogout } from "react-icons/sl";
import { SlPhone } from "react-icons/sl";

export function Sidebar({ routes, help }: { routes: Route[]; help: boolean }) {
    const router = useRouter();

    return (
        <div className="col-span-2 bg-clinqoNormal flex flex-col justify-between">
            <div>
                <div className="flex items-center ml-12 mt-7">
                    <div className="border border-black rounded-full text-white bg-black h-10 w-10 mr-2 flex justify-center items-center">
                        logo
                    </div>
                    <div className="text-xl text-white">Clinqo</div>
                </div>
                <div className="mt-16">
                    {routes.map((route) => (
                        <SidebarItem href={route.href} icon={route.icon} title={route.title} />
                    ))}
                </div>
            </div>
            <div className="space-y-2 pb-14 pl-6">
                {help ? (
                    <div
                        className="flex items-center space-x-2" // onClick={async () => {
                        //     await signOut();
                        //     redirect("/auth/login");
                        // }}
                    >
                        <SlPhone className="text-white cursor-pointer" />
                        <div className="text-white cursor-pointer">Help</div>
                    </div>
                ) : null}
                <div
                    className="flex items-center space-x-2"
                    onClick={async () => {
                        await signOut();
                        router.push("/auth/login");
                    }}
                >
                    <SlLogout className="text-white cursor-pointer" />
                    <div className="text-white cursor-pointer">Log out</div>
                </div>
            </div>
        </div>
    );
}
