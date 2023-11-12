"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faGavel,
  faGlobe,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

import { Validator } from "@/types";
import Card from "@/ui-kit/Card";
import { ValidatorName } from "./ValidatorName";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ValidatorMetricsProps {
  validator: Validator;
}

const ValidatorMetrics = ({ validator }: ValidatorMetricsProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { identity, staked, eraPoints } = validator;
  const data = {
    labels: eraPoints.map((ep) => ep.era),
    datasets: [
      {
        label: `Reward Points For the last ${eraPoints.length} eras`,
        data: eraPoints.map((ep) => ep.points),
        backgroundColor: "rgb(14, 165, 233)",
        borderColor: "rgb(14, 165, 233)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          title: function (items: TooltipItem<"line">[]) {
            const item = items[0];
            if (item) {
              return `Era: ${item.label}`;
            }
            return "";
          },
          label: function (context: TooltipItem<"line">) {
            return `Reward Points: ${context.parsed.y}`;
          },
        },
      },
    },
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Card>
      <div className="flex flex-col xl:flex-row justify-between">
        <div className="min-w-[22rem] p-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            <ValidatorName validator={validator} />
          </h3>
          <div className="grid grid-cols-2 xl:grid-cols-1 gap-2 mb-4">
            <div className="col-span-1 flex items-center" title="Email Address">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="mr-2 text-gray-600"
              />
              <span>{identity.email || "N/A"}</span>
            </div>
            <div className="col-span-1 flex items-center" title="Website">
              <FontAwesomeIcon icon={faGlobe} className="mr-2 text-gray-600" />
              <span>{identity.web || "N/A"}</span>
            </div>
            <div className="col-span-1 flex items-center" title="Matrix Handle">
              <FontAwesomeIcon
                icon={faHashtag}
                className="mr-2 text-gray-600"
              />
              <span>{identity.riot || "N/A"}</span>
            </div>
            <div className="col-span-1 flex items-center" title="X Handle">
              <FontAwesomeIcon
                icon={faXTwitter}
                className="mr-2 text-gray-600"
              />
              <span>{identity.twitter || "N/A"}</span>
            </div>
            <div className="col-span-1 flex items-center" title="Legal Name">
              <FontAwesomeIcon icon={faGavel} className="mr-2 text-gray-600" />
              <span>{identity.legal || "N/A"}</span>
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-gray-700">
            <div>
              <strong>Own Stake: </strong>
              {staked.own} DOT
            </div>
            <div>
              <strong>Total Stake: </strong>
              {staked.total} DOT
            </div>
          </div>
        </div>
        <div className="transition-all ease-in-out duration-300 transform w-full ml-10 p-4">
          <Line key={windowWidth} data={data} options={options} />
        </div>
      </div>
    </Card>
  );
};

export default ValidatorMetrics;
