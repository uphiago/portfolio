import { Suspense } from "react";
import { MidfiV1 } from "@/src/components/landing/MidfiV1";
import { getBlogArticles } from "@/src/components/landing/blog";
import { getYoutubePlaylist } from "@/src/components/landing/youtube";
import "@/src/components/landing/styles/base.css";
import "@/src/components/landing/styles/cards.css";
import "@/src/components/landing/styles/modals.css";
import "@/src/components/landing/styles/responsive.css";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const postId = sp?.post?.replace(/\.md$/, "");
  if (!postId) return {};

  const articles = await getBlogArticles();
  const article = articles.find((a) => a.id === postId);
  if (!article) return {};

  const url = `https://hiago.sh/?post=${article.id}`;

  return {
    description: article.summary || `Write-up by Hiago Felipe.`,
    openGraph: {
      title: article.title,
      description: article.summary || "",
      url,
      type: "article",
      siteName: "hiago.sh",
      locale: "en_US",
      article: {
        publishedTime: article.date || undefined,
        modifiedTime: article.lastmod || undefined,
        authors: [article.author || "Hiago Felipe"],
        tags: article.tags || [],
      },
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary || "",
      creator: "@uphiago",
    },
    alternates: { canonical: url },
  };
}

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
