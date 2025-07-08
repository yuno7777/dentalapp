"use client";

import type { Billing, Patient } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useMemo } from "react";
import { TrendingUp, TrendingDown, IndianRupee } from "lucide-react";

type AllBillingProps = {
  patients: Patient[];
  billing: Billing[];
};

export function AllBilling({ patients, billing }: AllBillingProps) {
  const patientMap = useMemo(() => {
    return new Map(patients.map((p) => [p.id, p.name]));
  }, [patients]);

  const { totalBilled, totalPaid, totalDue } = useMemo(() => {
    let billed = 0;
    let paid = 0;
    billing.forEach(b => {
      billed += b.cost;
      if (b.status === 'Paid') {
        paid += b.cost;
      }
    });
    // For simplicity, we calculate 'due' as total minus paid.
    // A more complex system might handle partial payments differently.
    return {
      totalBilled: billed,
      totalPaid: paid,
      totalDue: billed - paid,
    };
  }, [billing]);

  const getStatusVariant = (status: Billing['status']): "default" | "secondary" | "destructive" => {
    switch (status) {
        case "Paid":
            return "default";
        case "Partially Paid":
            return "secondary";
        case "Unpaid":
            return "destructive";
    }
  }

  const sortedBilling = useMemo(() => {
    return [...billing].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [billing]);

  return (
    <div className="p-4 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalBilled.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total amount invoiced to patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPaid.toFixed(2)}</div>
             <p className="text-xs text-muted-foreground">Total payments received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Dues</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total unpaid or partially paid amount</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Billing Records</CardTitle>
          <CardDescription>A complete history of all financial transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBilling.length > 0 ? (
                sortedBilling.map((record) => (
                    <TableRow key={record.id}>
                        <TableCell className="font-medium">{patientMap.get(record.patientId) || 'Unknown Patient'}</TableCell>
                        <TableCell>{record.service}</TableCell>
                        <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                        <TableCell>₹{record.cost.toFixed(2)}</TableCell>
                        <TableCell><Badge variant={getStatusVariant(record.status)}>{record.status}</Badge></TableCell>
                    </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No billing records found.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
