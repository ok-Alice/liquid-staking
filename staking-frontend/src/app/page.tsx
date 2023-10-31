"use client";

import { Tab } from "@headlessui/react";

import { Staking } from "@/components";
import Card from "@/ui-kit/Card";

function HomePage() {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-sky-900/20 p-1 max-w-md w-full">
        {["Staking", "Unstaking"].map((category) => (
          <Tab
            key={category}
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 leading-5 font-semibold ring-white/60 ring-offset-2 ring-offset-white/60 focus:outline-none uppercase  ${
                selected
                  ? "bg-white shadow text-primary"
                  : "text-white hover:bg-white/[0.12] hover:text-white"
              }}`
            }
          >
            {category}
          </Tab>
        ))}
      </Tab.List>

      <Tab.Panels className="w-full mt-5">
        <Tab.Panel>
          <Staking />
        </Tab.Panel>
        <Tab.Panel className="flex justify-center">
          <Card small>
            <div></div>
          </Card>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

export default HomePage;
