"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";

export default function TabsClient({ currentSort }: { currentSort: "recent" | "popular" }) {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Obtiene la ruta actual con el idioma
  const t = useTranslations('TabsClient'); // Cargar traducciones

  return (
    <Tabs defaultValue={currentSort} className="w-full">
      <TabsList className="w-full flex justify-center space-x-4 p-2 rounded-lg">
        <TabsTrigger value="recent" asChild>
          <Link href={`${pathname}?sort=recent`}>{t('recent')}</Link>
        </TabsTrigger>
        <TabsTrigger value="popular" asChild>
          <Link href={`${pathname}?sort=popular`}>{t('popular')}</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
