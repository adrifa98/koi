
import "@/app/globals.css";
import { CartProvider } from '@/components/cart/cart-context';
import { Navbar2 } from '@/components/layout/navbar';
import { Toaster } from "@/components/ui/toaster";
import { WelcomeToast } from "@/components/welcome-toast";
import { routing } from '@/i18n/routing';
import { getCart } from '@/lib/shopify';
import { ensureStartsWith } from '@/lib/utils';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from "next/font/google";
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Navbar } from "../components/Navbar";
import { ThemeProvider } from "../components/theme-provider";
 

const inter = Inter({ subsets: ["latin"] });

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

export default async function RootLayout({ children, params: {locale} }: { children: ReactNode; params: {locale: string}; }) {
  const cartId = (await cookies()).get('cartId')?.value;
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart(cartId);
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
        <CartProvider cartPromise={cart}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar2 />
          <Navbar />
          <main>
            {children}
            <WelcomeToast />
            <Toaster />
          </main>
          </ThemeProvider>
        </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
