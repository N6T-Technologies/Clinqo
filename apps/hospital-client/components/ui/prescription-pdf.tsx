"use client";

import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  Font,
  pdf 
} from '@react-pdf/renderer';
import { PrescriptionData } from '@/data/prescription';

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
    // Half A4 size: 148mm x 210mm = 420pt x 595pt
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
  },  clinicName: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 5,
  },
  clinicAddress: {
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  patientSection: {
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#e5e7eb',
    padding: 5,
    borderRadius: 2,
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
  },  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
  },
  label: {
    fontWeight: 600,
    minWidth: 80,
    color: '#374151',
    fontSize: 10,
  },  value: {
    color: '#1f2937',
    fontSize: 10,
    fontWeight: 500,
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

interface PrescriptionPDFProps {
  data: PrescriptionData | Partial<PrescriptionData>;
  isBlank?: boolean;
}

const PrescriptionPDF: React.FC<PrescriptionPDFProps> = ({ data, isBlank = false }) => {
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

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return new Date().toLocaleDateString('en-GB');
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return new Date().toLocaleDateString('en-GB');
      }
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date().toLocaleDateString('en-GB');
    }
  };

  const formatGender = (gender?: string) => {
    if (!gender || gender === 'NOT_SPECIFIED') return 'N/A';
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };

  const formatPrescriptionId = (id?: string) => {
    if (!id) return 'N/A';
    return id.slice(-5).toUpperCase(); // Last 5 characters in uppercase
  };

  const safeGetValue = (value: any, fallback: string = 'Not Available') => {
    return value && value !== 'undefined' && value !== 'null' ? value : fallback;
  };

  return (
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
        </View>        {/* Patient and Doctor Information */}
        <View style={styles.patientSection}>
          <Text style={styles.sectionTitle}>Patient & Doctor Information</Text>
          <View style={styles.patientInfo}>
            <View style={styles.patientDetails}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Patient:</Text>
                <Text style={styles.value}>{safeGetValue(data.patient?.name, '____________________')}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Age/Sex:</Text>
                <Text style={styles.value}>
                  {data.patient ? `${data.patient.age || 'N/A'} / ${formatGender(data.patient.gender)}` : 'N/A / N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{safeGetValue(data.patient?.phone, '____________________')}</Text>
              </View>
            </View>
            <View style={styles.doctorDetails}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Doctor:</Text>
                <Text style={styles.value}>{safeGetValue(data.doctor?.name, '____________________')}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Specialist:</Text>
                <Text style={styles.value}>{safeGetValue(data.doctor?.specialisation, '____________________')}</Text>
              </View>              <View style={styles.infoRow}>
                <Text style={styles.label}>Reg. No:</Text>
                <Text style={styles.value}>{safeGetValue(data.doctor?.mciNumber, '____________________')}</Text>
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
                <Text style={styles.value}>{formatPrescriptionId(data.appointment.id)}</Text>
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
};

export default PrescriptionPDF;

// Helper function to generate and download PDF
export const downloadPrescription = async (
  data: PrescriptionData | Partial<PrescriptionData>, 
  filename: string,
  isBlank: boolean = false
) => {
  const doc = <PrescriptionPDF data={data} isBlank={isBlank} />;
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
};
