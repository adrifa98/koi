import { CreatePostCard } from "@/app/components/CreatePostCard";
import Pagination from "@/app/components/Pagination";
import { PostCard } from "@/app/components/PostCard";
import Text from "@/app/components/Text"; // Importamos el componente de traducción
import prisma from "@/app/lib/db";
import TabsClient from "@/components/community/TabsClient"; // Importamos los Tabs
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from '@/i18n/routing';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { FileQuestion } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";

// Definimos JsonValue correctamente
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject { [key: string]: JsonValue; }
interface JsonArray extends Array<JsonValue> {}

interface Post {
  id: string;
  title: string;
  imageString: string | null;
  textContent: JsonValue;
  createdAt: Date;
  Comment: { id: string }[]; 
  Vote: { voteType: "UP" | "DOWN"; userId: string | null }[];
  User: { userName: string | null };
  voteScore: number;
}

interface Subreddit {
  name: string;
  createdAt: Date;
  description: string | null;
  userId: string;
  posts: Post[];
}

// Modificamos la función getData para que tenga las propiedades correctamente
async function getData(name: string, searchParam: string, sortBy: "recent" | "popular", locale: string) {
  noStore();
  const page = Number(searchParam) || 1;
  const pageSize = 10;

  const [count, data] = await prisma.$transaction([
    prisma.post.count({
      where: { subName: name },
    }),

    prisma.subreddit.findUnique({
      where: { name: name },
      select: {
        name: true,
        createdAt: true,
        description: true,
        userId: true,
        posts: {
          take: 1000,  // Obtenemos todos los posts, sin paginación todavía
          select: {
            Comment: { select: { id: true } },
            title: true,
            imageString: true,
            id: true,
            textContent: true,
            createdAt: true, // 'createdAt' de los posts, que es un Date
            Vote: { select: { userId: true, voteType: true } },
            User: { select: { userName: true } },
          },
        },
      },
    }),
  ]);

  // Aseguramos que 'createdAt' y demás propiedades estén bien definidas en los posts
  const processedPosts = data?.posts.map((post) => ({
    ...post,
    voteScore: post.Vote.reduce((acc, vote) => {
      if (vote.voteType === "UP") return acc + 1;
      if (vote.voteType === "DOWN") return acc - 1;
      return acc;
    }, 0),
    createdAt: post.createdAt, // Mantenemos 'createdAt' como Date
  }));

  // Ordenamos los posts primero por fecha (si 'sortBy' es "recent") o por 'voteScore' (si es "popular")
  if (sortBy === "recent") {
    processedPosts?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Orden por fecha más reciente
  }

  if (sortBy === "popular") {
    processedPosts?.sort((a, b) => b.voteScore - a.voteScore || b.createdAt.getTime() - a.createdAt.getTime()); // Orden por popularidad
  }

  // Aplicamos la paginación después de haber ordenado los posts
  const paginatedPosts = processedPosts?.slice((page - 1) * pageSize, page * pageSize);

  return { subreddit: data, posts: paginatedPosts, count: processedPosts?.length || 0 };
}

export default async function SubRedditRoute({
  params,
  searchParams,
  locale,
}: {
  params: { id: string };
  searchParams: { page: string; sort?: "recent" | "popular" };
  locale: string;  // El locale es pasado para cargar las traducciones adecuadas
}) {
  const sortBy = searchParams.sort || "recent"; // Orden por defecto es "recent"
  const { subreddit, posts, count } = await getData(params.id, searchParams.page, sortBy, locale);
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-4 mb-10">
      <div className="w-[65%] flex flex-col gap-y-5">
        <CreatePostCard />

        {/* Agregamos el componente Tabs para cambiar entre "Reciente" y "Popular" */}
        <TabsClient currentSort={sortBy} />

        {posts?.length === 0 ? (
          <div className="flex min-h-[300px] flex-col justify-center items-center rounded-md border border-dashed p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <FileQuestion className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">
              <Text id="CreatePost.noResults" /> {/* Usamos el componente Text para la traducción */}
            </h2>
          </div>
        ) : (
          <>
            {posts?.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                imageString={post.imageString}
                subName={params.id}
                commentAmount={post.Comment.length}
                title={post.title}
                userName={post.User?.userName as string}
                jsonContent={post.textContent}
                voteCount={post.voteScore}
                createdAt={post.createdAt.toISOString()}
              />
            ))}

            <Pagination totalPages={Math.ceil(count / 10)} />
          </>
        )}
      </div>

      <div className="w-[35%]">
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-x-3">
              <Image
                src={`https://avatar.vercel.sh/${subreddit?.name}`}
                alt="Image of subreddit"
                width={60}
                height={60}
                className="rounded-full h-16 w-16"
              />
              <Link href={`/community/${subreddit?.name}`} className="font-medium">
                {subreddit?.name}
              </Link>
            </div>

            <Separator className="my-5" />

            <Button asChild className="rounded-full w-full">
              <Link href={user?.id ? `/community/${subreddit?.name}/create` : "/api/auth/login"}>
                <Text id="CreatePost.createPost" /> 
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
