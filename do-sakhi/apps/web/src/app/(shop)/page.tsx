import HomeHero from "@/components/home/HomeHero";
import NarrativeCollections from "@/components/home/NarrativeCollections";
import NewlyCuratedPreview from "@/components/home/NewlyCuratedPreview";
import AtelierStoryBlock from "@/components/home/AtelierStoryBlock";
import LookbookPreview from "@/components/home/LookbookPreview";
import BespokeCtaSection from "@/components/home/BespokeCtaSection";
import BoutiquePromise from "@/components/home/BoutiquePromise";

// Force dynamic rendering — NewlyCuratedPreview fetches live product data
// from the API with cache: 'no-store'. Without this, Next.js 15 attempts
// static prerendering and throws DYNAMIC_SERVER_USAGE at build time.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HomeHero />
      <NarrativeCollections />
      <NewlyCuratedPreview />
      <AtelierStoryBlock />
      <LookbookPreview />
      <BespokeCtaSection />
      <BoutiquePromise />
    </div>
  );
}
