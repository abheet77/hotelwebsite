import RoomsPageClient from "./RoomsPageClient";

export default async function RoomsPage({ searchParams }) {
  const params = await searchParams;
  const scroll = Array.isArray(params?.scroll) ? params.scroll[0] : params?.scroll;

  return <RoomsPageClient scroll={scroll || ""} />;
}
