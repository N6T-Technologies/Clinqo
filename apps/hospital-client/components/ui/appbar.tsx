"use client";

import { ReactNode } from "react";
import { Button } from "./button";

export function Appbar({ pic, icon }: { pic: string; icon: ReactNode }) {
    return (
        <div className="flex justify-between items-center h-16 bg-white shadow-lg">
            <div className="pl-8">
                <Button variant={"outline"} className="hover:bg-slate-100 hover:text-slate-500 px-2 py-2">
                    {icon}
                </Button>
            </div>
            <div className="pr-8 flex">
                <div className="border border-black rounded-full text-white bg-black h-10 w-10 mr-2 flex justify-center items-center">
                    {pic}
                </div>
            </div>
        </div>
    );
}
