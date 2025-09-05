import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDoctorProfile } from "@/data/doctors";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Phone, MapPin, Building, Hash, Stethoscope, GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DoctorProfilePageProps {
    params: {
        id: string;
    };
}

export default async function DoctorProfile({ params }: DoctorProfilePageProps) {
    const session = await auth();
    
    if (!session?.user) {
        notFound();
    }

    const doctorProfile = await getDoctorProfile(params.id);
    
    if (!doctorProfile) {
        notFound();
    }

    const { user, clinics } = doctorProfile;
    const clinic = clinics[0]; // Assuming the doctor belongs to at least one clinic

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dr. {user.firstName} {user.lastName}</h1>
                    <p className="text-gray-600">Doctor Profile Information</p>
                </div>
                <Badge className="px-3 py-1 border border-gray-300">
                    Doctor
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
                        <CardDescription>Basic profile details</CardDescription>
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

                {/* Professional Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="h-5 w-5" />
                            Professional Information
                        </CardTitle>
                        <CardDescription>Medical credentials and specialization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-gray-500" />
                            <div>
                                <label className="text-sm font-medium text-gray-700">Specialization</label>
                                <p className="text-gray-900 font-semibold">{doctorProfile.specialisation}</p>
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-500" />
                            <div>
                                <label className="text-sm font-medium text-gray-700">MCI Number</label>
                                <p className="text-gray-900">{doctorProfile.mciNumber}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Clinic Information */}
            {clinic && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Associated Clinic
                        </CardTitle>
                        <CardDescription>Current workplace information</CardDescription>
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
                        
                        {clinic.address && (
                            <>
                                <Separator />
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Clinic Address</label>
                                        <p className="text-gray-900">
                                            {clinic.address.addressLine1}
                                            {clinic.address.addressLine2 && <><br />{clinic.address.addressLine2}</>}
                                            <br />
                                            {clinic.address.city}, {clinic.address.state} {clinic.address.pincode}
                                            <br />
                                            {clinic.address.country}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
