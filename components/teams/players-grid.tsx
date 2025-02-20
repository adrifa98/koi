"use client"

import type { Player } from "@/types/player"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect } from "react"
import { PlayerCard } from "./player-card"

interface PlayersGridProps {
  players: Player[]
  category: string
}

// Configuración simplificada para las categorías que tienen dos equipos
const teamConfig: {
  [key: string]: {
    teams: string[]
  }
} = {
  "league-of-legends": {
    teams: ["LEC", "Superliga"],
  },
  valorant: {
    teams: ["VCT", "Rising"],
  },
}

export function PlayersGrid({ players, category }: PlayersGridProps) {
  const t = useTranslations("teams")

  // Debug logs iniciales
  useEffect(() => {
    console.log("=== Debug Info ===")
    console.log("Category:", category)
    console.log("Total players received:", players.length)
    console.log("Team config for category:", teamConfig[category])

    // Log detallado de cada jugador
    players.forEach((player) => {
      console.log(`Player ${player.username}:`, {
        id: player._id,
        categories: player.categories.map((cat) => ({
          name: cat.name.en,
          slug: cat.slug.current,
        })),
      })
    })
  }, [players, category])

  // Primero, deduplicar jugadores basándonos en username e ID
  const uniquePlayers = players.reduce(
    (acc, player) => {
      const key = `${player.username}-${player._id}`
      if (!acc[key]) {
        acc[key] = player
      }
      return acc
    },
    {} as Record<string, Player>,
  )

  // Agrupar jugadores por equipo
  const groupedPlayers = Object.values(uniquePlayers).reduce(
    (acc, player) => {
      // Procesar todas las categorías del jugador que coincidan con la categoría actual
      player.categories
        .filter((cat) => cat.slug.current === category)
        .forEach((playerCategory) => {
          const team = playerCategory.name.en
          if (!acc[team]) {
            acc[team] = {
              players: [],
              categoryImage: playerCategory.image || null,
            }
          }

          // Añadir el jugador al equipo si no está ya presente
          if (!acc[team].players.some((p) => p._id === player._id)) {
            acc[team].players.push(player)
          }
        })

      return acc
    },
    {} as Record<string, { players: Player[]; categoryImage: any }>,
  )

  // Debug log de la agrupación
  useEffect(() => {
    console.log("=== Grouped Players ===")
    Object.entries(groupedPlayers).forEach(([team, data]) => {
      console.log(`Team "${team}":`, {
        playerCount: data.players.length,
        players: data.players.map((p) => ({
          username: p.username,
          id: p._id,
        })),
      })
    })
  }, [groupedPlayers])

  // Determinar los equipos a mostrar basado en la configuración
  const teamsToShow = teamConfig[category]?.teams || Object.keys(groupedPlayers)

  // Solo mostrar el título de la categoría una vez
  const categoryTitle = t(`categories.${category.toLowerCase()}.name`)
  const categoryRegion = t(`categories.${category.toLowerCase()}.region`)

  // Si no hay jugadores, mostrar mensaje
  if (Object.values(uniquePlayers).length === 0) {
    return (
      <div className="relative min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">{t("player.noPlayers")}</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Título principal de la categoría */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold">{categoryTitle}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{categoryRegion}</p>
          <p className="mt-4 text-muted-foreground">{t("team.description", { game: categoryTitle })}</p>
        </div>

        {/* Secciones por equipo */}
        <div className="space-y-16">
          {teamsToShow.map((team) => {
            const teamData = groupedPlayers[team] || {
              players: [],
              categoryImage: null,
            }

            // No mostrar equipos sin jugadores
            if (teamData.players.length === 0) {
              console.log(`No players found for team: ${team}`)
              return null
            }

            return (
              <div key={team} className="space-y-8">
                {/* Título del equipo */}
                <div className="flex items-center gap-4">
                  {teamData.categoryImage?.asset?.url && (
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                      <Image
                        src={teamData.categoryImage.asset.url || "/placeholder.svg"}
                        alt={team}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-semibold">{team}</h2>
                  </div>
                </div>

                {/* Grid de jugadores */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {teamData.players
                    .sort((a, b) => a.username.localeCompare(b.username))
                    .map((player) => (
                      <PlayerCard key={`${team}-${player._id}`} player={player} category={category} />
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

