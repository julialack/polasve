import CategoryLanding from "@/components/ads/CategoryLanding";
import { Repeat } from "lucide-react";

export default function BytesPage() {
  return (
    <CategoryLanding
      title="Bytes"
      description="Byt prylar och tjänster med andra."
      categoryFilter="Bytes"
      icon={<Repeat size={18} />}
    />
  );
}
