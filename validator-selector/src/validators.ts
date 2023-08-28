/* eslint-disable node/no-extraneous-import */
import { ApiPromise } from '@polkadot/api';
import { ValidatorPrefs } from '@polkadot/types/interfaces';
import { PalletStakingEraRewardPoints } from '@polkadot/types/lookup';
import { BN } from '@polkadot/util';

import { ChainInfo, Era, Validator } from './types';
import config from './config';
import { connect } from './utils';

async function filterValidators(
  api: ApiPromise,
  addresses: string[]
): Promise<Validator[]> {
  const validators = await Promise.all(
    addresses.map(async address => {
      const prefs = await api.query.staking.validators<ValidatorPrefs>(address);
      const accountId = api.registry.createType('AccountId', address);

      return {
        address,
        accountId,
        commission: Number(
          (prefs.commission.toHuman() as string).split('%')[0]
        ),
        ema: 0,
        bonded: new BN(0),
        lastActiveEra: 0,
      };
    })
  );

  // sort by lowest commission, then filter on commission less than maxCommission
  return validators
    .sort((a, b) => a.commission - b.commission)
    .filter(({ commission }) => commission <= config.maxCommission);
}

async function getEras(api: ApiPromise): Promise<Era[]> {
  const erasResult =
    await api.query.staking.erasRewardPoints.entries<PalletStakingEraRewardPoints>();
  const eras = erasResult.map(([era, eraRewardPoints]) => {
    const number = era.args[0].toNumber();
    const points = eraRewardPoints.individual.toJSON() as unknown as Record<
      string,
      number
    >;
    return {
      number,
      points,
    };
  });
  // Sort and take last maxEras (defined by config)
  return eras.sort((a, b) => a.number - b.number).slice(-config.maxEras);
}

// Get all validators from all eras
function getErasValidators(eras: Era[]): string[] {
  const validators = new Set<string>();
  eras.forEach(era => {
    for (const address of Object.keys(era.points)) {
      validators.add(address);
    }
  });
  return Array.from(validators);
}

function getValidatorEraPoints(validators: Validator[], eras: Era[]) {
  const validatorEraPoints: Record<string, number[]> = {};
  validators.forEach(validator => {
    let lastActiveEra = 0;
    validatorEraPoints[validator.address] = [];
    eras.forEach(era => {
      const eraPoints = era.points[validator.address] || 0;
      // Keep track of last active era, needed for later on to get total bonded tokens
      if (eraPoints > 0) lastActiveEra = era.number;

      validatorEraPoints[validator.address].push(eraPoints);
    });
    //  Set last active era, needed for later on to get total bonded tokens
    validator.lastActiveEra = lastActiveEra;
  });
  return validatorEraPoints;
}

function calculate_ema(data: number[]): number {
  const alpha = 2.0 / (data.length + 1);

  let ema = data[0];

  for (let i = 1; i < data.length; i++) {
    ema = alpha * data[i] + (1 - alpha) * ema;
  }

  return Math.round(ema);
}

async function setValidatorsBondedTokens(
  api: ApiPromise,
  validators: Validator[]
) {
  await Promise.all(
    validators.map(async validator => {
      const eraStakers = await api.query.staking.erasStakers(
        validator.lastActiveEra,
        validator.address
      );

      validator.bonded = eraStakers.total.toBn();
    })
  );
}

export default async function getValidators(chainInfo: ChainInfo) {
  const api = await connect(chainInfo.websocket);
  const eras = await getEras(api);

  // get validators filtered on maxCommission and maxValidators.
  let validators = await filterValidators(api, getErasValidators(eras));
  const validatorEraPoints = getValidatorEraPoints(validators, eras);

  // calculate and sort on highest ema
  validators.forEach(validator => {
    validator.ema = calculate_ema(validatorEraPoints[validator.address]);
  });

  validators.sort((a, b) => b.ema - a.ema);

  // take first maxValidators
  validators = validators.slice(0, config.maxValidators);

  await setValidatorsBondedTokens(api, validators);

  return validators;
}
