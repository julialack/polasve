import CategoryLanding from "@/components/ads/CategoryLanding";
import { Building } from "lucide-react";

export default function LokalerPage() {
  return (
    <CategoryLanding
      title="Lokaler"
      description="Kontor, lager och affärslokaler."
      categoryFilter="Lokaler"
      icon={<Building size={18} />}
    />
  );
}
