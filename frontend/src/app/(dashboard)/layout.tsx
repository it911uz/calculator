import DahboardLayout from "@/components/layouts/dashboard-layout/page";
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DahboardLayout>{children}</DahboardLayout>;
}