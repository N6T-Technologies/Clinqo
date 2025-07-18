"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, Loader2 } from 'lucide-react';
import { PrescriptionData, getAppointmentForPrescription, getAppointmentForPrescriptionById, getBlankPrescriptionData } from '@/data/prescription';
import { toast } from '@/hooks/use-toast';

// Lazy load the PDF functionality to avoid SSR issues
const downloadPrescriptionPDF = async (
  data: PrescriptionData | Partial<PrescriptionData>, 
  filename: string,
  isBlank: boolean = false
) => {
  try {
    // Dynamically import react-pdf components
    const { Document, Page, Text, View, StyleSheet, Image, Font, pdf } = await import('@react-pdf/renderer');
    
    // Register fonts for better typography
    Font.register({
      family: 'Open Sans',
      fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
      ]
    });

    // Define styles for the PDF
    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 20,
        fontFamily: 'Open Sans',
        fontSize: 10,
        size: [420, 595],
      },
      header: {
        flexDirection: 'row',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#2563eb',
        alignItems: 'center',
      },
      logoContainer: {
        width: 60,
        height: 60,
        marginRight: 15,
      },
      logo: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      },
      clinicInfo: {
        flex: 1,
        flexDirection: 'column',
      },
      clinicName: {
        fontSize: 16,
        fontWeight: 700,
        color: '#1f2937',
        marginBottom: 5,
      },
      clinicAddress: {
        fontSize: 9,
        color: '#6b7280',
        lineHeight: 1.3,
      },
      patientSection: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      },
      sectionTitle: {
        fontSize: 12,
        fontWeight: 600,
        color: '#374151',
        marginBottom: 8,
      },
      patientInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
      },
      patientDetails: {
        flex: 1,
      },
      doctorDetails: {
        flex: 1,
        marginLeft: 20,
      },
      infoRow: {
        flexDirection: 'row',
        marginBottom: 3,
      },
      label: {
        fontWeight: 600,
        minWidth: 70,
        color: '#374151',
      },
      value: {
        color: '#6b7280',
      },
      prescriptionArea: {
        flex: 1,
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
      },
      prescriptionTitle: {
        fontSize: 14,
        fontWeight: 600,
        color: '#1f2937',
        marginBottom: 15,
        textAlign: 'center',
      },
      writingLines: {
        flex: 1,
        flexDirection: 'column',
      },
      line: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#d1d5db',
        marginBottom: 15,
        height: 20,
      },
      footer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        fontSize: 8,
        color: '#9ca3af',
      },
    });

    const formatAddress = (address?: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    }) => {
      if (!address) return '';
      
      const parts = [
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.state,
        address.pincode,
        address.country
      ].filter(Boolean);
      
      return parts.join(', ');
    };

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      }).format(date);
    };

    // Create PDF component
    const PrescriptionPDF = () => (
      <Document>
        <Page size={[420, 595]} style={styles.page}>
          {/* Header with clinic info */}
          <View style={styles.header}>
            {data.clinic?.logo && (
              <View style={styles.logoContainer}>
                <Image src={data.clinic.logo} style={styles.logo} />
              </View>
            )}
            <View style={styles.clinicInfo}>
              <Text style={styles.clinicName}>
                {data.clinic?.name || 'Clinic Name'}
              </Text>
              <Text style={styles.clinicAddress}>
                {formatAddress(data.clinic?.address)}
              </Text>
            </View>
          </View>

          {/* Patient and Doctor Information */}
          <View style={styles.patientSection}>
            <Text style={styles.sectionTitle}>Patient & Doctor Information</Text>
            <View style={styles.patientInfo}>
              <View style={styles.patientDetails}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Patient:</Text>
                  <Text style={styles.value}>{data.patient?.name || '__________________'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Age/Sex:</Text>
                  <Text style={styles.value}>
                    {data.patient ? `${data.patient.age} / ${data.patient.gender}` : '___ / ___'}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Phone:</Text>
                  <Text style={styles.value}>{data.patient?.phone || '__________________'}</Text>
                </View>
              </View>
              <View style={styles.doctorDetails}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Doctor:</Text>
                  <Text style={styles.value}>{data.doctor?.name || '__________________'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Specialist:</Text>
                  <Text style={styles.value}>{data.doctor?.specialisation || '__________________'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Reg. No:</Text>
                  <Text style={styles.value}>{data.doctor?.mciNumber || '__________________'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>
                {data.appointment?.bookTime ? formatDate(data.appointment.bookTime) : formatDate(new Date())}
              </Text>
              {!isBlank && data.appointment?.id && (
                <>
                  <Text style={[styles.label, { marginLeft: 40 }]}>Prescription ID:</Text>
                  <Text style={styles.value}>{data.appointment.id}</Text>
                </>
              )}
            </View>
          </View>

          {/* Prescription Writing Area */}
          <View style={styles.prescriptionArea}>
            <Text style={styles.prescriptionTitle}>PRESCRIPTION</Text>
            <View style={styles.writingLines}>
              {/* Generate lines for handwriting */}
              {Array.from({ length: 18 }, (_, index) => (
                <View key={index} style={styles.line} />
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>Generated on {formatDate(new Date())}</Text>
          </View>
        </Page>
      </Document>
    );

    const doc = <PrescriptionPDF />;
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    link.click();
    
    // Cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

interface PrintPrescriptionButtonProps {
  // For appointment-based prescription
  appointmentData?: {
    doctorId: string;
    clinicId: string;
    patientId: string;
  };
  
  // For appointment by ID lookup
  appointmentId?: string;
  
  // For blank prescription
  blankPrescriptionData?: {
    clinicId: string;
    patientId: string;
    doctorId: string;
  };
  
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  isBlank?: boolean;
}

const PrintPrescriptionButton: React.FC<PrintPrescriptionButtonProps> = ({
  appointmentData,
  appointmentId,
  blankPrescriptionData,
  variant = 'default',
  size = 'default',
  className = '',
  isBlank = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const handlePrintPrescription = async () => {
    setIsGenerating(true);
    
    try {
      let prescriptionData: PrescriptionData | Partial<PrescriptionData> | null = null;
      let filename = '';

      console.log("Print prescription called with:", {
        appointmentId,
        appointmentData,
        blankPrescriptionData,
        isBlank
      });

      if (isBlank && blankPrescriptionData) {
        // Generate blank prescription
        console.log("Generating blank prescription...");
        prescriptionData = await getBlankPrescriptionData(
          blankPrescriptionData.clinicId,
          blankPrescriptionData.patientId,
          blankPrescriptionData.doctorId
        );
        filename = `blank-prescription-${new Date().toISOString().split('T')[0]}`;
      } else if (appointmentId) {
        // Generate prescription using appointment ID
        console.log("Generating prescription for appointment ID:", appointmentId);
        prescriptionData = await getAppointmentForPrescriptionById(appointmentId);
        filename = `prescription-${appointmentId}-${new Date().toISOString().split('T')[0]}`;
      } else if (appointmentData) {
        // Generate prescription for existing appointment
        console.log("Generating prescription with appointment data:", appointmentData);
        prescriptionData = await getAppointmentForPrescription(
          appointmentData.doctorId,
          appointmentData.clinicId,
          appointmentData.patientId
        );
        filename = `prescription-${appointmentData.patientId}-${new Date().toISOString().split('T')[0]}`;
      }

      console.log("Prescription data result:", prescriptionData ? "Found" : "Not found");

      if (!prescriptionData) {
        toast({
          title: "Error",
          description: "Failed to fetch prescription data. Please try again.",
          variant: "destructive",
        });
        return;
      }      // Generate and download PDF
      await downloadPrescriptionPDF(prescriptionData, filename, isBlank);
      
      toast({
        title: "Success",
        description: "Prescription downloaded successfully!",
      });

    } catch (error) {
      console.error('Error generating prescription:', error);
      toast({
        title: "Error",
        description: "Failed to generate prescription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handlePrintPrescription}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={className}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <>
          <Printer className="h-4 w-4 mr-2" />
          <Download className="h-4 w-4 mr-2" />
        </>
      )}
      {isGenerating 
        ? 'Generating...' 
        : isBlank 
          ? 'Print Blank Prescription' 
          : 'Print Prescription'
      }
    </Button>
  );
};

export default PrintPrescriptionButton;
