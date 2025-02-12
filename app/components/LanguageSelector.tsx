import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export function LanguageSelector() {
  const locale = useLocale(); // Obtiene el idioma actual
  const router = useRouter(); // Para redireccionar manualmente

  const changeLanguage = (lang: string) => {
    if (lang !== locale) {
      router.push(`/${lang}`); // Redirige a la versión traducida del sitio
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('es')}>Español</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
