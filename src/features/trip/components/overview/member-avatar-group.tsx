'use client'

import { Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TripMember } from "@/types/trip"

type MemberAvatarGroupProps = {
  members: TripMember[]
  maxDisplay?: number
  onAddMember?: () => void
  onMemberClick?: (member: TripMember) => void
}

export function MemberAvatarGroup({
  members,
  maxDisplay = 4,
  onAddMember,
  onMemberClick,
}: MemberAvatarGroupProps) {
  const displayedMembers = members.slice(0, maxDisplay)
  const remainingCount = members.length - maxDisplay

  return (
    <div className="flex items-center -space-x-3">
      <TooltipProvider>
        {displayedMembers.map((member) => (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onMemberClick?.(member)}
                className={cn(
                  "relative inline-block rounded-full ring-2 ring-background hover:z-10 transition-transform hover:scale-110",
                  onMemberClick && "cursor-pointer"
                )}
              >
                <Avatar className="size-8">
                  <AvatarImage src={member.user.avatarUrl} alt={member.user.name} />
                  <AvatarFallback>
                    {member.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <p className="font-medium">{member.user.name}</p>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}

        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative inline-flex items-center justify-center size-9 rounded-full ring-2 ring-background bg-muted text-muted-foreground text-xs font-medium">
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                {members.slice(maxDisplay).map((member) => (
                  <p key={member.id}>{member.user.name}</p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {onAddMember && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative inline-flex size-9 rounded-full ring-2 ring-background hover:z-10"
                onClick={onAddMember}
              >
                <Plus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Invite member</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  )
}




