"use client";

import { Tab } from "@headlessui/react";

type Tab = {
  label: string;
  panel: React.ReactNode;
};
type Props = {
  tabs: Tab[];
};

const TabGroup = ({ tabs }: Props) => {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-sky-900/20 p-1 max-w-md w-full">
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 leading-5 font-semibold ring-white/60 ring-offset-2 ring-offset-white/60 focus:outline-none uppercase  ${
                selected
                  ? "bg-white shadow text-primary"
                  : "text-white hover:bg-white/[0.12] hover:text-white"
              }}`
            }
          >
            {tab.label}
          </Tab>
        ))}
      </Tab.List>

      <Tab.Panels className="w-full mt-5">
        {tabs.map((tab) => (
          <Tab.Panel key={tab.label}>{tab.panel}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default TabGroup;
