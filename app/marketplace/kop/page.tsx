import CategoryLanding from "@/components/ads/CategoryLanding";
import { ShoppingCart } from "lucide-react";

export default function KopPage() {
  return (
    <CategoryLanding
      title="Köp / Acceptera"
      description="Hitta det du letar efter i vårt community."
      categoryFilter="Köp / Acceptera"
      icon={<ShoppingCart size={18} />}
    />
  );
}
