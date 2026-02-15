import { redirect } from "next/navigation";

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  redirect(`/${locale}/log-activity`);
}
