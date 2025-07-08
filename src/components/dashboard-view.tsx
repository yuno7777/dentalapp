"use client";

import { useMemo } from "react";
import type { Patient, Billing, Appointment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, subMonths, isSameMonth, isSameDay } from "date-fns";
import { Users, IndianRupee, CalendarCheck, TrendingUp } from "lucide-react";

type DashboardViewProps = {
  patients: Patient[];
  billing: Billing[];
  appointments: Appointment[];
};

export function DashboardView({ patients, billing, appointments }: DashboardViewProps) {
  const now = new Date();

  const totalPatients = patients.length;

  const monthlyRevenue = useMemo(() => {
    return billing
      .filter(b => isSameMonth(new Date(b.date), now))
      .reduce((sum, b) => sum + (b.paidAmount ?? 0), 0);
  }, [billing]);

  const todaysAppointments = useMemo(() => {
    return appointments.filter(a => isSameDay(new Date(a.date), now)).length;
  }, [appointments]);
  
  const billingTrends = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => subMonths(now, 5 - i));
    
    const monthlyData = last6Months.map(month => {
      const total = billing
        .filter(b => isSameMonth(new Date(b.date), month))
        .reduce((sum, b) => sum + b.cost, 0);
        
      return {
        month: format(month, "MMM"),
        total,
      };
    });

    return monthlyData;
  }, [billing]);

  const chartConfig = {
    total: {
      label: "Billed",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">patients registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month's Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">based on paid amounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAppointments}</div>
            <p className="text-xs text-muted-foreground">scheduled for today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5"/>
            Billing Trends (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={billingTrends}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  indicator="dot"
                />}
              />
              <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
