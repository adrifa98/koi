"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Leaf, Monitor, Sparkles } from 'lucide-react'
import { useTranslations } from "next-intl"
import Image from "next/image"

export function FeaturedGrid() {
  const t = useTranslations("featured")

  const features = [
    {
      key: "whatToWatch",
      image: "/placeholder.svg?height=400&width=400",
      icon: Monitor,
      color: "from-purple-500 to-pink-500",
    },
    {
      key: "plantTree",
      image: "/placeholder.svg?height=400&width=400",
      icon: Leaf,
      color: "from-green-500 to-cyan-500",
    },
    {
      key: "supercharged",
      image: "/placeholder.svg?height=400&width=400",
      icon: Sparkles,
      color: "from-blue-500 to-indigo-500",
    },
  ]

  return (
    <section className="w-full bg-background pb-20 -mt-20">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.key}
              className="group relative overflow-hidden rounded-lg border-0 bg-background/50 backdrop-blur-sm"
            >
              <div className="relative aspect-square overflow-hidden">
                <div
                  className={`absolute inset-0 z-10 bg-gradient-to-br ${feature.color} opacity-50 transition-opacity group-hover:opacity-70`}
                />
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={t(`${feature.key}.title`)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-white/80">{t(`${feature.key}.title`)}</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{t(`${feature.key}.description`)}</h3>
                    </div>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Button variant="ghost" className="w-fit px-0 text-white hover:text-white hover:bg-transparent">
                    {t(`${feature.key}.learnMore`)}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="group relative overflow-hidden rounded-lg border-0 bg-cyan-500/10 backdrop-blur-sm">
            <div className="relative aspect-[2/1] overflow-hidden">
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-50 transition-opacity group-hover:opacity-70" />
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt={t("camera.title")}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                <div className="flex items-start">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-500">
                      {t("camera.new")}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-2">{t("camera.title")}</h3>
                    <p className="text-sm text-white/80 mt-1">{t("camera.description")}</p>
                  </div>
                </div>
                <Button variant="secondary" className="w-fit">
                  {t("camera.notify")}
                </Button>
              </div>
            </div>
          </Card>
          <Card className="group relative overflow-hidden rounded-lg border-0 bg-background/50 backdrop-blur-sm">
            <div className="relative aspect-[2/1] overflow-hidden">
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 transition-opacity group-hover:opacity-70" />
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt={t("sleepApp.title")}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">{t("sleepApp.title")}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{t("sleepApp.subtitle")}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt={t("sleepApp.appName")}
                    width={40}
                    height={40}
                    className="rounded-xl"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{t("sleepApp.appName")}</p>
                    <p className="text-sm text-white/80">{t("sleepApp.description")}</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    {t("sleepApp.getApp")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

