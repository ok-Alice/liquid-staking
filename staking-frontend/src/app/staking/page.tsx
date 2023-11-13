import { Staking } from "@/components";
import PageTitle from "@/ui-kit/PageTitle";

function StakingPage() {
  return (
    <>
      <PageTitle
        title="Staking"
        subtitle="Stake your DOT and receive LDOT based on the current exchange rate"
      />

      <Staking />
    </>
  );
}

export default StakingPage;
