import CategoryLanding from "@/components/ads/CategoryLanding";
import { ShoppingCart } from "lucide-react";

export default function MarketplaceHubPage() {
  return (
    <CategoryLanding
      title="Marketplace"
      description="Allt som köps, säljs och bytes i communityt."
      categoryFilter={["Köp / Acceptera", "Sälj / Bortskänkes", "Bytes"]}
      icon={<ShoppingCart size={18} />}
    />
  );
}
