const TWITCH_STREAMERS = [
  "ibai",
  "knekro",
  "SUJA",
  "PokeAlexVGC",
  "Kuentinlol",
  "Riopaser",
  "KOI",
  "Pandarina",
  "tvandeR",
  "skain",
  "sheydosvl",
  "PauSenpaii",
  "SergioFFerra",
  "ReventXz",
  "Perxitaa",
  "jaimemellado_",
  "supa_lol",
  "rodenasink",
  "aMONSTERR",
  "Guardy",
  
]

interface TwitchStream {
  user_id: string
  user_login: string
  user_name: string
  profile_image_url: string
  game_name: string
  title: string
  viewer_count: number
  started_at: string
  thumbnail_url: string
  is_live: boolean
}

async function getTwitchAccessToken() {
  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }),
  })

  const data = await response.json()
  return data.access_token
}

export async function getTwitchStreams() {
  const accessToken = await getTwitchAccessToken()

  // Get streams data
  const streamsResponse = await fetch(
    `https://api.twitch.tv/helix/streams?user_login=${TWITCH_STREAMERS.join("&user_login=")}`,
    {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  const streamsData = await streamsResponse.json()
  const liveStreams = new Set(streamsData.data.map((stream: any) => stream.user_login.toLowerCase()))

  // Get users data for all streamers
  const usersResponse = await fetch(`https://api.twitch.tv/helix/users?login=${TWITCH_STREAMERS.join("&login=")}`, {
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const usersData = await usersResponse.json()

  // Combine streams and users data
  const streams: TwitchStream[] = usersData.data.map((user: any) => {
    const streamData = streamsData.data.find(
      (stream: any) => stream.user_login.toLowerCase() === user.login.toLowerCase(),
    )

    return {
      user_id: user.id,
      user_login: user.login,
      user_name: user.display_name,
      profile_image_url: user.profile_image_url,
      game_name: streamData?.game_name || "",
      title: streamData?.title || "",
      viewer_count: streamData?.viewer_count || 0,
      started_at: streamData?.started_at || "",
      thumbnail_url: streamData?.thumbnail_url || "",
      is_live: liveStreams.has(user.login.toLowerCase()),
    }
  })

  // Sort streams: live streams first (by viewer count), then offline streams
  return streams.sort((a: TwitchStream, b: TwitchStream) => {
    if (a.is_live && !b.is_live) return -1
    if (!a.is_live && b.is_live) return 1
    if (a.is_live && b.is_live) return b.viewer_count - a.viewer_count
    return 0
  })
}

