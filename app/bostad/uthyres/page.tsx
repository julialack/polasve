import CategoryLanding from "@/components/ads/CategoryLanding";
import { Home } from "lucide-react";

export default function BostadUthyresPage() {
  return (
    <CategoryLanding
      title="Bostad - Hyra ut"
      description="Lediga hem och rum för uthyrning."
      categoryFilter="Hyra"
      icon={<Home size={18} />}
    />
  );
}
