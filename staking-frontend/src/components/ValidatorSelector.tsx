"use client";

import { Listbox } from "@headlessui/react";
import { useEffect } from "react";

import { Validator } from "@/types";
import { useValidators } from "@/hooks";
import Spinner from "@/ui-kit/Spinner";
import { ValidatorName } from "./ValidatorName";

interface ValidatorSelectorProps {
  selectedValidator: Validator | null;
  setSelectedValidator: (validator: Validator) => void;
}

function ValidatorSelector({
  selectedValidator,
  setSelectedValidator,
}: ValidatorSelectorProps) {
  const { validators, isLoading } = useValidators();
  const handleValidatorChange = (validator: Validator) => {
    setSelectedValidator(validator);
  };

  useEffect(() => {
    if (validators.length && !selectedValidator) {
      setSelectedValidator(validators[0]);
    }
  }, [validators, selectedValidator, setSelectedValidator]);

  return (
    <Listbox
      value={selectedValidator}
      onChange={handleValidatorChange}
      as="div"
      className="max-w-lg w-full"
      disabled={isLoading}
    >
      <div className="relative">
        <Listbox.Button
          as="button"
          className="block py-4 w-full px-4 text-left bg-white border rounded-lg shadow-sm focus:outline-none"
        >
          {selectedValidator ? (
            <ValidatorName validator={selectedValidator} />
          ) : (
            <div className="flex  justify-between align-center">
              <span>Validators loading...</span>
              {isLoading && <Spinner />}
            </div>
          )}
        </Listbox.Button>
        <Listbox.Options
          as="ul"
          className="z-10 mt-2 absolute w-full py-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
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
              <ValidatorName validator={validator} />
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

export default ValidatorSelector;
