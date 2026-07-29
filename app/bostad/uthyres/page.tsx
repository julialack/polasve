import CategoryLanding from "@/components/ads/CategoryLanding";
import { Home } from "lucide-react";

export default function BostadUthyresPage() {
  return (
    <CategoryLanding
      title="Lägenheter Hyra ut"
      description="Lediga hem och rum för uthyrning."
      categoryFilter="Lägenheter Hyra ut"
      icon={<Home size={18} />}
    />
  );
}
