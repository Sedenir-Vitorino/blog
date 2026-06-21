import { notFound } from "next/navigation";
import { isValidLang, LANGUAGES, type Lang } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();

  return (
    <div lang={lang as Lang} className="flex min-h-screen flex-col">
      <Navbar lang={lang as Lang} />
      <div className="flex-1 pt-16">{children}</div>
      <Footer lang={lang as Lang} />
    </div>
  );
}
