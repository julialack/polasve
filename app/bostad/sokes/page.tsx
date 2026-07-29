import CategoryLanding from "@/components/ads/CategoryLanding";
import { Search } from "lucide-react";

export default function BostadSokesPage() {
  return (
    <CategoryLanding
      title="Lägenhet sökes"
      description="Medlemmar som letar efter ett hem."
      categoryFilter="Lägenhet sökes"
      icon={<Search size={18} />}
    />
  );
}
