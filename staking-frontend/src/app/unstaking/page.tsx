import Claiming from "@/components/Claiming";
import Unstaking from "@/components/Unstaking";
import PageTitle from "@/ui-kit/PageTitle";
import TabGroup from "@/ui-kit/TabGroup";

const UnstakingPage = () => {
  return (
    <>
      <PageTitle
        title="Unstaking"
        subtitle={
          <>
            Unstake using your LDOT and receive DOT based on the current
            exchange rate
            <br />
            DOT you receive by unstaking with LDOT will become claimable after 7
            days
          </>
        }
      />
      <TabGroup
        tabs={[
          {
            label: "Unstaking",
            panel: <Unstaking />,
          },
          {
            label: "Claiming",
            panel: <Claiming />,
          },
        ]}
      />
    </>
  );
};

export default UnstakingPage;
