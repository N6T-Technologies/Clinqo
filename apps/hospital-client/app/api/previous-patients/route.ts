import { NextRequest, NextResponse } from 'next/server';
import prisma from '@repo/db/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId');

    if (!clinicId) {
      return NextResponse.json(
        { error: 'Clinic ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching previous patients for clinic:', clinicId);

    // Fetch completed appointments with patient and doctor details
    const appointments = await prisma.appointment.findMany({
      where: {
        clinicId: clinicId,
        appointmentStatus: 'COMPLETED',
      },
      include: {
        patient: {
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
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      },
      orderBy: {
        bookTime: 'desc',
      },
    });

    console.log(`Found ${appointments.length} completed appointments`);

    // Transform the data for the frontend
    const previousPatients = appointments.map(appointment => {
      // Calculate age
      let age = 0;
      if (appointment.patient.user.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(appointment.patient.user.dateOfBirth);
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      return {
        id: appointment.id,
        patientName: `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`,
        doctorName: `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
        symptoms: appointment.symptoms,
        bookTime: appointment.bookTime.toISOString(),
        endTime: appointment.endTime.toISOString(),
        paymentMethod: appointment.paymentMethod,
        phone: `${appointment.patient.user.countryCode} ${appointment.patient.user.contactNumber}`,
        age: age,
        gender: appointment.patient.user.gender,
      };
    });

    return NextResponse.json({ 
      patients: previousPatients,
      total: previousPatients.length 
    });

  } catch (error) {
    console.error('Error fetching previous patients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
