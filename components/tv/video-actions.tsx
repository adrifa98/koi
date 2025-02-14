"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, ExternalLink, Plus, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocale, useTranslations } from 'next-intl'

interface VideoActionsProps {
  videoId: string
  title: string
  channelName: string
}

export function VideoActions({ videoId, title, channelName }: VideoActionsProps) {
  const router = useRouter()
  const [isAdded, setIsAdded] = useState(false)

  const getChannelSlug = (name: string) => {
    switch (name) {
      case "Movistar KOI":
        return "movistar-koi"
      case "Movistar KOI League of Legends":
        return "league-of-legends"
      case "Movistar KOI Valorant":
        return "valorant"
      case "Toronto Ultra":
        return "toronto-ultra"
      case "Movistar KOI VODS":
        return "movistar-koi"
      default:
        return "movistar-koi"
    }
  }

  const handleAdd = () => {
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }
  const locale = useLocale();
  const handleShare = () => {
    const channelSlug = getChannelSlug(channelName)
    
    const shareUrl = `/${locale}/community/${channelSlug}/create?video=${videoId}`
    router.push(shareUrl)
  }
  const t = useTranslations('video');
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="sm" className="hover:bg-primary/90" onClick={handleAdd}>
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {t('watchlist.added')}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Watchlist
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isAdded ? t('watchlist.addTooltip') : t('watchlist.add')}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleShare} className="hover:bg-accent">
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('share.inCommunity')}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild className="hover:bg-accent">
              <a href={`https://youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('watch.onYoutube')}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

