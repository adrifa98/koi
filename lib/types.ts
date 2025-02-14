export interface TwitchStream {
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
  
export interface SanityVideo {
  _id: string
  title: string
  videoId: string
  channelName: string
  publishedAt: string
}
