"use client";

import { Listbox } from "@headlessui/react";
import { Validator } from "@/types";
import { useValidators } from "@/hooks";

interface ValidatorSelectorProps {
  selectedValidator: Validator | null;
  setSelectedValidator: (validator: Validator) => void;
}

const ValidatorSelector: React.FC<ValidatorSelectorProps> = ({
  selectedValidator,
  setSelectedValidator,
}) => {
  const { validators, isLoading } = useValidators();
  const handleValidatorChange = (validator: Validator) => {
    setSelectedValidator(validator);
  };

  const getValidatorName = (validator: Validator) => {
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Listbox
        value={selectedValidator}
        onChange={handleValidatorChange}
        as="div"
        className="space-y-4"
      >
        <div className="relative">
          <Listbox.Button
            as="button"
            className="block w-full py-4 px-4 text-left bg-white border rounded-lg shadow-sm focus:outline-none"
          >
            {selectedValidator ? (
              getValidatorName(selectedValidator)
            ) : (
              <div className="flex  justify-between align-center">
                <span>Select a validator...</span>
                {isLoading && (
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></span>
                )}
              </div>
            )}
          </Listbox.Button>
          <Listbox.Options
            as="ul"
            className="z-10 mt-2 absolute w-full py-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {!validators.length && (
              <Listbox.Option
                disabled
                value=""
                as="li"
                className="cursor-pointer select-none relative px-4 py-4 "
              >
                Validators loading...
              </Listbox.Option>
            )}
            {validators.map((validator) => (
              <Listbox.Option
                key={validator.address}
                value={validator}
                as="li"
                className={({ active }) =>
                  `${
                    active ? "text-white bg-sky-500" : "text-gray-900"
                  } cursor-pointer select-none relative px-4 py-4`
                }
              >
                {getValidatorName(validator)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default ValidatorSelector;
