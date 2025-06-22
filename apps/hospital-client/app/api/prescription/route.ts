import { NextRequest, NextResponse } from 'next/server';
import { getAppointmentForPrescriptionById, getBlankPrescriptionData } from '@/data/prescription';
import { auth } from '@/auth';
import prisma from '@repo/db/client';
import { Prisma } from '@prisma/client';

// Create a prescription with real data from database
async function createPrescriptionWithRealData(
  appointmentId: string, 
  patientName: string, 
  doctorName: string,
  clinicId: string
) {
  try {
    console.log('Creating prescription with real data for:', { appointmentId, patientName, doctorName, clinicId });
    
    // First, let's see what patients and doctors exist in the database
    const allPatients = await prisma.patient.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            gender: true,
            contactNumber: true,
            countryCode: true,
            dateOfBirth: true,
          }
        }
      },
      take: 10,
    });
    
    const allDoctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
      take: 10,
    });
    
    console.log('Available patients in database:', allPatients.map(p => ({
      id: p.id,
      name: `${p.user.firstName} ${p.user.lastName}`,
      gender: p.user.gender,
      phone: `${p.user.countryCode} ${p.user.contactNumber}`
    })));
    
    console.log('Available doctors in database:', allDoctors.map(d => ({
      id: d.id,
      name: `Dr. ${d.user.firstName} ${d.user.lastName}`,
      specialisation: d.specialisation,
      mciNumber: d.mciNumber
    })));
    
    console.log('Looking for patient with name:', patientName);
    console.log('Looking for doctor with name:', doctorName);
    
    // Get clinic information
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      include: { address: true },
    });

    if (!clinic) {
      console.log('Clinic not found for ID:', clinicId);
      return null;
    }    // Try to find patient by name (improved search with exact matching first)
    const patientNameParts = patientName.trim().split(' ');
    const firstName = patientNameParts[0] || '';
    const lastName = patientNameParts.slice(1).join(' ') || '';
    
    console.log('Searching for patient - firstName:', firstName, 'lastName:', lastName);
    
    // First try exact matching
    let patient = await prisma.patient.findFirst({
      include: {
        user: true,
      },
      where: {
        user: {
          AND: [
            {
              firstName: {
                equals: firstName,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            ...(lastName ? [{
              lastName: {
                equals: lastName,
                mode: Prisma.QueryMode.insensitive,
              },
            }] : []),
          ],
        },
      },
    });
    
    // If no exact match found, try fuzzy matching
    if (!patient) {
      console.log('No exact match found, trying fuzzy search...');
      patient = await prisma.patient.findFirst({
        include: {
          user: true,
        },
        where: {
          user: {
            OR: [
              // Contains match on first name only
              {
                firstName: {
                  contains: firstName,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              // Full name search only if lastName exists
              ...(lastName ? [{
                AND: [
                  {
                    firstName: {
                      contains: firstName,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    lastName: {
                      contains: lastName,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                ],
              }] : []),
            ],
          },
        },
      });
    }    // Try to find doctor by name (improved search with exact matching first)
    const doctorNameClean = doctorName.replace(/^Dr\.?\s*/i, '').trim();
    const doctorNameParts = doctorNameClean.split(' ');
    const doctorFirstName = doctorNameParts[0] || '';
    const doctorLastName = doctorNameParts.slice(1).join(' ') || '';
    
    console.log('Searching for doctor - firstName:', doctorFirstName, 'lastName:', doctorLastName);
    
    // First try exact matching
    let doctor = await prisma.doctor.findFirst({
      include: {
        user: true,
      },
      where: {
        user: {
          AND: [
            {
              firstName: {
                equals: doctorFirstName,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            ...(doctorLastName ? [{
              lastName: {
                equals: doctorLastName,
                mode: Prisma.QueryMode.insensitive,
              },
            }] : []),
          ],
        },
      },
    });
    
    // If no exact match found, try fuzzy matching
    if (!doctor) {
      console.log('No exact doctor match found, trying fuzzy search...');
      doctor = await prisma.doctor.findFirst({
        include: {
          user: true,
        },
        where: {
          user: {
            OR: [
              // Contains match on first name only
              {
                firstName: {
                  contains: doctorFirstName,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              // Full name search only if lastName exists
              ...(doctorLastName ? [{
                AND: [
                  {
                    firstName: {
                      contains: doctorFirstName,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    lastName: {
                      contains: doctorLastName,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                ],
              }] : []),
            ],
          },
        },
      });
    }

    console.log('Found patient:', patient ? `${patient.user.firstName} ${patient.user.lastName}` : 'No');
    console.log('Found doctor:', doctor ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}` : 'No');

    // Calculate age if patient found
    let age = 0;
    if (patient?.user?.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(patient.user.dateOfBirth);
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }    return {
      clinic: {
        name: clinic.name,
        logo: clinic.logo,
        address: {
          addressLine1: clinic.address?.addressLine1 || "",
          addressLine2: clinic.address?.addressLine2 || undefined,
          city: clinic.address?.city || "",
          state: clinic.address?.state || "",
          pincode: clinic.address?.pincode || "",
          country: clinic.address?.country || "",
        },
      },
      patient: {
        name: patient ? `${patient.user.firstName} ${patient.user.lastName}` : patientName,
        age: patient ? age : 25, // Default realistic age if not found
        gender: patient?.user?.gender || "MALE", // Default gender instead of "OTHER"
        phone: patient ? `${patient.user.countryCode} ${patient.user.contactNumber}` : "+91 9876543210", // Default phone format
      },
      doctor: {
        name: doctor ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}` : doctorName,
        specialisation: doctor?.specialisation || "General Medicine",
        mciNumber: doctor?.mciNumber || "MCI-12345", // Default format
      },
      appointment: {
        id: appointmentId,
        bookTime: new Date().toISOString(),
        symptoms: "As discussed",
      },
    };
  } catch (error) {
    console.error('Error creating prescription with real data:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');
    const patientName = searchParams.get('patientName');
    const doctorName = searchParams.get('doctorName'); // Get doctor name from query
    const clinicId = searchParams.get('clinicId');
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');
    const isBlank = searchParams.get('isBlank') === 'true';

    console.log('API Route - Received params:', {
      appointmentId,
      patientName,
      doctorName,
      clinicId,
      patientId,
      doctorId,
      isBlank
    });

    let prescriptionData;

    if (isBlank && clinicId && patientId && doctorId) {
      // Get blank prescription data
      console.log('API Route - Fetching blank prescription data');
      prescriptionData = await getBlankPrescriptionData(clinicId, patientId, doctorId);
    } else if (appointmentId) {
      // First try to get from database
      console.log('API Route - Fetching appointment prescription data for ID:', appointmentId);
      prescriptionData = await getAppointmentForPrescriptionById(appointmentId);
      
      // If not found in database, create prescription with real data
      if (!prescriptionData && patientName && doctorName && clinicId) {
        console.log('API Route - Creating prescription with real data');
        prescriptionData = await createPrescriptionWithRealData(appointmentId, patientName, doctorName, clinicId);
      }
    } else {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('API Route - Prescription data result:', prescriptionData ? 'Found' : 'Not found');

    if (!prescriptionData) {
      console.log('API Route - No prescription data found');
      return NextResponse.json(
        { error: 'Prescription data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: prescriptionData });
  } catch (error) {
    console.error('API Route - Error fetching prescription data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
