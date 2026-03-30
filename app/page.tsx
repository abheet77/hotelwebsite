import HomeClient from "./HomeClient";

type HomePageProps = {
  searchParams?: Promise<{ scroll?: string | string[] }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const scroll = Array.isArray(params?.scroll) ? params.scroll[0] : params?.scroll;

  return <HomeClient scroll={scroll || ""} />;
}
