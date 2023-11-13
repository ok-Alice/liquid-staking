import React from "react";

type SpinnerProps = {
  size?: string;
};
const Spinner = ({ size = "h-5 w-5" }: SpinnerProps) => {
  return (
    <span
      className={`animate-spin rounded-full border-t-2 border-b-2 border-black ${size}`}
    ></span>
  );
};

export default Spinner;
