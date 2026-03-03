"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserLayout from "@/components/layouts/UserLayout";
import { Button } from "@/components/ui/button";
import { TripFormDialog } from "@/features/trip/components/trips/trip-form-dialog";
import { useUserStore } from "@/store/use-user-store";
import { Plane, MapPin, Calendar, Users } from "lucide-react";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const handleStartTrip = () => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    setDialogOpen(true);
  };

  const features = [
    {
      icon: MapPin,
      title: "Discover Places",
      description: "Explore and add amazing destinations to your itinerary",
    },
    {
      icon: Calendar,
      title: "Plan Your Days",
      description: "Organize your trip day by day with detailed schedules",
    },
    {
      icon: Users,
      title: "Collaborate",
      description: "Invite friends and plan your adventures together",
    },
  ];

  return (
    <UserLayout>
      <div className="flex items-center justify-center min-h-full ">
        <div className="max-w-5xl w-full py-12 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-sky-500 rounded-full mb-6 shadow-lg">
              <Plane className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-sky-600">
              Plan Your Perfect Trip
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create unforgettable travel experiences with our easy-to-use trip planning tool
            </p>
            
            <Button
              size="lg"
              onClick={handleStartTrip}
              className="text-lg px-8 py-6 bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plane className="mr-2 h-5 w-5" />
              Let&apos;s Start a New Trip
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-sky-100 hover:border-sky-300"
                >
                  <div className="inline-flex items-center justify-center p-3 bg-sky-100 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Trip Creation Dialog */}
      {isAuthenticated && (
        <TripFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </UserLayout>
  );
}
