"use client";

import { useState, useMemo } from "react";
import type { Patient, Billing } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToothIcon } from "@/components/icons";
import { PatientTable } from "@/components/patient-table";
import { PatientForm } from "@/components/patient-form";
import { PatientDetails } from "@/components/patient-details";
import { UserPlus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type PatientDashboardProps = {
  initialPatients: Patient[];
  initialBilling: Billing[];
};

export function PatientDashboard({
  initialPatients,
  initialBilling,
}: PatientDashboardProps) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [billing, setBilling] = useState<Billing[]>(initialBilling);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  const filteredPatients = useMemo(() => {
    return patients.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  const handleAddNew = () => {
    setSelectedPatient(null);
    setIsFormOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsOpen(true);
  };

  const handlePromptDelete = (patientId: string) => {
    setPatientToDelete(patientId);
    setIsAlertOpen(true);
  };

  const handleDelete = () => {
    if (!patientToDelete) return;
    setPatients(patients.filter((p) => p.id !== patientToDelete));
    setBilling(billing.filter((b) => b.patientId !== patientToDelete));
    toast({
      title: "Patient Deleted",
      description: "The patient record has been successfully removed.",
    });
    setPatientToDelete(null);
    setIsAlertOpen(false);
  };

  const handleFormSubmit = (values: Patient) => {
    const isEditing = !!selectedPatient;
    if (isEditing) {
      setPatients(patients.map((p) => (p.id === values.id ? values : p)));
      toast({
        title: "Patient Updated",
        description: `${values.name}'s record has been successfully updated.`,
      });
    } else {
      setPatients([values, ...patients]);
      toast({
        title: "Patient Added",
        description: `${values.name} has been successfully added to the system.`,
      });
    }
    setSelectedPatient(null);
  };

  const handleBillingUpdate = (updatedBilling: Billing[]) => {
    setBilling(updatedBilling);
    toast({
      title: "Billing Updated",
      description: "The patient's billing information has been updated.",
    });
  }

  const patientBillingRecords = useMemo(() => {
    if (!selectedPatient) return [];
    return billing.filter(b => b.patientId === selectedPatient.id);
  }, [selectedPatient, billing]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <ToothIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-headline">DentalFlow</span>
        </div>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search patients..."
                className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[320px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button onClick={handleAddNew}>
                <UserPlus className="mr-2 h-4 w-4" /> Add Patient
            </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <PatientTable
          patients={filteredPatients}
          onEdit={handleEdit}
          onDelete={handlePromptDelete}
          onView={handleView}
        />
      </main>

      <PatientForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        patient={selectedPatient}
        onSubmit={handleFormSubmit}
      />

      <PatientDetails
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        patient={selectedPatient}
        billingRecords={patientBillingRecords}
        onBillingUpdate={handleBillingUpdate}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              patient's record and all associated billing information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
