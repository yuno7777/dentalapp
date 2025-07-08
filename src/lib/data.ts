import type { Patient, Billing, Appointment } from './types';

const patients: Patient[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    phone: '555-0101',
    medicalHistory: 'No known allergies. History of seasonal asthma.',
    lastUpdated: '2024-05-20T10:00:00Z',
    treatment: 'Standard cleaning and check-up.',
  },
  {
    id: '2',
    name: 'Bob Williams',
    phone: '555-0102',
    medicalHistory: 'Allergic to penicillin.',
    lastUpdated: '2024-05-18T14:30:00Z',
    treatment: 'Follow-up for wisdom tooth extraction.',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    phone: '555-0103',
    medicalHistory: 'None.',
    lastUpdated: '2024-04-30T09:00:00Z',
    treatment: 'Awaiting consultation for braces.',
  },
  {
    id: '4',
    name: 'Diana Miller',
    phone: '555-0104',
    medicalHistory: 'History of migraines. Sensitive to bright lights.',
    lastUpdated: '2024-06-01T11:00:00Z',
    treatment: 'Post-whitening sensitivity check.',
  },
  {
    id: '5',
    name: 'Ethan Davis',
    phone: '555-0105',
    medicalHistory: 'Lactose intolerant.',
    lastUpdated: '2024-06-05T16:00:00Z',
    treatment: 'None.',
  },
];

const billing: Billing[] = [
  {
    id: 'b1',
    patientId: '1',
    service: 'Routine Check-up & Cleaning',
    cost: 150,
    paidAmount: 150,
    status: 'Paid',
    date: '2024-05-20T10:00:00Z',
  },
  {
    id: 'b2',
    patientId: '2',
    service: 'Wisdom Tooth Extraction',
    cost: 450,
    paidAmount: 0,
    status: 'Unpaid',
    date: '2024-05-18T14:30:00Z',
  },
  {
    id: 'b3',
    patientId: '3',
    service: 'Cavity Filling',
    cost: 250,
    paidAmount: 250,
    status: 'Paid',
    date: '2024-04-30T09:00:00Z',
  },
  {
    id: 'b4',
    patientId: '1',
    service: 'X-Ray',
    cost: 75,
    paidAmount: 75,
    status: 'Paid',
    date: '2023-11-15T10:00:00Z',
  },
  {
    id: 'b5',
    patientId: '4',
    service: 'Teeth Whitening',
    cost: 300,
    paidAmount: 100,
    status: 'Partially Paid',
    date: '2024-06-01T11:00:00Z',
  },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const appointments: Appointment[] = [
  {
    id: 'appt-1',
    patientId: '1',
    date: today.toISOString(),
    time: '10:00',
    reason: 'Annual Check-up & Cleaning',
  },
  {
    id: 'appt-2',
    patientId: '2',
    date: today.toISOString(),
    time: '11:30',
    reason: 'Follow-up for wisdom tooth extraction.',
  },
  {
    id: 'appt-3',
    patientId: '4',
    date: tomorrow.toISOString(),
    time: '14:00',
    reason: 'Consultation for whitening sensitivity.',
  },
];

export const getPatients = () => patients;
export const getBilling = () => billing;
export const getAppointments = () => appointments;
