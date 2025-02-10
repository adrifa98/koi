import { handleVote } from "@/app/actions";
import { CopyLink } from "@/app/components/CopyLink";
import { RenderToJson } from "@/app/components/RendertoJson";
import { DownVote, UpVote } from "@/app/components/SubmitButtons";
import { Card } from "@/components/ui/card";
import { Link } from '@/i18n/routing';
import { MessageCircle } from "lucide-react";
import Image from "next/image";

interface iAppProps {
  title: string;
  jsonContent: any;
  id: string;
  subName: string;
  userName: string;
  imageString: string | null;
  voteCount: number;
  commentAmount: number;
}

export function PostCard({
  id,
  imageString,
  jsonContent,
  subName,
  title,
  userName,
  voteCount,
  commentAmount,
}: iAppProps) {
  return (
    <Card className="flex relative overflow-hidden">
      <div className="flex flex-col items-center gap-y-2 bg-muted p-2">
        <form action={handleVote}>
          <input type="hidden" name="voteDirection" value="UP" />
          <input type="hidden" name="postId" value={id} />
          <UpVote />
        </form>
        {voteCount}
        <form action={handleVote}>
          <input type="hidden" name="voteDirection" value="DOWN" />
          <input type="hidden" name="postId" value={id} />
          <DownVote />
        </form>
      </div>

      <div>
        <div className="flex items-center gap-x-2 p-2">
          <Link className="font-semibold text-xs" href={`/community/${subName}`}>
            {subName}
          </Link>
          <p className="text-xs text-muted-foreground">
            <span className="hover:text-primary">@{userName}</span>
          </p>
        </div>

        <div className="px-2">
          <Link href={`/post/${id}`}>
            <h1 className="font-medium mt-1 text-lg">{title}</h1>
          </Link>
        </div>

        <div className="max-h-[300px] overflow-hidden">
        <Link href={`/post/${id}`}>
          {imageString ? (
            <Image
              src={imageString}
              alt="Post Image"
              width={600}
              height={300}
              className="w-full h-full"
            />
          ) : (
            <RenderToJson data={jsonContent} />
          )}
          </Link>
        </div>

        <div className="m-3 flex items-center gap-x-5">
          <div className="flex items-center gap-x-1">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground font-medium text-xs">
              {commentAmount} Comments
            </p>
          </div>

          <CopyLink id={id} />
        </div>
      </div>
    </Card>
  );
}
