import React from "react";

type SpinnerProps = {
  className?: string;
};
const Spinner = ({ className }: SpinnerProps) => {
  return (
    <span
      className={`animate-spin rounded-full border-t-2 border-b-2 border-black h5 w-5 ${className}`}
    ></span>
  );
};

export default Spinner;
