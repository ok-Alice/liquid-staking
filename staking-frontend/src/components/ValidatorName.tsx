import { Validator } from "@/types";

type ValidatorNameProps = {
  validator: Validator;
};
export const ValidatorName = ({ validator }: ValidatorNameProps) => {
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
