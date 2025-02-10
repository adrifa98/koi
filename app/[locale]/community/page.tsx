import { CreatePostCard } from "@/app/components/CreatePostCard";
import Pagination from "@/app/components/Pagination";
import { PostCard } from "@/app/components/PostCard";
import { SuspenseCard } from "@/app/components/SuspenseCard";
import prisma from "@/app/lib/db";
import { Link } from "@/i18n/routing";
import lolImage from "@/public/community/league-of-legends-sidebar.jpg"; // Importación correcta
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

async function getData(searchParam: string) {
  noStore();
  const [count, data] = await prisma.$transaction([
    prisma.post.count(),
    prisma.post.findMany({
      take: 10,
      skip: searchParam ? (Number(searchParam) - 1) * 10 : 0,
      select: {
        title: true,
        createdAt: true,
        textContent: true,
        id: true,
        imageString: true,
        Comment: {
          select: {
            id: true,
          },
        },
        User: {
          select: {
            userName: true,
          },
        },
        subName: true,
        Vote: {
          select: {
            userId: true,
            voteType: true,
            postId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return { data, count };
}

export default function Home({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-4 mb-10">
      {/* Contenido Principal */}
      <div className="w-[65%] flex flex-col gap-y-5">
        <CreatePostCard />
        <Suspense fallback={<SuspenseCard />} key={searchParams.page}>
          <ShowItems searchParams={searchParams} />
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

async function ShowItems({ searchParams }: { searchParams: { page: string } }) {
  const { count, data } = await getData(searchParams.page);
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
          voteCount={post.Vote.reduce((acc, vote) => {
            if (vote.voteType === "UP") return acc + 1;
            if (vote.voteType === "DOWN") return acc - 1;

            return acc;
          }, 0)}
        />
      ))}

      <Pagination totalPages={Math.ceil(count / 10)} />
    </>
  );
}
