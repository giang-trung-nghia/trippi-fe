'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/use-user-store"
import { TripFormDialog } from "./trip-form-dialog"

type CreateTripDialogProps = {
  collapsed: boolean
}

export function CreateTripDialog({ collapsed }: CreateTripDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  
  const handleCreateClick = () => {
    if (!isAuthenticated) {
      router.push("/sign-in")
      return
    }
    setOpen(true)
  }

  return (
    <>
      <Button
        size="sm"
        className={cn(
          "justify-center gap-2",
          collapsed ? "w-10 h-10 rounded-full p-0" : "w-full"
        )}
        onClick={handleCreateClick}
      >
        <PlusIcon className="size-4" />
        <span className={collapsed ? "sr-only" : ""}>Create new trip</span>
      </Button>
      
      {isAuthenticated && (
        <TripFormDialog open={open} onOpenChange={setOpen} />
      )}
    </>
  )
}

