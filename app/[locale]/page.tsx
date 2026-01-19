import { redirect } from "next/navigation";

type HomeProps = {
  params: { locale: string };
};

export default function Home({ params }: HomeProps) {
  redirect(`/${params.locale}/log-activity`);
}
