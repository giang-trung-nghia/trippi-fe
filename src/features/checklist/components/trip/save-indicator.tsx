"use client"

import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type SaveIndicatorProps = {
  status?: "idle" | "saving" | "error"
}

export function SaveIndicator({ status = "idle" }: SaveIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs transition-opacity duration-300",
        status === "idle" && "text-green-600",
        status === "saving" && "text-primary",
        status === "error" && "text-destructive"
      )}
    >
      {status === "saving" && (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Saving...</span>
        </>
      )}
      {status === "idle" && (
        <>
          <CheckCircle2 className="h-3 w-3" />
          <span>Saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle className="h-3 w-3" />
          <span>Failed to save</span>
        </>
      )}
    </div>
  )
}
