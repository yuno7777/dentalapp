export type Patient = {
  id: string;
  name: string;
  phone: string;
  medicalHistory: string;
  lastUpdated: string; 
};

export type Billing = {
  id: string;
  patientId: string;
  service: string;
  cost: number;
  status: 'Paid' | 'Unpaid' | 'Partially Paid';
  date: string;
};
