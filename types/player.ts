export interface Player {
  _id: string
  username: string
  firstName: string
  lastName: string
  description: {
    en: string
    es: string
  }
  slug: {
    current: string
    _type: string
  }
  twitter?: string
  youtube?: string
  twitch?: string
  instagram?: string
  image: {
    url: string // Actualizado para reflejar la estructura correcta
  }
  categories: {
    _id: string
    name: {
      en: string
      es: string
    }
    slug: {
      current: string
      _type: string
    }
    image: {
      asset: {
        url: string
      }
    }
    channel?: string
    subCategory?: string
  }[]
}

