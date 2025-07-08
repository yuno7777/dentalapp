"use client";

import { useState, useMemo } from "react";
import type { Billing, Patient } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { TrendingUp, TrendingDown, IndianRupee } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";

type AllBillingProps = {
  patients: Patient[];
  billing: Billing[];
};

export function AllBilling({ patients, billing }: AllBillingProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const patientMap = useMemo(() => {
    return new Map(patients.map((p) => [p.id, p.name]));
  }, [patients]);

  const filteredBilling = useMemo(() => {
    if (!date) return billing;
    return billing.filter(b => isSameDay(new Date(b.date), date));
  }, [billing, date]);

  const { totalBilled, totalPaid, totalDue } = useMemo(() => {
    let billed = 0;
    let paid = 0;
    filteredBilling.forEach(b => {
      billed += b.cost;
      paid += b.paidAmount ?? 0;
    });
    return {
      totalBilled: billed,
      totalPaid: paid,
      totalDue: billed - paid,
    };
  }, [filteredBilling]);

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
    return [...filteredBilling].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredBilling]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">
            {date ? `Summary for ${format(date, "PPP")}` : "All-Time Summary"}
        </h2>
        <div className="flex items-center gap-2">
          <DatePicker date={date} setDate={setDate} />
          {date && <Button variant="outline" onClick={() => setDate(undefined)}>View All Time</Button>}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalBilled.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total amount invoiced</p>
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
          <CardTitle>Billing Records</CardTitle>
          <CardDescription>
            {date ? `Transactions for ${format(date, "PPP")}` : "A complete history of all financial transactions."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Amount Due</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBilling.length > 0 ? (
                sortedBilling.map((record) => {
                  const paidAmount = record.paidAmount ?? 0;
                  const amountDue = record.cost - paidAmount;
                  return (
                    <TableRow key={record.id}>
                        <TableCell className="font-medium">{patientMap.get(record.patientId) || 'Unknown Patient'}</TableCell>
                        <TableCell>{record.service}</TableCell>
                        <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                        <TableCell>₹{record.cost.toFixed(2)}</TableCell>
                        <TableCell>₹{paidAmount.toFixed(2)}</TableCell>
                        <TableCell className={amountDue > 0 ? "text-destructive" : ""}>₹{amountDue.toFixed(2)}</TableCell>
                        <TableCell><Badge variant={getStatusVariant(record.status)}>{record.status}</Badge></TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No billing records found {date ? `for ${format(date, "PPP")}` : ""}.
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
