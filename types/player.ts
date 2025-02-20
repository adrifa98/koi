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
      asset: {
        _ref: string
        _type: string
      }
      _type: string
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
          _ref: string
          _type: string
        }
        _type: string
      }
      channel?: string
      subCategory?: string
    }[]
  }
  
  