import { requireUser } from "@/lib/session";
import { DashboardNav } from "./_components/dashboard-nav";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <DashboardNav user={user} />
      <main className="flex-1 px-4 py-6 pb-24 sm:px-6 sm:pb-6 lg:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
      {}
      <MobileBottomNav />
    </div>
  );
}
