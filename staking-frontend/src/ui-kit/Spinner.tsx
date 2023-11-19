import React from "react";

type SpinnerProps = {
  size?: string;
  color?: string;
};
const Spinner: React.FC<SpinnerProps> = ({
  size = "h-5 w-5",
  color = "black",
}) => {
  return (
    <span
      className={`animate-spin rounded-full border-t-2 border-b-2 border-${color} ${size}`}
    ></span>
  );
};

export default Spinner;
