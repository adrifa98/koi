import { routing } from '@/i18n/routing';
import { createTranslator } from "next-intl";
import { getRequestConfig } from 'next-intl/server';

export async function getServerTranslations(locale: string, namespace: string) {
  const messages = await import(`@/locales/${locale}/${namespace}.json`).then(
    (m) => m.default
  );

  return createTranslator({ locale, messages });
}

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default
  };
});