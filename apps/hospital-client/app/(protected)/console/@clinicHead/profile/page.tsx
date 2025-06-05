import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClinicHeadProfile } from "@/data/clinic";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import LogoManager from "@/components/ui/logo-manager";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Phone, MapPin, Building, Hash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function ClinicHeadProfile() {
    const session = await auth();
    
    if (!session?.user) {
        notFound();
    }

    // @ts-ignore
    const clinicHeadId = session.user.clinicHeadId;
    
    if (!clinicHeadId) {
        notFound();
    }

    const profileData = await getClinicHeadProfile(clinicHeadId);
    
    if (!profileData) {
        notFound();
    }

    const { user, clinic } = profileData;    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <p className="text-gray-600">Manage your personal information and clinic settings</p>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                    Clinic Head
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>Your basic profile details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">First Name</label>
                                <p className="text-gray-900">{user.firstName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Last Name</label>
                                <p className="text-gray-900">{user.lastName}</p>
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <p className="text-gray-900">{user.email}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <div>
                                <label className="text-sm font-medium text-gray-700">Contact Number</label>
                                <p className="text-gray-900">{user.countryCode} {user.contactNumber}</p>
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                            <p className="text-gray-900">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700">Gender</label>
                            <p className="text-gray-900 capitalize">{user.gender.toLowerCase()}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Clinic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Clinic Information
                        </CardTitle>
                        <CardDescription>Details about your clinic</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Clinic Name</label>
                            <p className="text-gray-900 font-semibold">{clinic.name}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-500" />
                            <div>
                                <label className="text-sm font-medium text-gray-700">GSTIN</label>
                                <p className="text-gray-900">{clinic.gstin}</p>
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                            <div>
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <p className="text-gray-900">
                                    {clinic.addressLine1}
                                    {clinic.addressLine2 && <><br />{clinic.addressLine2}</>}
                                    <br />
                                    {clinic.city}, {clinic.state} {clinic.pincode}
                                    <br />
                                    {clinic.country}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Logo Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Clinic Logo Management</CardTitle>
                    <CardDescription>
                        Upload and manage your clinic's logo. This will be displayed across the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LogoManager
                        clinicId={clinic.id}
                        clinicName={clinic.name}
                        currentLogo={clinic.logo || undefined}
                        canEdit={true}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
