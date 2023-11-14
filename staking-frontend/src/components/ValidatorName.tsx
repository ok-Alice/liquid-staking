import { Validator } from "@/types";

type Props = {
  validator: Validator;
};
const ValidatorName: React.FC<Props> = ({ validator }: Props) => {
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

export default ValidatorName;
