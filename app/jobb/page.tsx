import CategoryLanding from "@/components/ads/CategoryLanding";
import { Briefcase } from "lucide-react";

export default function JobbPage() {
  return (
    <CategoryLanding
      title="Leta jobb"
      description="Hitta din nästa karriärmöjlighet i Sverige."
      categoryFilter="Leta jobb"
      icon={<Briefcase size={18} />}
    />
  );
}
