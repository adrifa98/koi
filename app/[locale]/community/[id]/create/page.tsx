"use client";

import { createPost } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { TipTapEditor } from "@/app/components/TipTabEditor";
import { UploadDropzone } from "@/app/components/Uploadthing";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "@/i18n/routing";
import { JSONContent } from "@tiptap/react";
import { Text, Video } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const rules = [
  { id: 1, text: "Be respectful and considerate in all discussions.", translationKey: "rules.respectful" },
  { id: 2, text: "No spam, self-promotion, or irrelevant advertisements.", translationKey: "rules.noSpam" },
  { id: 3, text: "Avoid personal attacks and hate speech.", translationKey: "rules.noHate" },
  { id: 4, text: "Respect privacy and do not share personal information.", translationKey: "rules.privacy" },
];

const subreddits = ["movistar-koi", "league-of-legends", "valorant", "pokemon", "call-of-duty", "eafc", "fortnite"];

interface Params {
  id?: string;
}

export default function CreatePostRoute({ params }: { params: Params }) {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [json, setJson] = useState<JSONContent | null>(null);
  const [title, setTitle] = useState<string>("");
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>("movistar-koi");
  const t = useTranslations("CreatePost");

  useEffect(() => {
    if (params.id && subreddits.includes(params.id)) {
      setSelectedSubreddit(params.id);
    }
  }, [params.id]);

  // Función para contar caracteres en todos los nodos del JSON
  const getMessageLength = (jsonContent: JSONContent | null): number => {
    if (!jsonContent || !jsonContent.content) return 0;

    const countCharacters = (node: any): number => {
      let count = 0;

      if (node.text) {
        count += node.text.length;
      }

      if (node.content) {
        count += node.content.reduce((acc: number, childNode: any) => acc + countCharacters(childNode), 0);
      }

      return count;
    };

    return jsonContent.content.reduce((acc: number, node: any) => acc + countCharacters(node), 0);
  };

  const messageLength = getMessageLength(json);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.length > 144) {
      toast({
        title: t("errorTitle"),
        description: t("errorTitleTooLong"),
        variant: "destructive",
      });
      return;
    }

    if (messageLength > 288) {
      toast({
        title: t("errorTitle"),
        description: t("errorMessageTooLong"),
        variant: "destructive",
      });
      return;
    }

    if (!json || messageLength === 0) {
      toast({
        title: t("errorTitle"),
        description: t("errorDescription"),
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const plainJson = JSON.parse(JSON.stringify(json));

    await createPost({ jsonContent: plainJson }, formData);
  };

  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-4">
      <div className="w-[65%] flex flex-col gap-y-5">
        <DropdownMenu>
          <DropdownMenuTrigger className="border rounded-md p-2">
            {selectedSubreddit}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {subreddits.map((sub) => (
              <DropdownMenuItem key={sub}>
                <Link href={`/community/${sub}/create`}>{sub}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Tabs defaultValue="post" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="post">
              <Text className="h-4 w-4 mr-2" /> {t("post")}
            </TabsTrigger>
            <TabsTrigger value="image">
              <Video className="h-4 w-4 mr-2" /> {t("imageAndVideo")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="post">
            <Card>
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
                <input type="hidden" name="subName" value={selectedSubreddit} />
                <CardHeader>
                  <Input
                    required
                    name="title"
                    placeholder={t("titlePlaceholder")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={144}
                  />
                  <p className={`text-[9px] text-right pb-3 ${title.length > 144 ? "text-red-500" : "text-muted-foreground"}`}>
                    {title.length}/144
                  </p>
                  <TipTapEditor setJson={setJson} json={json} />
                  <p className={`text-[9px] text-right mt-2 mb-0 ${messageLength > 288 ? "text-red-500" : "text-muted-foreground"}`}>
                    {messageLength}/288
                  </p>
                </CardHeader>
                <CardFooter>
                  <SubmitButton text={t("createPost")} />
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="image">
            <Card>
              <CardHeader>
                <UploadDropzone
                  className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-label:text-primary ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => setImageUrl(res[0].url)}
                  onUploadError={() =>
                    toast({
                      title: t("errorTitle"),
                      description: t("errorDescription"),
                      variant: "destructive",
                    })
                  }
                />
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-[35%]">
        <Card className="flex flex-col p-4">
          <Separator className="mt-2" />
          <div className="flex flex-col gap-y-5 mt-5">
            {rules.map((item) => (
              <div key={item.id}>
                <p className="text-sm font-medium">
                  {item.id}. {t(item.translationKey)}
                </p>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
