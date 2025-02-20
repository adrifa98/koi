export interface SanityVideo {
  _id: string
  title: string
  videoId: string
  channelName: string
  publishedAt: string
}

export interface Category {
  _id: string
  name: {
    en: string
    es: string
  }
  slug: {
    current: string
    _type: string
  }
  current: null
  description: null
  en: null
  es: null
  image: {
    asset: {
      url: string
    }
    alt: null
  }
}

export interface Match {
  _id: string
  bo: string
  channel: string | null
  categoryChannel: string | null
  category: {
    _id: string
    name: {
      en: string
      es: string
    }
    slug: {
      current: string
      _type: string
    }
    channel: string | null
    image: {
      url: string
      alt: null
    }
  }
  team1: {
    name: string
    score: number
    image: {
      url: string
      alt: null
    } | null
  }
  team2: {
    name: string
    score: number
    image: {
      url: string
      alt: null
    } | null
  }
  matchDate: string
}

