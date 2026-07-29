import CategoryLanding from "@/components/ads/CategoryLanding";
import { Truck } from "lucide-react";

export default function TransportPage() {
  return (
    <CategoryLanding
      title="Transport"
      description="Flytthjälp, frakt och logistik."
      categoryFilter="Transport"
      icon={<Truck size={18} />}
    />
  );
}
