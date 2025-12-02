"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TimePicker({
  value = "",
  onChange,
  placeholder = "Select time",
  disabled,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [hours, setHours] = React.useState("")
  const [minutes, setMinutes] = React.useState("")

  // Parse initial value
  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":")
      setHours(h || "")
      setMinutes(m || "")
    }
  }, [value])

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "")
    if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 23)) {
      setHours(val)
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "")
    if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
      setMinutes(val)
    }
  }

  const handleApply = () => {
    if (hours && minutes) {
      const formattedHours = hours.padStart(2, "0")
      const formattedMinutes = minutes.padStart(2, "0")
      const timeString = `${formattedHours}:${formattedMinutes}`
      onChange?.(timeString)
      setOpen(false)
    }
  }

  const handleClear = () => {
    setHours("")
    setMinutes("")
    onChange?.("")
    setOpen(false)
  }

  const displayValue = value || placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium">Select Time (24h format)</div>
          
          <div className="flex items-center gap-2">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Hours</label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="00"
                value={hours}
                onChange={handleHoursChange}
                maxLength={2}
                className="w-16 text-center"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleApply()
                  }
                }}
              />
            </div>
            
            <div className="pt-6 text-2xl font-semibold">:</div>
            
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Minutes</label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="00"
                value={minutes}
                onChange={handleMinutesChange}
                maxLength={2}
                className="w-16 text-center"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleApply()
                  }
                }}
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Hours: 00-23 | Minutes: 00-59
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleClear}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={!hours || !minutes}
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Simple inline time input for cases where popover might be too much
export function TimeInput({
  value = "",
  onChange,
  placeholder = "HH:MM",
  disabled,
  className,
}: TimePickerProps) {
  const [internalValue, setInternalValue] = React.useState(value)

  React.useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d:]/g, "")
    
    // Auto-format as user types
    if (val.length === 2 && !val.includes(":") && internalValue.length < val.length) {
      val = val + ":"
    }
    
    // Validate format
    const parts = val.split(":")
    if (parts.length <= 2) {
      const hours = parts[0]
      const minutes = parts[1]
      
      if (hours && parseInt(hours) > 23) return
      if (minutes && parseInt(minutes) > 59) return
      if (hours && hours.length > 2) return
      if (minutes && minutes.length > 2) return
      
      setInternalValue(val)
      
      // Only call onChange if we have a complete time
      if (val.match(/^\d{2}:\d{2}$/)) {
        onChange?.(val)
      } else if (val === "") {
        onChange?.("")
      }
    }
  }

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={internalValue}
        onChange={handleChange}
        disabled={disabled}
        className={cn("pl-9", className)}
        maxLength={5}
      />
      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  )
}

