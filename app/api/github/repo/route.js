import { fetchFeaturedGitHubRepo } from "@/src/lib/githubRepo";

export const revalidate = 3600;

export async function GET() {
  const repo = await fetchFeaturedGitHubRepo();
  return Response.json(repo);
}
