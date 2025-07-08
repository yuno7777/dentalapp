"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ScanToPayDialogProps = {
    upiId: string;
    payeeName: string;
    amount: number;
}

export function ScanToPayDialog({ upiId, payeeName, amount }: ScanToPayDialogProps) {
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId);
        toast({
            title: "UPI ID Copied!",
            description: "You can now paste it in your payment app.",
        });
    };

    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

    return (
        <div className="flex flex-col justify-center items-center pt-4 gap-4">
            <Card className="w-full max-w-xs shadow-lg">
                <CardContent className="flex flex-col items-center gap-4 p-4">
                    <div className="p-2 bg-white rounded-lg mt-2">
                        <Image
                            src={qrCodeUrl}
                            alt="Payment QR Code"
                            width={250}
                            height={250}
                        />
                    </div>
                    <div className="w-full p-3 bg-secondary rounded-lg flex items-center justify-between gap-2 mt-2">
                        <span className="font-mono text-sm text-center w-full">UPI ID: {upiId}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={handleCopy}>
                            <Clipboard className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground">Scan to pay with any UPI app</p>
        </div>
    );
}
