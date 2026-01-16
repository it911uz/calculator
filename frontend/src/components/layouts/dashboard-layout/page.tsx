"use client";
import Aside from "@/components/aside/page";
import Header from "@/components/header/page";
import MainLayout from "@/components/main/page";
import React, { ReactNode, useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8f9fab0]">
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <Aside isOpen={isOpen} />
      <main
        className={`pt-20 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        <MainLayout>{children}</MainLayout>
      </main>
    </div>
  );
};

export default DashboardLayout;