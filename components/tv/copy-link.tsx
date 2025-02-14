"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { Share } from "lucide-react"
import { useTranslations } from 'next-intl'

interface CopyLinkProps {
  url: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export function CopyLink({ url, variant = "outline", size = "icon" }: CopyLinkProps) {
  const t = useTranslations('video');
  async function copyToClipboard() {
    await navigator.clipboard.writeText(`${location.origin}${url}`)
    toast({
      description: t('share.linkCopied')
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
        <TooltipContent>{t('share.copyLink')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CopyLink

