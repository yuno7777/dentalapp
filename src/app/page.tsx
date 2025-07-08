"use client";

import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";
import type { Patient, Billing, Appointment } from "@/lib/types";
import { getPatients, getBilling, getAppointments } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, PlusCircle, IndianRupee, CalendarDays } from "lucide-react";
import {
  MagnifyingGlassIcon,
} from "@/components/icons";
import { PatientTable } from "@/components/patient-table";
import { PatientForm } from "@/components/patient-form";
import { PatientDetails } from "@/components/patient-details";
import { AllBilling } from "@/components/all-billing";
import { AppointmentsView } from "@/components/appointments-view";
import { AppointmentForm } from "@/components/appointment-form";
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
import { DashboardView } from "@/components/dashboard-view";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [billing, setBilling] = useState<Billing[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [activeView, setActiveView] = useState("patients");
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [isAppointmentAlertOpen, setIsAppointmentAlertOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const dataLoaded = useRef(false);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPatients = localStorage.getItem("patients");
      setPatients(storedPatients ? JSON.parse(storedPatients) : getPatients());

      const storedBilling = localStorage.getItem("billing");
      setBilling(storedBilling ? JSON.parse(storedBilling) : getBilling());
      
      const storedAppointments = localStorage.getItem("appointments");
      setAppointments(storedAppointments ? JSON.parse(storedAppointments) : getAppointments());

    } catch (error) {
      console.error("Could not load data from localStorage", error);
      setPatients(getPatients());
      setBilling(getBilling());
      setAppointments(getAppointments());
    }
    dataLoaded.current = true;
  }, []);

  useEffect(() => {
    if (dataLoaded.current) {
      localStorage.setItem("patients", JSON.stringify(patients));
    }
  }, [patients]);

  useEffect(() => {
    if (dataLoaded.current) {
      localStorage.setItem("billing", JSON.stringify(billing));
    }
  }, [billing]);

  useEffect(() => {
    if (dataLoaded.current) {
      localStorage.setItem("appointments", JSON.stringify(appointments));
    }
  }, [appointments]);

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

  const handleBillingUpdate = (updatedBillingForPatient: Billing[] | Billing) => {
    if (Array.isArray(updatedBillingForPatient)) {
      if (!selectedPatient) return;
      const otherPatientsBilling = billing.filter(
        (b) => b.patientId !== selectedPatient.id
      );
      setBilling([...otherPatientsBilling, ...updatedBillingForPatient]);
    } else {
      setBilling(
        billing.map((b) =>
          b.id === updatedBillingForPatient.id ? updatedBillingForPatient : b
        )
      );
    }
    toast({
      title: "Billing Updated",
      description: "The patient's billing information has been updated.",
    });
  };

  const handleAddNewAppointment = () => {
    setIsAppointmentFormOpen(true);
  };

  const handlePromptDeleteAppointment = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setIsAppointmentAlertOpen(true);
  };

  const handleDeleteAppointment = () => {
    if (!appointmentToDelete) return;
    setAppointments(appointments.filter((a) => a.id !== appointmentToDelete));
    toast({
      title: "Appointment Deleted",
      description: "The appointment has been removed from the schedule.",
      variant: "destructive",
    });
    setAppointmentToDelete(null);
    setIsAppointmentAlertOpen(false);
  };
  
  const handleAppointmentFormSubmit = (values: Appointment) => {
    setAppointments([values, ...appointments]);
    toast({
      title: "Appointment Scheduled",
      description: `The appointment has been successfully added to the schedule.`,
    });
    setIsAppointmentFormOpen(false);
  };
  

  const patientBillingRecords = useMemo(() => {
    if (!selectedPatient) return [];
    return billing.filter((b) => b.patientId === selectedPatient.id);
  }, [selectedPatient, billing]);

  const navItems = [
    { id: "patients", label: "Patients", icon: Users, onClick: () => setActiveView("patients") },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, onClick: () => setActiveView("dashboard") },
    { id: "appointments", label: "Appointments", icon: CalendarDays, onClick: () => setActiveView("appointments") },
    { id: "billing", label: "Billing Info", icon: IndianRupee, onClick: () => setActiveView("billing") },
  ];

  return (
    <>
      <main className="flex h-full min-h-screen grow justify-center p-6">
        <div className="flex w-full max-w-7xl gap-1">
          {/* Sidebar */}
          <aside className="w-80 p-4 flex flex-col justify-between">
            <div>
              <div className="flex flex-col mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M9.36 1.503A2.034 2.034 0 0 1 11.393 1h1.214a2.034 2.034 0 0 1 2.033 1.503l.923 5.535A4.068 4.068 0 0 1 16 11.235v.002c0 1.27-1.116 2.43-2.126 3.256a12.86 12.86 0 0 1-3.748 2.515 12.86 12.86 0 0 1-3.748-2.515C5.116 13.667 4 12.506 4 11.237v-.002a4.068 4.068 0 0 1 .43-2.197l.923-5.535Z" />
                      <path d="M4.64 15.5c.63 1.25 1.48 2.37 2.45 3.25a12.86 12.86 0 0 0 3.91 2.5 12.86 12.86 0 0 0 3.91-2.5c.97-.88 1.82-2 2.45-3.25" />
                    </svg>
                  </div>
                  <h1 className="text-foreground text-xl font-bold">
                    Dr. Shailendra Satarkar
                  </h1>
                </div>
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
                      activeView === item.id ? "bg-accent" : "hover:bg-accent/50",
                      !item.onClick && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div>
              <ThemeToggle />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-[960px] flex-col">
            {activeView === 'patients' ? (
              <>
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
              </>
            ) : activeView === 'dashboard' ? (
              <DashboardView
                patients={patients}
                billing={billing}
                appointments={appointments}
              />
            ) : activeView === 'appointments' ? (
              <AppointmentsView
                appointments={appointments}
                patients={patients}
                onAdd={handleAddNewAppointment}
                onDelete={handlePromptDeleteAppointment}
                selectedDate={selectedDate}
                setSelectedDate={(date) => {
                  if (date instanceof Date) {
                    setSelectedDate(date);
                  }
                }}
              />
            ) : activeView === 'billing' ? (
              <AllBilling patients={patients} billing={billing} />
            ) : null}
          </div>
        </div>
      </main>

      <PatientForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        patient={selectedPatient}
        onSubmit={handleFormSubmit}
      />

      <AppointmentForm
        isOpen={isAppointmentFormOpen}
        onOpenChange={setIsAppointmentFormOpen}
        patients={patients}
        onSubmit={handleAppointmentFormSubmit}
        selectedDate={selectedDate}
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

      <AlertDialog open={isAppointmentAlertOpen} onOpenChange={setIsAppointmentAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this appointment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAppointment}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
