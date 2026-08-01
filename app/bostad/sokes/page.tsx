import CategoryLanding from "@/components/ads/CategoryLanding";
import { Search } from "lucide-react";

export default function BostadSokesPage() {
  return (
    <CategoryLanding
      title="Bostad - Sökes"
      description="Medlemmar som letar efter ett hem."
      categoryFilter="Sökes"
      icon={<Search size={18} />}
    />
  );
}
