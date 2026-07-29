import CategoryLanding from "@/components/ads/CategoryLanding";
import { Users } from "lucide-react";

export default function CommunityHubPage() {
  return (
    <CategoryLanding
      title="Community Hub"
      description="Tips, trick och mötesplatser för medlemmar."
      categoryFilter={["Tips & Trick", "Meeting Place"]}
      icon={<Users size={18} />}
    />
  );
}
