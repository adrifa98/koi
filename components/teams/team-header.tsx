import { useTranslations } from "next-intl"

interface TeamHeaderProps {
  category: string
}

export function TeamHeader({ category }: TeamHeaderProps) {
  const t = useTranslations("teams")

  const categoryNames: { [key: string]: string } = {
    "league-of-legends": "League of Legends",
    valorant: "VALORANT",
    pokemon: "Pokémon",
    "toronto-ultra": "Toronto Ultra",
    eafc: "EA Sports FC 24",
    fortnite: "Fortnite",
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background" />
      <div className="container relative z-10 py-24">
        <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">{categoryNames[category] || category}</h1>
        <p className="mt-4 max-w-[700px] text-lg text-muted-foreground">
          {t("team.description", { game: categoryNames[category] || category })}
        </p>
      </div>
    </div>
  )
}

