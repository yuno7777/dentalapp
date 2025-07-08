"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Patient, Appointment } from "@/lib/types";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { DatePicker } from "./ui/date-picker";

const formSchema = z.object({
  patientId: z.string().min(1, "Please select a patient."),
  date: z.date({ required_error: "Please select a date." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)."),
  reason: z.string().min(3, "Reason must be at least 3 characters."),
});

type AppointmentFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  patients: Patient[];
  appointment?: Appointment | null;
  onSubmit: (values: Appointment) => void;
};

export function AppointmentForm({
  isOpen,
  onOpenChange,
  patients,
  appointment,
  onSubmit,
}: AppointmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      date: new Date(),
      time: "",
      reason: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      // Format time as HH:MM for the input default
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;

      form.reset({
        patientId: appointment?.patientId || "",
        date: appointment ? new Date(appointment.date) : new Date(),
        time: appointment?.time || currentTime,
        reason: appointment?.reason || "",
      });
    }
  }, [isOpen, appointment, form]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      id: appointment?.id || `appt-${new Date().getTime()}`,
      patientId: values.patientId,
      date: values.date.toISOString(),
      time: values.time,
      reason: values.reason,
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
                {appointment ? "Edit Appointment" : "Schedule New Appointment"}
              </SheetTitle>
              <SheetDescription>
                {appointment
                  ? "Update the appointment details."
                  : "Fill in the details to schedule a new appointment."}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto py-6 pr-4 space-y-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a patient" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {patients.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <DatePicker date={field.value} setDate={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Visit</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Routine check-up, tooth pain, etc."
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
              <Button type="submit">Save Appointment</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
