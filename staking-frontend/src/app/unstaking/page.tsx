import Claiming from "@/components/Claiming";
import Unstaking from "@/components/Unstaking";
import PageTitle from "@/ui-kit/PageTitle";
import TabGroup from "@/ui-kit/TabGroup";

const UnstakingPage = () => {
  return (
    <>
      <PageTitle
        title="Unstaking"
        subtitle="Unstake your LDOT and claim available DOT when available"
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
