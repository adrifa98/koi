"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

export function FirstVisitModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      setIsOpen(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "1234") {
      // Contraseña simple para demostración
      localStorage.setItem("hasVisited", "true")
      setIsOpen(false)
    } else {
      setError(true)
    }
  }

  // Prevenir que el usuario cierre el modal
  const handleOpenChange = (open: boolean) => {
    if (open === false) {
      // No permitir cerrar el modal
      return
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>WEB NO OFICIAL</DialogTitle>
          <DialogDescription>Desarrollada solo para motivos didácticos.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-sm text-red-500">Contraseña incorrecta</p>}
          <Button type="submit" className="w-full">
            Acceder
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

