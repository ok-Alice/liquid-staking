import React, { ReactElement } from "react";

type Props = {
  title: string;
  subtitle: string | ReactElement;
};

const PageTitle = ({ title, subtitle }: Props) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-2 text-center">
        {title}
      </h1>
      <h5 className="text-lg font-medium text-gray-600 dark:text-gray-300  text-center">
        {subtitle}
      </h5>
    </div>
  );
};

export default PageTitle;
