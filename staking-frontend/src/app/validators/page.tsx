"use client";
import React, { useState } from "react";
import { ValidatorSelector } from "@/components";
import { Validator } from "@/types";

interface ValidatorsPageProps {}

const ValidatorsPage: React.FC<ValidatorsPageProps> = () => {
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(
    null
  );

  return (
    <>
      <ValidatorSelector
        selectedValidator={selectedValidator}
        setSelectedValidator={setSelectedValidator}
      />
    </>
  );
};

export default ValidatorsPage;
