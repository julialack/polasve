import CategoryLanding from "@/components/ads/CategoryLanding";
import { Users } from "lucide-react";

export default function MeetingPlacePage() {
  return (
    <CategoryLanding
      title="Meeting Place"
      description="Träffa nya vänner och nätverka."
      categoryFilter="Meeting Place"
      icon={<Users size={18} />}
    />
  );
}
