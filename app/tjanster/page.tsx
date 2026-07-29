import CategoryLanding from "@/components/ads/CategoryLanding";
import { Wrench } from "lucide-react";

export default function TjansterPage() {
  return (
    <CategoryLanding
      title="Tjänster"
      description="Proffshjälp och tjänster i vardagen."
      categoryFilter="Tjänster"
      icon={<Wrench size={18} />}
    />
  );
}
