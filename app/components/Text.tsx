import { useTranslations } from "next-intl";

interface TextProps {
  id: string;
}

const Text: React.FC<TextProps> = ({ id }) => {
  const t = useTranslations();
  return <>{t(id)}</>;
};

export default Text;
