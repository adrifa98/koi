export interface TwitchStream {
  user_id: string
  user_login: string
  user_name: string
  game_name: string
  title: string
  viewer_count: number
  started_at: string
  thumbnail_url: string
  is_live: boolean
  profile_image_url: string 
}
  
  export interface SanityVideo {
    _id: string
    title: string
    description: string
    videoId: string
    thumbnailUrl: string
    category: string
  }
  
  