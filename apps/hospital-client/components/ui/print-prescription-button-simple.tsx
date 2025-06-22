"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Loader2, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PrintPrescriptionButtonProps {
  // For appointment by ID lookup
  appointmentId?: string;
  patientName?: string; // Add patient name prop
  doctorName?: string; // Add doctor name prop
  
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
  showDownload?: boolean; // Option to show download button alongside print
}

const PrintPrescriptionButton: React.FC<PrintPrescriptionButtonProps> = ({
  appointmentId,
  patientName,
  doctorName,
  blankPrescriptionData,
  variant = 'default',
  size = 'default',
  className = '',
  isBlank = false,
  showDownload = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleAction = async (actionType: 'print' | 'download') => {
    setIsGenerating(true);
    
    try {
      console.log('Print prescription clicked with:', { appointmentId, blankPrescriptionData, isBlank });
      
      let prescriptionData;
      let filename = '';

      // Fetch prescription data from API
      const params = new URLSearchParams();
      
      if (isBlank && blankPrescriptionData) {
        params.append('clinicId', blankPrescriptionData.clinicId);
        params.append('patientId', blankPrescriptionData.patientId);
        params.append('doctorId', blankPrescriptionData.doctorId);
        params.append('isBlank', 'true');
        filename = `blank-prescription-${new Date().toISOString().split('T')[0]}`;      } else if (appointmentId) {
        params.append('appointmentId', appointmentId);
        
        // Get clinic ID from session - need to fetch it
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();
        const clinicId = sessionData?.user?.clinicId;
        
        if (patientName) {
          params.append('patientName', patientName);
        }
        
        if (doctorName) {
          params.append('doctorName', doctorName);
        }
        
        if (clinicId) {
          params.append('clinicId', clinicId);
        }
        
        filename = `prescription-${appointmentId}-${new Date().toISOString().split('T')[0]}`;
      } else {
        toast({
          title: "Error",
          description: "Missing appointment or prescription data.",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetching prescription data from API with params:', params.toString());
      const response = await fetch(`/api/prescription?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch prescription data');
      }

      const { data } = await response.json();
      prescriptionData = data;      console.log('Prescription data fetched:', prescriptionData);

      // Dynamic import to avoid SSR issues
      if (actionType === 'print') {
        const { printPrescription } = await import('./prescription-pdf');
        await printPrescription(prescriptionData, isBlank);
        
        toast({
          title: "Success",
          description: "Prescription opened for printing!",
        });
      } else {
        const { downloadPrescription } = await import('./prescription-pdf');
        await downloadPrescription(prescriptionData, filename, isBlank);
        
        toast({
          title: "Success", 
          description: "Prescription downloaded successfully!",
        });
      }} catch (error) {
      console.error('Error generating prescription:', error);
      toast({
        title: "Error",
        description: `Failed to generate prescription: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }  };

  if (showDownload) {
    return (
      <div className="flex space-x-2">
        <Button
          onClick={() => handleAction('print')}
          disabled={isGenerating}
          variant={variant}
          size={size}
          className={className}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Printer className="h-4 w-4 mr-2" />
          )}
          {isGenerating 
            ? 'Generating...' 
            : isBlank 
              ? 'Print Blank' 
              : 'Print'
          }
        </Button>
        <Button
          onClick={() => handleAction('download')}
          disabled={isGenerating}
          variant="outline"
          size={size}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => handleAction('print')}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={className}
    >{isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Printer className="h-4 w-4 mr-2" />
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
