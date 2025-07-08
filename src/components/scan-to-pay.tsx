"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ScanToPay() {
    const { toast } = useToast();
    const upiId = "abhisheksatarkar098@okaxis";

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId);
        toast({
            title: "UPI ID Copied!",
            description: "You can now paste it in your payment app.",
        });
    };

    return (
        <div className="p-4 flex justify-center items-start pt-10">
            <Card className="w-full max-w-sm shadow-2xl">
                <CardHeader className="items-center text-center pb-2">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src="https://placehold.co/40x40.png" alt="Abhishek Satarkar" data-ai-hint="profile person"/>
                            <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl font-bold">Abhishek Satarkar</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-white rounded-lg mt-2">
                        <Image
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${upiId}&pn=Dr.%20Shailendra%20Satarkar`}
                            alt="Payment QR Code"
                            width={250}
                            height={250}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">Scan to pay with any UPI app</p>
                    <div className="w-full p-3 bg-secondary rounded-lg flex flex-col items-center gap-3 mt-2">
                         <p className="font-mono text-sm text-center">Punjab National Bank ****3832</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>UPI ID: {upiId}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                                <Clipboard className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
