"use client"

import { useNavigation } from "@/lib/navigation-context"
import { AnimatePresence, motion } from "framer-motion"

export function NavigationProgress() {
  const { isNavigating } = useNavigation()

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed left-0 right-0 top-0 z-[100] h-1.5"
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-full w-full overflow-hidden bg-muted/20">
            <motion.div
              className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

