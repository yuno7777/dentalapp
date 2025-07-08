"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Patient } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "Phone number seems too short."),
  medicalHistory: z.string().optional(),
  lastAppointment: z.date({ required_error: "An appointment date is required." }),
});

type PatientFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  patient?: Patient | null;
  onSubmit: (values: Patient) => void;
};

export function PatientForm({
  isOpen,
  onOpenChange,
  patient,
  onSubmit,
}: PatientFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      medicalHistory: "",
      lastAppointment: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: patient?.name || "",
        phone: patient?.phone || "",
        medicalHistory: patient?.medicalHistory || "",
        lastAppointment: patient ? new Date(patient.lastAppointment) : undefined,
      });
    }
  }, [isOpen, patient, form]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      id: patient?.id || new Date().toISOString(),
      medicalHistory: values.medicalHistory || "None.",
      lastAppointment: values.lastAppointment.toISOString(),
    });
    form.reset();
    onOpenChange(false);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col h-full"
          >
            <SheetHeader>
              <SheetTitle>
                {patient ? "Edit Patient" : "Add New Patient"}
              </SheetTitle>
              <SheetDescription>
                {patient
                  ? "Update the patient's information."
                  : "Fill in the details to add a new patient record."}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto py-6 pr-4 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="555-123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastAppointment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Appointment</FormLabel>
                    <FormControl>
                        <DatePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Allergies, chronic conditions, etc."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Save Patient</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
