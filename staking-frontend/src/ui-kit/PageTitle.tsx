import React from "react";

type Props = {
  title: string;
  subtitle: string;
};

const PageTitle = ({ title, subtitle }: Props) => {
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-2">{title}</h1>
      <h5 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-6">
        {subtitle}
      </h5>
    </>
  );
};

export default PageTitle;