'use client'

import { LanguageSelector } from "@/app/components/LanguageSelector"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,

  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/app/components/NavigationMenu"
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ReactDialog"
import CartModal from '@/components/cart/modal'
import {
  CodIcon,
  EafcIcon,
  FortniteIcon,
  KoiNavIcon,
  LeagueIcon,
  PokemonIcon,
  ValorantIcon,
} from "@/components/layout/navbar/GameIcons"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from '@/i18n/routing'
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { Bell, Menu, MenuIcon, User } from "lucide-react"
import Image from "next/image"


interface NavbarProps {
  authStatus: {
    isAuthenticated: boolean;
    user: { name: string; email: string; picture?: string } | null;
  };
}

const teams = [
  { title: "League of Legends", subtitle: "LEC, Superliga", href: "/teams/lol", icon: LeagueIcon },
  { title: "Valorant", subtitle: "VCT EMEA, Rising", href: "/teams/valorant", icon: ValorantIcon },
  { title: "Pokémon", href: "/teams/pokemon", icon: PokemonIcon },
  { title: "Call of Duty", subtitle: "Toronto Ultra", href: "/teams/cod", icon: CodIcon },
  { title: "EA FC", href: "/teams/eafc", icon: EafcIcon },
  { title: "Fortnite", href: "/teams/fortnite", icon: FortniteIcon },
]

export function Navbar({ authStatus }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        {/* Botón Menú Mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav authStatus={authStatus} />
          </SheetContent>
        </Sheet>
  
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2 font-bold">
          <KoiNavIcon className="h-6 w-6 text-muted-foreground" />
        </Link>
  
        {/* Menú Principal (Solo Desktop) */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Equipos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {teams.map((team) => (
                    <li key={team.href}>
                      <NavigationMenuLink asChild>
                        <Link href={team.href} className="flex items-center gap-3 p-3 rounded-md hover:bg-accent">
                          <team.icon className="w-5 h-5" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{team.title}</span>
                            {team.subtitle && (
                              <span className="text-xs text-muted-foreground">{team.subtitle}</span>
                            )}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/shop" className={navigationMenuTriggerStyle()}>
                Tienda
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/tv" className={navigationMenuTriggerStyle()}>
                KOI TV
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/community" className={navigationMenuTriggerStyle()}>
                Comunidad
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" className={navigationMenuTriggerStyle()}>
                Club
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/blog" className={navigationMenuTriggerStyle()}>
                Blog
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
  
        {/* Iconos Derecha */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* SOLO DESKTOP: Idioma + Notificaciones + Perfil */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Selector de Idioma */}
            <LanguageSelector />
  
            {/* Notificaciones */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>📣 No tienes notificaciones</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
  
            {/* Perfil/Usuario */}
            {authStatus.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="rounded-full border px-2 py-1 flex items-center gap-x-2">
                    <MenuIcon className="w-5 h-5" /> {/* ✅ 3 Rayas restauradas */}
                    {authStatus.user?.picture ? (
                      <Image
                        src={authStatus.user.picture}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full border"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="font-semibold">{authStatus.user?.name}</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profile">Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings">Ajustes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogoutLink className="w-full">Cerrar Sesión</LogoutLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Button variant="secondary" asChild>
                  <RegisterLink>Registrarse</RegisterLink>
                </Button>
                <Button asChild>
                  <LoginLink>Iniciar Sesión</LoginLink>
                </Button>
              </div>
            )}
            <CartModal />
          </div>
  
          {/* SOLO MOBILE: Idioma + Notificaciones + Carrito */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Selector de Idioma */}
            <LanguageSelector />
  
            {/* Notificaciones */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>📣 No tienes notificaciones</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
  
            {/* Carrito */}
            <CartModal />
          </div>
        </div>
      </div>
    </header>
  );
  
}
function MobileNav({ authStatus }: { authStatus: NavbarProps["authStatus"] }) {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold">KOI</span>
      </Link>
      <div className="space-y-3">
        <div className="flex flex-col space-y-3">
          <div className="font-medium">Equipos</div>
          {teams.map((team) => (
            <Link
              key={team.href}
              href={team.href}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <team.icon />
              <span>{team.title}</span>
            </Link>
          ))}
        </div>
        <Link href="/tv" className="block font-medium">
          KOI TV
        </Link>
        <Link href="/community" className="block font-medium">
          Comunidad
        </Link>
        <Link href="/blog" className="block font-medium">
          Blog
        </Link>
        <Link href="/about" className="block font-medium">
          Sobre Nosotros
        </Link>

        {/* Separador Visual */}
        <hr className="my-4 border-t" />

        {/* Mostrar Login/Logout según estado */}
        {authStatus.isAuthenticated ? (
          <div className="flex flex-col space-y-3">
            <Link href="/profile" className="block font-medium text-primary">
              Perfil
            </Link>
            <Link href="/settings" className="block font-medium">
              Ajustes
            </Link>
            <LogoutLink className="block font-medium text-red-500">
              Cerrar Sesión
            </LogoutLink>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <Button variant="outline" asChild>
              <LoginLink>Iniciar Sesión</LoginLink>
            </Button>
            <Button asChild>
              <RegisterLink>Registrarse</RegisterLink>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
