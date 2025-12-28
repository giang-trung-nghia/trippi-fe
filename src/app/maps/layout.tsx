import UserLayout from "@/components/layouts/UserLayout";

export default function MapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserLayout customClassName="p-0">
      <div className="h-full w-full overflow-hidden">{children}</div>
    </UserLayout>
  );
}

