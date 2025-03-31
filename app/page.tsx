"use client";  // Ensure it's a client component

import React, { useState } from 'react';
import { ModeToggle } from '@/components/modetoggle';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

import { Settings } from "lucide-react";
import ReportComponent from '@/components/ReportComponent';
import { useToast } from '@/components/ui/use-toast';
import ChatComponent from '@/components/chatComponent';

const HomeComponent = () => {
  const { toast } = useToast()

  const [reportData, setreportData] = useState("");
  const onReportConfirmation = (data: string) => {
    setreportData(data);
    toast("Updated!"); // Pass the message directly as a string
  }
  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] bg-background items-center gap-1 border-b px-4">
          <h1 className="text-xl font-semibold text-[#D90013]">
            <span className="flex flex-row">Adv.AlmostLawyer</span>
          </h1>
          <div className="w-full flex flex-row justify-end gap-2">
            <ModeToggle />
            <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh] p-4">
              <DrawerTitle>Report Details</DrawerTitle>
              <DrawerDescription>Upload and summarize your report here.</DrawerDescription>
              <ReportComponent onReportConfirmation={(data) => console.log("Confirmed Report:", data)} />
            </DrawerContent>
          </Drawer>
          </div>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4
        md:grid-cols-2
        lg:grid-cols-3"
        >
          <div
            className="hidden md:flex flex-col"
          >
            <ReportComponent onReportConfirmation={onReportConfirmation} />
            {/* <SideComponent onReportConfirmation={onReportConfirmation} /> */}
          </div>
          <div
            className="lg:col-span-2"
          >
            <ChatComponent reportData={reportData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeComponent;
