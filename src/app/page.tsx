import { PatientDashboard } from "@/components/patient-dashboard";
import { getPatients, getBilling } from "@/lib/data";

export default function Home() {
  const initialPatients = getPatients();
  const initialBilling = getBilling();

  return (
    <main>
      <PatientDashboard
        initialPatients={initialPatients}
        initialBilling={initialBilling}
      />
    </main>
  );
}
