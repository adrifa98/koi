export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Relevance',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Trending', slug: 'trending-desc', sortKey: 'BEST_SELLING', reverse: false }, // asc
  { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false }, // asc
  { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true }
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-01/graphql.json';


export const HOVER_DELAY = 300
export const PREVIEW_DURATION = 5000
export const SCROLL_AMOUNT = 400
export const CARD_WIDTH = 320
export const CARD_HEIGHT = 180
export const VIDEO_PROVIDERS = {
  youtube: {
    thumbnail: (videoId: string) => `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    embed: (videoId: string) =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&mute=1&modestbranding=1&loop=1&playlist=${videoId}`,
    share: (videoId: string) => `https://youtube.com/watch?v=${videoId}`,
  },
  twitch: {
    thumbnail: (channelName: string) =>
      `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channelName}-640x360.jpg`,
    embed: (channelName: string) =>
      `https://player.twitch.tv/?channel=${channelName}&parent=${process.env.NEXT_PUBLIC_VERCEL_URL || "localhost"}&muted=true&autoplay=true`,
    embedFull: (channelName: string) =>
      `https://player.twitch.tv/?channel=${channelName}&parent=${process.env.NEXT_PUBLIC_VERCEL_URL || "localhost"}`,
    share: (channelName: string) => `https://twitch.tv/${channelName}`,
  },
} as const

