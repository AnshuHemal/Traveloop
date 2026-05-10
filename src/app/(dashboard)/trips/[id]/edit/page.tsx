import { redirect } from "next/navigation";

// Placeholder — edit page coming soon
export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/trips/${id}`);
}
