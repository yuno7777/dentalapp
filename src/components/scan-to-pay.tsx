"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ScanToPay() {
    const { toast } = useToast();
    const upiId = "satarkarsd@oksbi";
    const payeeName = "Shailendra Satarkar";

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId);
        toast({
            title: "UPI ID Copied!",
            description: "You can now paste it in your payment app.",
        });
    };

    return (
        <div className="p-4 flex flex-col justify-center items-center pt-10 gap-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src="https://placehold.co/48x48.png" alt={payeeName} data-ai-hint="profile person"/>
                    <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{payeeName}</h2>
            </div>
            
            <Card className="w-full max-w-xs shadow-lg">
                <CardContent className="flex flex-col items-center gap-4 p-4">
                    <div className="p-2 bg-white rounded-lg mt-2">
                        <Image
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}`}
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
