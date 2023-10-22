import { Validator } from "./types";

export const getValidatorName = (validator: Validator) => {
  const { display, parent } = validator.identity;

  if (!display) {
    return validator.address;
  }

  if (parent) {
    return (
      <>
        {parent} / <span className="text-gray-300">{display}</span>
      </>
    );
  }

  return display;
};
