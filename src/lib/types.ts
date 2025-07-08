export type Patient = {
  id: string;
  name: string;
  phone: string;
  medicalHistory: string;
  lastUpdated: string;
  treatment?: string;
};

export type Billing = {
  id: string;
  patientId: string;
  service: string;
  cost: number;
  paidAmount: number;
  status: 'Paid' | 'Unpaid' | 'Partially Paid';
  date: string;
};
