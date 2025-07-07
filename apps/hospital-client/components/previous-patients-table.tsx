"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, FileText } from "lucide-react";
import PrintPrescriptionButton from "@/components/ui/print-prescription-button-simple";

// Simple date formatting function
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
    });
};

interface PreviousPatient {
    id: string;
    patientName: string;
    doctorName: string;
    symptoms: string;
    bookTime: string;
    endTime: string;
    paymentMethod: string;
    phone: string;
    age: number;
    gender: string;
}

interface PreviousPatientsTableProps {
    clinicId: string;
}

export default function PreviousPatientsTable({ clinicId }: PreviousPatientsTableProps) {
    const [patients, setPatients] = useState<PreviousPatient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPreviousPatients();
    }, [clinicId]);

    const fetchPreviousPatients = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/previous-patients?clinicId=${clinicId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch previous patients');
            }
            
            const data = await response.json();
            setPatients(data.patients);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="text-lg">Loading previous patients...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-32 text-red-600">
                <div className="text-lg font-semibold">Error loading patients</div>
                <div className="text-sm">{error}</div>
                <Button 
                    onClick={fetchPreviousPatients} 
                    variant="outline" 
                    className="mt-2"
                >
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search by patient name, doctor, or symptoms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button 
                    onClick={fetchPreviousPatients}
                    variant="outline"
                >
                    Refresh
                </Button>
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-600">
                Showing {filteredPatients.length} of {patients.length} previous patients
            </div>

            {/* Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient Name</TableHead>
                            <TableHead>Age/Gender</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Symptoms</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPatients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'No patients found matching your search' : 'No previous patients found'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPatients.map((patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium">
                                        {patient.patientName}
                                    </TableCell>
                                    <TableCell>
                                        {patient.age} / {patient.gender}
                                    </TableCell>
                                    <TableCell>
                                        {patient.phone}
                                    </TableCell>
                                    <TableCell>
                                        {patient.doctorName}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        {patient.symptoms}
                                    </TableCell>                                    <TableCell>
                                        {formatDate(patient.bookTime)}
                                    </TableCell>
                                    <TableCell>
                                        <span className="capitalize">
                                            {patient.paymentMethod.toLowerCase().replace('_', ' ')}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <PrintPrescriptionButton
                                                appointmentId={patient.id}
                                                patientName={patient.patientName}
                                                doctorName={patient.doctorName}
                                                variant="outline"
                                                size="sm"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
