"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, ExternalLink, Plus, Share2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VideoActionsProps {
  videoId: string
  title: string
}

export function VideoActions({ videoId, title }: VideoActionsProps) {
  const [isAdded, setIsAdded] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.share({
        title: title,
        url: window.location.href,
      })
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  const handleAdd = () => {
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" className="relative" onClick={handleAdd}>
              <AnimatePresence>
                {isAdded ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Plus className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isAdded ? "Added to Watchlist" : "Add to Watchlist"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" asChild>
              <a href={`https://youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Watch on YouTube</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

