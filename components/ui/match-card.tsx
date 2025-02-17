import Image from "next/image"
import { Card } from "./card"

type Match = {
  team1: string
  team2: string
  time: string
  date: string
  team1Logo: string
  team2Logo: string
  platforms?: Array<{
    icon: string
    href: string
  }>
}

export function MatchCard({ match }: { match: Match }) {
  return (
    <Card className="bg-background/80 backdrop-blur w-[300px] hover:bg-background/90 transition-colors group">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={match.team1Logo || "/placeholder.svg"}
              alt={match.team1}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-white/60">vs</span>
            <Image
              src={match.team2Logo || "/placeholder.svg"}
              alt={match.team2}
              width={24}
              height={24}
              className="rounded-full"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{match.time}</p>
            <p className="text-xs text-muted-foreground">{match.date}</p>
          </div>
        </div>
        {match.platforms && (
          <div className="flex items-center gap-2">
            {match.platforms.map((platform, index) => (
              <a
                key={index}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <Image src={platform.icon || "/placeholder.svg"} alt="Platform" width={20} height={20} />
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

