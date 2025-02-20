import prisma from "@/app/lib/db";
import { LatestPostsCarousel } from "@/components/blog/latest-posts-carousel";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { FishSection } from "@/components/home/fish-section";
import { HeroSection } from "@/components/home/hero-section";
import { getLatestMatches } from "@/lib/actions";
import { getBlogPosts } from "@/lib/blog";
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
  const posts = (await getBlogPosts()).slice(0, 10)

  return (
    <>
      <HeroSection initialMatches={matches} twitchStreams={streams} />
      <FeaturedGrid />
      <FishSection discussions={discussions} />
      <LatestPostsCarousel posts={posts} />
    </>
  );
}
