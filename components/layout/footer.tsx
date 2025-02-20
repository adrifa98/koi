"use client"

import { KoiNavIcon } from "@/components/layout/navbar/GameIcons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { DiscIcon as Discord, Instagram, Twitch, Twitter, Youtube } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"

const sponsors = [
  "/patros/movistar.png",
  "/patros/cupra.png",
  "/patros/razer.png",
  "/patros/mahou.png",
  "/patros/omen.png",
  "/patros/ecoembes.png",
  "/patros/medicos.png",
]

const socialLinks = [
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "Youtube", href: "#", icon: Youtube },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Twitch", href: "#", icon: Twitch },
  { name: "Discord", href: "#", icon: Discord },
]

export default function Footer() {
  const t = useTranslations("footer")

  const footerLinks = {
    account: [
      { name: t("account.personalInfo"), href: "/account" },
      { name: t("account.orders"), href: "/orders" },
      { name: t("account.invoices"), href: "/invoices" },
      { name: t("account.addresses"), href: "/addresses" },
      { name: t("account.vouchers"), href: "/vouchers" },
      { name: t("account.cookieSettings"), href: "/cookie-settings" },
    ],
    services: [
      { name: t("services.aboutUs"), href: "/about" },
      { name: t("services.contact"), href: "/contact" },
      { name: t("services.faq"), href: "/faq" },
      { name: t("services.shipping"), href: "/shipping" },
      { name: t("services.sizeGuide"), href: "/size-guide" },
      { name: t("services.returns"), href: "/returns" },
    ],
    privacy: [
      { name: t("privacy.legal"), href: "/legal" },
      { name: t("privacy.cookies"), href: "/cookies" },
      { name: t("privacy.lopd"), href: "/privacy" },
      { name: t("privacy.terms"), href: "/terms" },
    ],
  }

  return (
    <footer className="w-full border-t bg-background">
      {/* Sponsors Marquee */}
      <div className="relative w-full overflow-hidden py-6 pb-12">
        <div className="flex absolute whitespace-nowrap animate-marquee">
          {[...sponsors, ...sponsors, ...sponsors, ...sponsors].map((sponsor, i) => (
            <div key={i} className="mx-6 relative h-6 w-12 flex-shrink-0 grayscale transition-all hover:grayscale-0">
              <Image src={sponsor || "/placeholder.svg"} alt={`Sponsor ${i + 1}`} fill className="object-contain" />
            </div>
          ))}
        </div>
        <div className="flex absolute whitespace-nowrap animate-marquee2">
          {[...sponsors, ...sponsors, ...sponsors, ...sponsors].map((sponsor, i) => (
            <div
              key={`clone-${i}`}
              className="mx-6 relative h-6 w-12 flex-shrink-0 grayscale transition-all hover:grayscale-0"
            >
              <Image src={sponsor || "/placeholder.svg"} alt={`Sponsor ${i + 1}`} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Footer Links */}
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_300px]">
          {/* Account */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t("account.title")}</h4>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t("services.title")}</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t("privacy.title")}</h4>
            <ul className="space-y-2">
              {footerLinks.privacy.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t("newsletter.title")}</h4>
            <p className="text-sm text-muted-foreground">{t("newsletter.description")}</p>
            <div className="flex flex-col gap-2">
              <Input type="email" placeholder={t("newsletter.placeholder")} className="w-full" />
              <Button className="w-full">{t("newsletter.subscribe")}</Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Copyright */}
      <div className="border-t">
        <div className="container flex items-center justify-between py-4">
          <p className="text-sm text-muted-foreground hidden md:flex">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.name}</span>
                </Link>
              ))}
            </div>
            <KoiNavIcon className="h-8 w-8 text-muted-foreground hidden md:flex" />
          </div>
        </div>
      </div>
    </footer>
  )
}

