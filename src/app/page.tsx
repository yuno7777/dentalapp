"use client";

import { useState, useMemo } from "react";
import type { Patient, Billing } from "@/lib/types";
import { getPatients, getBilling } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, PlusCircle } from "lucide-react";
import {
  MagnifyingGlassIcon,
  CurrencyCircleDollarIcon,
} from "@/components/icons";
import { PatientTable } from "@/components/patient-table";
import { PatientForm } from "@/components/patient-form";
import { PatientDetails } from "@/components/patient-details";
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
import { cn } from "@/lib/utils";

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>(getPatients());
  const [billing, setBilling] = useState<Billing[]>(getBilling());
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [activeNavItem, setActiveNavItem] = useState("patients");

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
      variant: "destructive",
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
  };

  const patientBillingRecords = useMemo(() => {
    if (!selectedPatient) return [];
    return billing.filter((b) => b.patientId === selectedPatient.id);
  }, [selectedPatient, billing]);

  const navItems = [
    { id: "patients", label: "Patients", icon: Users, onClick: () => setActiveNavItem("patients") },
    { id: "billing", label: "Billing Info", icon: CurrencyCircleDollarIcon },
  ];

  return (
    <>
      <main className="flex h-full min-h-screen grow justify-center p-6">
        <div className="flex w-full max-w-7xl gap-1">
          {/* Sidebar */}
          <aside className="w-80 p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <h1 className="text-foreground text-base font-medium leading-normal">
                  Dental App
                </h1>
                <p className="text-muted-foreground text-sm font-normal leading-normal">
                  Manage your patients and billing efficiently
                </p>
              </div>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    disabled={!item.onClick}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium leading-normal text-foreground transition-colors",
                      activeNavItem === item.id ? "bg-accent" : "hover:bg-accent/50",
                      !item.onClick && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-[960px] flex-col">
            <div className="px-4 py-3 flex justify-between items-center gap-4">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients"
                  className="h-12 w-full rounded-lg bg-input pl-12 text-base text-foreground placeholder:text-muted-foreground focus:ring-0 border-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </div>
            <div className="p-4">
              <PatientTable
                patients={filteredPatients}
                onEdit={handleEdit}
                onDelete={handlePromptDelete}
                onView={handleView}
              />
            </div>
          </div>
        </div>
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
    </>
  );
}
