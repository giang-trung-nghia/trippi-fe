import UserLayout from "@/components/layouts/UserLayout";

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout customClassName="p-0">{children}</UserLayout>;
}
