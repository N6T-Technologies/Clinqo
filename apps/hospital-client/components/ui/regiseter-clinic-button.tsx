"use client";

import Link from "next/link";
import { Button } from "./button";

export const RegisterClinicButton = () => {
    return (
        <div className="mt-6">
            <Button variant="clinqo" asChild>
                <Link href="/console/clinics/register">Register Clinic</Link>
            </Button>
        </div>
    );
};
