import CategoryLanding from "@/components/ads/CategoryLanding";
import { Home } from "lucide-react";

export default function BostadHubPage() {
  return (
    <CategoryLanding
      title="Jobb & Bostad"
      description="Hitta jobb, lägenheter och lokaler på ett ställe."
      categoryFilter={["Leta jobb", "Lägenhet sökes", "Lägenheter Hyra ut", "Lokaler"]}
      icon={<Home size={18} />}
    />
  );
}
