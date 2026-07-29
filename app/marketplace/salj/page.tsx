import CategoryLanding from "@/components/ads/CategoryLanding";
import { Tag } from "lucide-react";

export default function SaljPage() {
  return (
    <CategoryLanding
      title="Sälj / Bortskänkes"
      description="Saker som ges bort eller säljs av medlemmar."
      categoryFilter="Sälj / Bortskänkes"
      icon={<Tag size={18} />}
    />
  );
}
