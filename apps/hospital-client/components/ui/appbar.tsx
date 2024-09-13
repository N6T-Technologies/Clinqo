"use client";

import { ReactNode } from "react";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useRouter } from "next/navigation";

export function Appbar({ src, alt, icon, href }: { src: string; alt?: string; icon: ReactNode; href?: string }) {
    const router = useRouter();

    return (
        <div className="flex justify-between items-center h-16 bg-white shadow-lg">
            <div className="pl-8">
                <Button variant={"outline"} className="hover:bg-slate-100 hover:text-slate-500 px-2 py-2">
                    {icon}
                </Button>
            </div>
            <div className="pr-8 flex">
                <Avatar className="cursor-pointer" onClick={() => router.push(href || "")}>
                    <AvatarImage src={src} />
                    <AvatarFallback>{alt}</AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}
