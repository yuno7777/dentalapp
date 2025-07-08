"use client";

import type { Patient } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "./ui/badge";

type PatientTableProps = {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
  onView: (patient: Patient) => void;
};

export function PatientTable({
  patients,
  onEdit,
  onDelete,
  onView,
}: PatientTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden sm:table-cell">Phone</TableHead>
            <TableHead>Last Appointment</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {patient.email}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {patient.phone}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {format(new Date(patient.lastAppointment), "PPP")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onView(patient)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onEdit(patient)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => onDelete(patient.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
