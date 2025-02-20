"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export function FirstVisitModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const t = useTranslations("first_visit")

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      setIsOpen(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "1234") {
      localStorage.setItem("hasVisited", "true")
      setIsOpen(false)
    } else {
      setError(true)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (open === false) {
      return
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder={t("password_placeholder")}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-sm text-red-500">{t("error")}</p>}
          <Button type="submit" className="w-full">
            {t("access")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

