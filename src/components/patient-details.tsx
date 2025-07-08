"use client";

import type { Patient, Billing } from "@/lib/types";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Stethoscope, User, Phone, ClipboardList } from "lucide-react";
import { BillingSection } from "./billing-section";

type PatientDetailsProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  patient: Patient | null;
  billingRecords: Billing[];
  onBillingUpdate: (updatedRecords: Billing[] | Billing) => void;
};

export function PatientDetails({
  isOpen,
  onOpenChange,
  patient,
  billingRecords,
  onBillingUpdate
}: PatientDetailsProps) {
  if (!patient) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl">{patient.name}</SheetTitle>
          <SheetDescription>
            Detailed patient record and billing history.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto pr-4 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>Patient Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span>
                    Last updated:{" "}
                    {format(new Date(patient.lastUpdated), "MMMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  <span>Medical History</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{patient.medicalHistory}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                <span>Treatment Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{patient.treatment || 'No active treatment specified.'}</p>
            </CardContent>
          </Card>

          <BillingSection
            patient={patient}
            billingRecords={billingRecords}
            onBillingUpdate={onBillingUpdate}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
