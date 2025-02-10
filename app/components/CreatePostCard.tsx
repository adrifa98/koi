import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from '@/i18n/routing';
import pfp from "@/public/pfp.png";
import { ImageDown, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function CreatePostCard() {
  const t = useTranslations("CreatePost");

  return (
    <Card className="px-4 py-2 flex items-center gap-x-4">
      <Image src={pfp} alt="pfp" className="h-12 w-fit" />

      <Link href="/community/movistar-koi/create" className="w-full">
        <Input placeholder={t("createPost")} />
      </Link>

      <div className="flex items-center gap-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/community/movistar-koi/create">
            <ImageDown className="w-4 h-4" />
          </Link>
        </Button>

        <Button variant="outline" size="icon">
          <Link href="/community/movistar-koi/create">
            <Link2 className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
