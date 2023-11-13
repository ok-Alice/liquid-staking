"use client";
import React, { useState } from "react";
import { ValidatorMetrics, ValidatorSelector } from "@/components";
import { Validator } from "@/types";
import PageTitle from "@/ui-kit/PageTitle";

interface ValidatorsPageProps {}

const ValidatorsPage: React.FC<ValidatorsPageProps> = () => {
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(
    null
  );

  return (
    <>
      <PageTitle
        title="Validators"
        subtitle="View information about validators currently in our validation pool"
      />
      <div className="flex justify-center w-full">
        <ValidatorSelector
          selectedValidator={selectedValidator}
          setSelectedValidator={setSelectedValidator}
        />
      </div>

      {!!selectedValidator && (
        <div className="mt-4 w-full flex justify-center">
          <ValidatorMetrics validator={selectedValidator} />
        </div>
      )}
    </>
  );
};

export default ValidatorsPage;
