"use client";

import { useMemo } from "react";
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
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
};

export function AppointmentsView({ appointments, patients, onAdd, onEdit, onDelete, selectedDate, setSelectedDate }: AppointmentsViewProps) {
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
    <div className="p-4 flex flex-col lg:flex-row gap-6">
      <div className="lg:w-auto">
        <Card>
          <CardContent className="p-0 flex justify-center">
             <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
             />
          </CardContent>
        </Card>
      </div>
      <div className="flex-1">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>
                Appointments for {selectedDate ? format(selectedDate, "PPP") : "..."}
              </CardTitle>
              <CardDescription>
                {dailyAppointments.length} appointment(s) scheduled for this day.
              </CardDescription>
            </div>
            <Button size="sm" onClick={onAdd} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </CardHeader>
          <CardContent>
            {dailyAppointments.length > 0 ? (
                <ul className="space-y-4">
                  {dailyAppointments.map(app => (
                    <li key={app.id} className="p-4 bg-secondary rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <p className="font-semibold text-foreground break-words">{patientMap.get(app.patientId) || 'Unknown Patient'}</p>
                        <p className="text-sm text-muted-foreground break-words">{app.reason}</p>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Badge variant="outline" className="whitespace-nowrap">{formatTime(app.time)}</Badge>
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
