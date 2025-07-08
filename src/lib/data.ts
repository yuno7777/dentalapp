import type { Patient, Billing } from './types';

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
    status: 'Paid',
    date: '2024-05-20T10:00:00Z',
  },
  {
    id: 'b2',
    patientId: '2',
    service: 'Wisdom Tooth Extraction',
    cost: 450,
    status: 'Unpaid',
    date: '2024-05-18T14:30:00Z',
  },
  {
    id: 'b3',
    patientId: '3',
    service: 'Cavity Filling',
    cost: 250,
    status: 'Paid',
    date: '2024-04-30T09:00:00Z',
  },
  {
    id: 'b4',
    patientId: '1',
    service: 'X-Ray',
    cost: 75,
    status: 'Paid',
    date: '2023-11-15T10:00:00Z',
  },
  {
    id: 'b5',
    patientId: '4',
    service: 'Teeth Whitening',
    cost: 300,
    status: 'Partially Paid',
    date: '2024-06-01T11:00:00Z',
  },
];

export const getPatients = () => patients;
export const getBilling = () => billing;
