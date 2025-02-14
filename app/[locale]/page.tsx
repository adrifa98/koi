import { useLocale, useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>Idioma actual: {locale}</p>
    </div>
  );
}