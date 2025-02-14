"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { Share } from "lucide-react"

interface CopyLinkProps {
  url: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export function CopyLink({ url, variant = "outline", size = "icon" }: CopyLinkProps) {
  async function copyToClipboard() {
    await navigator.clipboard.writeText(`${location.origin}${url}`)
    toast({
      description: "Link copied to clipboard",
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} size={size} onClick={copyToClipboard} className="hover:bg-accent">
            <Share className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy Link</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CopyLink

