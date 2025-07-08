"use client";

import { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import type { Billing, Patient } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const billingFormSchema = z.object({
    service: z.string().min(3, "Service description is too short."),
    cost: z.coerce.number().positive("Cost must be a positive number."),
    status: z.enum(["Paid", "Unpaid", "Partially Paid"]),
});

type BillingSectionProps = {
    patient: Patient;
    billingRecords: Billing[];
    onBillingUpdate: (updatedRecords: Billing[] | Billing) => void;
};

export function BillingSection({ patient, billingRecords, onBillingUpdate }: BillingSectionProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [paymentRecord, setPaymentRecord] = useState<Billing | null>(null);

    const form = useForm<z.infer<typeof billingFormSchema>>({
        resolver: zodResolver(billingFormSchema),
        defaultValues: {
            service: "",
            cost: 0,
            status: "Unpaid",
        },
    });

    const handleAddBilling = (values: z.infer<typeof billingFormSchema>) => {
        const newRecord: Billing = {
            ...values,
            id: `b-${new Date().getTime()}`,
            patientId: patient.id,
            date: new Date().toISOString(),
        };
        onBillingUpdate([...billingRecords, newRecord]);
        form.reset();
        setIsFormOpen(false);
    };

    const handleDeleteBilling = (billingId: string) => {
        onBillingUpdate(billingRecords.filter(b => b.id !== billingId));
    };

    const handleShowQr = (record: Billing) => {
        setPaymentRecord(record);
    };

    const handleMarkAsPaid = () => {
        if (!paymentRecord) return;
        
        // This function can now handle single record updates
        onBillingUpdate({ ...paymentRecord, status: 'Paid' });
        
        setPaymentRecord(null); // Close dialog
    };

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


    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Billing Information</CardTitle>
                        <CardDescription>Manage payments and services for this patient.</CardDescription>
                    </div>
                    <Button size="sm" onClick={() => setIsFormOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Entry
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {billingRecords.length > 0 ? (
                                billingRecords.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.service}</TableCell>
                                        <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                                        <TableCell>₹{record.cost.toFixed(2)}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(record.status)}>{record.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            {(record.status === 'Unpaid' || record.status === 'Partially Paid') && (
                                                <Button variant="ghost" size="icon" onClick={() => handleShowQr(record)}>
                                                    <QrCode className="h-4 w-4" />
                                                    <span className="sr-only">Show Payment QR</span>
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteBilling(record.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                <span className="sr-only">Delete billing entry</span>
                                            </Button>
                                        </TableCell>
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

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddBilling)}>
                            <DialogHeader>
                                <DialogTitle>Add Billing Entry</DialogTitle>
                                <DialogDescription>Record a new service or payment for {patient.name}.</DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-4">
                                <FormField control={form.control} name="service" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service Provided</FormLabel>
                                        <FormControl><Input placeholder="e.g., Routine Cleaning" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="cost" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cost (₹)</FormLabel>
                                        <FormControl><Input type="number" step="0.01" placeholder="150.00" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="status" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Paid">Paid</SelectItem>
                                                <SelectItem value="Unpaid">Unpaid</SelectItem>
                                                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Entry</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!paymentRecord} onOpenChange={(open) => !open && setPaymentRecord(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Scan to Pay</DialogTitle>
                        <DialogDescription>
                           Please scan the QR code to pay. You will need to manually enter the amount: ₹{paymentRecord?.cost.toFixed(2)} for "{paymentRecord?.service}".
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center items-center p-4 bg-white rounded-lg">
                        {paymentRecord && (
                            <Image
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=abhisheksatarkar098@okaxis&pn=DentalFlow`}
                                alt="Payment QR Code"
                                width={250}
                                height={250}
                            />
                        )}
                    </div>
                    <DialogFooter className="sm:justify-between">
                        <Button variant="outline" onClick={() => setPaymentRecord(null)}>Cancel</Button>
                        <Button onClick={handleMarkAsPaid}>Mark as Paid</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
