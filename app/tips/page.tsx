import CategoryLanding from "@/components/ads/CategoryLanding";
import { Lightbulb } from "lucide-react";

export default function TipsPage() {
  return (
    <CategoryLanding
      title="Tips & Trick"
      description="Smarta råd för livet i Sverige."
      categoryFilter="Tips & Trick"
      icon={<Lightbulb size={18} />}
    />
  );
}
