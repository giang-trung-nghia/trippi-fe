import UserLayout from "@/components/layouts/UserLayout";

export default function MapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserLayout className="p-0">
      <div className="h-full w-full">{children}</div>
    </UserLayout>
  );
}

