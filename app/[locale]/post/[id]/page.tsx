import { handleVote } from "@/app/actions";
import { CommentForm } from "@/app/components/CommentForm";
import { CopyLink } from "@/app/components/CopyLink";
import { RenderTiptap } from "@/app/components/RenderTipTap";
import { DownVote, UpVote } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import { format, isThisYear, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";
import { Cake, MessageCircle } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getData(id: string) {
  noStore();
  const data = await prisma.post.findUnique({
    where: { id },
    select: {
      createdAt: true,
      title: true,
      imageString: true,
      textContent: true,
      subName: true,
      id: true,
      Vote: { select: { voteType: true } },
      Comment: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          text: true,
          createdAt: true,
          User: { select: { imageUrl: true, userName: true } },
        },
      },
      Subreddit: {
        select: {
          name: true,
          createdAt: true,
          description: true,
        },
      },
      User: { select: { userName: true, imageUrl: true } },
    },
  });

  if (!data) return notFound();

  return data;
}

// 🔹 Función para formatear la fecha como en Twitter
const formatTimeTwitterStyle = (date: Date) => {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = diffInMilliseconds / (1000 * 60);
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

  if (diffInMinutes < 2) {
    return `2min`;
  } else if (diffInHours < 1) {
    return `${Math.floor(diffInMinutes)}min`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h`;
  } else if (isToday(date)) {
    return "Hoy";
  } else if (isYesterday(date)) {
    return "Ayer";
  } else if (isThisYear(date)) {
    return format(date, "d MMM"); // Formato: 8 Feb
  } else {
    return format(date, "d MMM yyyy"); // Formato: 5 May 2024
  }
};

export default async function PostPage({ params }: { params: { id: string } }) {
  const data = await getData(params.id);

  return (
    <div className="max-w-[1200px] mx-auto flex gap-x-10 mt-4 mb-10">
      <div className="w-[70%] flex flex-col gap-y-5">
        <Card className="p-2 flex">
          <div className="flex flex-col items-center gap-y-2 p-2">
            <form action={handleVote}>
              <input type="hidden" name="voteDirection" value="UP" />
              <input type="hidden" name="postId" value={data.id} />
              <UpVote />
            </form>
            {data.Vote.reduce((acc, vote) => {
              if (vote.voteType === "UP") return acc + 1;
              if (vote.voteType === "DOWN") return acc - 1;
              return acc;
            }, 0)}
            <form action={handleVote}>
              <input type="hidden" name="voteDirection" value="DOWN" />
              <input type="hidden" name="postId" value={data.id} />
              <DownVote />
            </form>
          </div>

          <div className="p-2 w-full">
            <div className="flex items-center gap-x-3 text-xs text-muted-foreground">
              {/* Imagen de avatar junto al nombre */}
              <Image
                src={data.User?.imageUrl || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"}
                alt="Avatar"
                width={20}
                height={20}
                className="rounded-full"
              />
              <span>@{data.User?.userName}</span>
              <span>·</span>
              <span>{formatTimeTwitterStyle(new Date(data.createdAt))}</span>
            </div>

            <h1 className="font-medium mt-1 text-lg">{data.title}</h1>

            {data.imageString && (
              <Image
                src={data.imageString}
                alt="User Image"
                width={500}
                height={400}
                className="w-full h-auto object-contain mt-2"
              />
            )}

            {data.textContent && <RenderTiptap json={data.textContent} />}

            <div className="flex gap-x-5 items-center mt-3">
              <div className="flex items-center gap-x-1">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground font-medium text-xs">
                  {data.Comment.length}
                </p>
              </div>

              <CopyLink id={params.id} />
            </div>

            <CommentForm postId={params.id} />

            <Separator className="my-5" />

            <div className="flex flex-col gap-y-7">
              {data.Comment.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <div className="flex items-center gap-x-3">
                    <img
                      src={
                        item.User?.imageUrl
                          ? item.User.imageUrl
                          : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                      }
                      className="w-7 h-7 rounded-full"
                      alt="Avatar of user"
                    />
                    <div className="flex items-center gap-x-2 text-xs text-muted-foreground">
                      <span className="text-sm font-medium">
                        @{item.User?.userName}
                      </span>
                      <span>·</span>
                      <span>{formatTimeTwitterStyle(new Date(item.createdAt))}</span>
                    </div>
                  </div>

                  <p className="ml-10 text-secondary-foreground text-sm tracking-wide">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="w-[30%]">
        <Card>
          <div className="bg-muted p-4 font-semibold">About Community</div>
          <div className="p-4">
            <div className="flex items-center gap-x-3">
              <Image
                src={`https://avatar.vercel.sh/${data?.subName}`}
                alt="Image of subreddit"
                width={60}
                height={60}
                className="rounded-full h-16 w-16"
              />
              <Link href={`/community/${data?.subName}`} className="font-medium">
                {data?.subName}
              </Link>
            </div>

            <p className="text-sm font-normal text-secondary-foreground mt-2">
              {data?.Subreddit?.description}
            </p>

            <div className="flex items-center gap-x-2 mt-4">
              <Cake className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground font-medium text-sm">
                Creado: {format(new Date(data?.Subreddit?.createdAt as Date), "d MMM yyyy", { locale: es })}
              </p>
            </div>

            <Separator className="my-5" />
            <Button asChild className="rounded-full w-full">
              <Link href={`/community/${data?.subName}/create`}>Create Post</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
