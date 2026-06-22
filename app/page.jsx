import { Suspense } from "react";
import { MidfiV1 } from "@/src/components/landing/MidfiV1";
import { getBlogArticles } from "@/src/components/landing/blog";
import { getYoutubePlaylist } from "@/src/components/landing/youtube";
import "@/src/components/landing/styles/base.css";
import "@/src/components/landing/styles/cards.css";
import "@/src/components/landing/styles/modals.css";
import "@/src/components/landing/styles/responsive.css";

export default async function Page() {
  const [articles, music] = await Promise.all([
    getBlogArticles(),
    getYoutubePlaylist(),
  ]);

  return (
    <Suspense>
      <MidfiV1 articles={articles} music={music} />
    </Suspense>
  );
}
