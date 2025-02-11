import { CreatePostCard } from "@/app/components/CreatePostCard";
import Pagination from "@/app/components/Pagination";
import { PostCard } from "@/app/components/PostCard";
import { SuspenseCard } from "@/app/components/SuspenseCard";
import prisma from "@/app/lib/db";
import TabsClient from "@/components/community/TabsClient";
import { Link } from "@/i18n/routing";
import lolImage from "@/public/community/league-of-legends-sidebar.jpg";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import { Suspense } from "react";

const games = [
  { name: "League of Legends", slug: "league-of-legends" },
  { name: "Valorant", slug: "valorant" },
  { name: "Pokémon", slug: "pokemon" },
  { name: "Call of Duty", slug: "call-of-duty" },
  { name: "EAFC", slug: "eafc" },
  { name: "Fortnite", slug: "fortnite" },
];

async function getData(
  searchParam: string,
  sortBy: "recent" | "popular"
) {
  noStore();
  const page = Number(searchParam) || 1;
  const pageSize = 10;

  const allPosts = await prisma.post.findMany({
    select: {
      title: true,
      createdAt: true,
      textContent: true,
      id: true,
      imageString: true,
      Comment: { select: { id: true } },
      User: { select: { userName: true } },
      subName: true,
      Vote: { select: { voteType: true } },
    },
    orderBy: sortBy === "recent" ? { createdAt: "desc" } : undefined,
  });

  const processedData = allPosts.map((post) => ({
    ...post,
    voteScore: post.Vote.reduce((acc, vote) => {
      if (vote.voteType === "UP") return acc + 1;
      if (vote.voteType === "DOWN") return acc - 1;
      return acc;
    }, 0),
  }));

  if (sortBy === "popular") {
    processedData.sort((a, b) => b.voteScore - a.voteScore || b.createdAt.getTime() - a.createdAt.getTime());
  }

  const count = processedData.length;
  const paginatedData = processedData.slice((page - 1) * pageSize, page * pageSize);

  return { data: paginatedData, count };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string; sort?: "recent" | "popular" };
}) {
  const sortBy = searchParams.sort || "recent";
  const { count, data } = await getData(searchParams.page || "1", sortBy);

  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-4 mb-10">
      {/* Contenido Principal */}
      <div className="w-[65%] flex flex-col gap-y-5">
        <CreatePostCard />

        {/* Tabs con Shadcn */}
        <TabsClient currentSort={sortBy} />

        <Suspense fallback={<SuspenseCard />} key={`suspense-${sortBy}-${searchParams.page}`}>
          <ShowItems data={data} count={count} />
        </Suspense>
      </div>

      {/* Sidebar Derecho */}
      <div className="w-[35%] flex flex-col gap-y-3">
        {games.map((game) => (
          <Link
            key={game.slug}
            href={`/community/${game.slug}`}
            className="relative w-full h-16 rounded-lg overflow-hidden flex items-center justify-center text-white font-bold bg-black/50 hover:bg-black/30 transition"
          >
            <Image
              src={lolImage}
              alt={game.name}
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 -z-10"
            />
            {game.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ShowItems({ data, count }: { data: any[]; count: number }) {
  return (
    <>
      {data.map((post) => (
        <PostCard
          id={post.id}
          imageString={post.imageString}
          jsonContent={post.textContent}
          subName={post.subName as string}
          title={post.title}
          key={post.id}
          commentAmount={post.Comment.length}
          userName={post.User?.userName as string}
          voteCount={post.voteScore}
          createdAt={post.createdAt}  // Asegúrate de pasar createdAt aquí
        />
      ))}

      <Pagination totalPages={Math.ceil(count / 10)} />
    </>
  );
}