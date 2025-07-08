"use client";

import { useState, useMemo } from "react";
import type { Appointment, Patient } from "@/lib/types";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AppointmentsViewProps = {
  appointments: Appointment[];
  patients: Patient[];
  onAdd: () => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
};

export function AppointmentsView({ appointments, patients, onAdd, onEdit, onDelete }: AppointmentsViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const patientMap = useMemo(() => {
    return new Map(patients.map((p) => [p.id, p.name]));
  }, [patients]);
  
  const dailyAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointments
      .filter(a => isSameDay(new Date(a.date), selectedDate))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate]);
  
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${formattedHour}:${minute} ${ampm}`;
  }

  return (
    <div className="p-4 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-0">
             <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
             />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                Appointments for {selectedDate ? format(selectedDate, "PPP") : "..."}
              </CardTitle>
              <CardDescription>
                {dailyAppointments.length} appointment(s) scheduled for this day.
              </CardDescription>
            </div>
            <Button size="sm" onClick={onAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </CardHeader>
          <CardContent>
            {dailyAppointments.length > 0 ? (
                <ul className="space-y-4">
                  {dailyAppointments.map(app => (
                    <li key={app.id} className="p-4 bg-secondary rounded-lg flex items-center justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <p className="font-semibold text-foreground">{patientMap.get(app.patientId) || 'Unknown Patient'}</p>
                        <p className="text-sm text-muted-foreground">{app.reason}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{formatTime(app.time)}</Badge>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(app)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(app.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
            ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground">
                    <p>No appointments scheduled for this day.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
