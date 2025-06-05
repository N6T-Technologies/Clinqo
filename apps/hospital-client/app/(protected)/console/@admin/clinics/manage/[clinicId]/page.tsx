import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClinicById } from "@/data/clinic";
import { notFound } from "next/navigation";
import LogoManager from "@/components/ui/logo-manager";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface ClinicManagePageProps {
    params: Promise<{
        clinicId: string;
    }>;
}

export default async function ClinicManagePage({ params }: ClinicManagePageProps) {
    const { clinicId } = await params;
    
    // Fetch clinic data
    const clinic = await getClinicById(clinicId);
    
    if (!clinic) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/console/clinics">
                    <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Clinics
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Manage Clinic</h1>
                    <p className="text-gray-600">{clinic.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clinic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Clinic Information</CardTitle>
                        <CardDescription>Basic clinic details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Clinic Name</label>
                            <p className="text-gray-900">{clinic.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">GSTIN</label>
                            <p className="text-gray-900">{clinic.gstin}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <p className="text-gray-900">
                                {clinic.addressLine1}
                                {clinic.addressLine2 && `, ${clinic.addressLine2}`}
                                <br />
                                {clinic.city}, {clinic.state} {clinic.pincode}
                                <br />
                                {clinic.country}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Clinic Head</label>
                            <p className="text-gray-900">{clinic.headName}</p>
                            <p className="text-gray-600 text-sm">{clinic.headEmail}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Logo Management */}
                <div className="space-y-6">
                    <LogoManager
                        clinicId={clinic.id}
                        clinicName={clinic.name}
                        currentLogo={clinic.logo || undefined}
                        canEdit={true}
                    />
                </div>
            </div>
        </div>
    );
}
