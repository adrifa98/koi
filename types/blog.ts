export interface BlogPost {
    _id: string
    title: {
      en: string
      es: string
    }
    subtitle?: {
      en: string
      es: string
    }
    content: {
      en: string
      es: string
    }
    categories?: Array<{
      _id: string
      name: {
        en: string
        es: string
      }
      slug: {
        current: string
        _type: string
      }
      image?: {
        asset: {
          url: string
        }
        alt?: string | null
      }
      channel?: string
    }>
    readingTime: number
    mainImage: {
      asset: {
        url: string
      }
      alt: string | null
    }
    publishedAt: string
  }
  
  