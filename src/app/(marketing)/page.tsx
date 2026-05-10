// This route group page is not used — the root "/" page.tsx handles the landing page directly
// to avoid layout conflicts. This file exists only to satisfy Next.js route group conventions.
import { redirect } from "next/navigation";
export default function MarketingIndexPage() {
  redirect("/");
}
