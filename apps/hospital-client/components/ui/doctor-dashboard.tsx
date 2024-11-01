"use client";

import { AllClinicTable } from "@/types";
import DataCard from "./data-card";
import { FaUser } from "react-icons/fa";
import { FaStopwatch } from "react-icons/fa";
import DoctorClinicTable from "./doctor-clinic-table";

export default function DoctorDashboard({ doctorId, data }: { doctorId: string; data: AllClinicTable[] | undefined }) {
    return (
        <div className="h-full px-16 py-12">
            <div className="flex gap-x-12">
                <DataCard
                    data="206"
                    description="Avg. Patients/Week"
                    icon={<FaUser className="bg-[#F5E6FE] text-[#BE63F9] rounded-lg size-12 p-2" />}
                />
                <DataCard
                    data="15 min"
                    description="Avg. Time/Appointment"
                    icon={<FaStopwatch className="bg-[#CEFFE7] text-[#339259] rounded-lg size-12 p-2" />}
                />
            </div>
            <DoctorClinicTable data={data} doctorId={doctorId} dashboard />
        </div>
    );
}
