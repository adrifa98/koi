import { handleVote } from "@/app/actions";
import { CopyLink } from "@/app/components/CopyLink";
import { DownVote, UpVote } from "@/app/components/SubmitButtons";
import { Card } from "@/components/ui/card";
import { Link } from '@/i18n/routing';
import { format, isThisYear, isToday, isYesterday } from "date-fns";
import { MessageCircle } from "lucide-react";
import { useTranslations } from 'next-intl';

interface iAppProps {
  title: string;
  jsonContent: any;
  id: string;
  subName: string;
  userName: string;
  imageString: string | null;
  voteCount: number;
  commentAmount: number;
  createdAt: string; // Recibe createdAt como prop
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
  createdAt, // Recibir createdAt como prop
}: iAppProps) {

  // Obtener las traducciones
  const t = useTranslations('time'); // Suponiendo que las traducciones se guardan en el namespace 'time'

  // 🔹 Función para formatear la fecha como en Twitter
  const formatTimeTwitterStyle = (date: Date) => {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = diffInMilliseconds / (1000 * 60);
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return t('minutes_ago', { count: Math.floor(diffInMinutes) });
    } else if (diffInHours < 24) {
      return t('hours_ago', { count: Math.floor(diffInHours) });
    } else if (isToday(date)) {
      return t('today');
    } else if (isYesterday(date)) {
      return t('yesterday');
    } else if (isThisYear(date)) {
      return format(date, "d MMM"); // Formato: 9 feb.
    } else {
      return format(date, "d MMM yyyy"); // Formato: 9 feb. 2024
    }
  };

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
        {/* Ajusta este contenedor para que todo quede en una línea */}
        <div className="flex items-center gap-x-2 p-2">
          <Link className="font-semibold text-xs" href={`/community/${subName}`}>
            {subName}
          </Link>
          <p className="text-xs text-muted-foreground flex items-center gap-x-1">
            <span className="hover:text-primary">@{userName}</span>
            <span> · </span>
            <span className="text-xs text-muted-foreground">
              {formatTimeTwitterStyle(new Date(createdAt))}
            </span>
          </p>
        </div>

        <div className="px-2">
          <Link href={`/post/${id}`}>
            <h1 className="font-medium mt-1 text-lg">{title}</h1>
          </Link>
        </div>

        <div className="m-3 flex items-center gap-x-5">
          <div className="flex items-center gap-x-1">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground font-medium text-xs">
              {commentAmount}
            </p>
          </div>

          <CopyLink id={id} />
        </div>
      </div>
    </Card>
  );
}
