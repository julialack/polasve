import CategoryLanding from "@/components/ads/CategoryLanding";
import { MapPin, Users } from "lucide-react";

export default function MeetingPlacePage() {
  return (
    <CategoryLanding
      title="Meeting Place"
      description="Nätverk, sociala möten och nya kontakter i Sverige."
      categoryFilter="Meeting Place"
      icon={<div className="flex items-center gap-2"><MapPin size={16} /><Users size={16} /></div>}
    />
  );
}
