import { MidfiV1 } from "@/src/components/landing/MidfiV1";
import { fetchFeaturedGitHubRepo } from "@/src/lib/githubRepo";

export default async function Page() {
  let initialFeaturedRepo = null;

  try {
    initialFeaturedRepo = await fetchFeaturedGitHubRepo();
  } catch (error) {
    console.error(error);
  }

  return <MidfiV1 initialFeaturedRepo={initialFeaturedRepo} />;
}
