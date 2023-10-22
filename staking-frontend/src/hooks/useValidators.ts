import { ApiPromise } from "@polkadot/api";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useApi } from "useink";
import { Polkadot } from "useink/chains";

import { validatorsAtom } from "@/store";
import { EraStaked, Validator } from "@/types";

const NOMINATION_POOL_ADDRESS = process.env.NEXT_PUBLIC_NOMINATION_POOL_ADDRESS;
const DEFAULT_VALIDATOR = {
  address: "",
  identity: {
    display: "",
    parent: "",
    email: "",
    legal: "",
    web: "",
    riot: "",
    twitter: "",
  },
  staked: {
    own: "",
    total: "",
  },
  eraPoints: [],
};

const useValidators = () => {
  const apiPromise = useApi(Polkadot.id);
  const [validators, setValidators] = useAtom(validatorsAtom);
  const [isLoading, setIsLoading] = useState(false);

  const getValidators = async (api: ApiPromise) => {
    const addresses = await getAddresses(api);
    let validators: Validator[] = addresses.map((address) => ({
      ...DEFAULT_VALIDATOR,
      address,
    }));

    await setValidatorIdentities(api, validators);
    await setCurrentEraStake(api, validators);
    await setEraRewards(api, validators);
    setIsLoading(false);
    setValidators(validators);
  };

  const getAddresses = async (api: ApiPromise): Promise<string[]> => {
    return api.query.staking
      .nominators(NOMINATION_POOL_ADDRESS)
      .then((response) => {
        const { targets } = response.toHuman() as { targets: string[] };
        return targets;
      });
  };

  const setValidatorIdentities = async (
    api: ApiPromise,
    validators: Validator[]
  ) => {
    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i];
      const validatorInfo = await api.derive.accounts.info(validator.address);
      if (!validatorInfo.identity) continue;
      validator.identity = {
        display: validatorInfo.identity.display,
        parent: validatorInfo.identity.displayParent,
        email: validatorInfo.identity.email,
        legal: validatorInfo.identity.legal,
        web: validatorInfo.identity.web,
        riot: validatorInfo.identity.riot,
        twitter: validatorInfo.identity.twitter,
      };
    }
  };

  const setEraRewards = async (api: ApiPromise, validators: Validator[]) => {
    const response = await api.query.staking.erasRewardPoints.entries();
    response.forEach((entry) => {
      const [era, points] = entry;
      const curEra = era.args[0].toJSON() as number;
      const { individual } = points.toJSON() as {
        individual: {
          [key: string]: number;
        };
      };

      validators.forEach((validator) => {
        const points = individual[validator.address];

        validator.eraPoints.push({
          era: curEra,
          points: points || 0,
        });
      });
    });

    // Sort eraPoints by era
    validators.forEach((validator) => {
      validator.eraPoints.sort((a, b) => a.era - b.era);
    });
  };

  const setCurrentEraStake = async (
    api: ApiPromise,
    validators: Validator[]
  ) => {
    const eraResponse = await api.query.staking.currentEra();

    validators.forEach(async (validator) => {
      const response = await api.query.staking.erasStakers(
        eraResponse.toJSON(),
        validator.address
      );
      const eraStaked = response.toHuman() as EraStaked;

      validator.staked = {
        own: eraStaked.own,
        total: eraStaked.total,
      };
    });
  };

  useEffect(() => {
    if (!apiPromise || validators.length) return;
    setIsLoading(true);
    getValidators(apiPromise.api);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPromise, validators]);

  return {
    validators,
    isLoading,
  };
};

export default useValidators;
