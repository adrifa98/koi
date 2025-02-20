import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

// Verificación de variables de entorno
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID")
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SANITY_DATASET")
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-02-12",
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
})

const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  if (!source?.asset?._ref && !source?.asset?._id) {
    return undefined
  }
  return builder.image(source)
}

