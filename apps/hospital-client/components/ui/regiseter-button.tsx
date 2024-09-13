"use client";

import Link from "next/link";
import { Button } from "./button";

export const RegisterButton = ({ name, href }: { name: string; href: string }) => {
    return (
        <div className="mt-6">
            <Button variant="clinqo" asChild>
                <Link href={href}>Register {name}</Link>
            </Button>
        </div>
    );
};
