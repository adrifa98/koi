import prisma from "@/app/lib/db";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { FishSection } from "@/components/home/fish-section";
import { HeroSection } from "@/components/home/hero-section";
import { getLatestMatches } from "@/lib/actions";
import { getTwitchStreams } from "@/lib/twitch";

export const runtime = 'nodejs';

export const metadata = {
  description: 'Movistar KOI',
  openGraph: {
    type: 'website'
  }
};

async function getLatestDiscussions() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      subName: true,
      Comment: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return posts.map(post => ({
    id: post.id, // ✅ Incluimos id
    title: post.title,
    subName: post.subName ?? "Unknown", // Aseguramos string
    replies: post.Comment.length,
  }));
}




export default async function HomePage() {
  const discussions = await getLatestDiscussions();
  const matches = await getLatestMatches()
  const streams = await getTwitchStreams()

  return (
    <>
      <HeroSection initialMatches={matches} twitchStreams={streams} />
      <FeaturedGrid />
      {/* Pasamos las discusiones como prop */}
      <FishSection discussions={discussions} />
      <section className="min-h-screen bg-background">
        <div className="container py-24">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Siguiente Sección</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-video bg-primary/10 rounded-lg" />
                  <h3 className="text-xl font-semibold">Título del contenido {i + 1}</h3>
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
