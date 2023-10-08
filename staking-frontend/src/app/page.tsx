import { Stake, UserBalance } from "@/components";
import Card from "@/ui-kit/Card";

function HomePage() {
  return (
    <Card small>
      <Stake />
      <UserBalance />
    </Card>
  );
}

export default HomePage;
