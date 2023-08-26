import { ContractPromise } from '@polkadot/api-contract';
// eslint-disable-next-line node/no-extraneous-import
import { WeightV2 } from '@polkadot/types/interfaces';
// eslint-disable-next-line node/no-extraneous-import
import { Registry } from '@polkadot/types/types';
import { BN, BN_ONE } from '@polkadot/util';
import { ContractResponse } from './types';
import { AddressOrPair } from '@polkadot/api/types';
import { ContractOptions } from '@polkadot/api-contract/types';

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);

// contract call helpers
export function getGasLimit(
  registry: Registry,
  refTime: BN | number,
  proofSize: BN | number
): WeightV2 {
  return registry.createType('WeightV2', {
    refTime,
    proofSize,
  });
}

export async function contractQuery(
  contract: ContractPromise,
  registry: Registry,
  accountAddress: string,
  method: string,
  params?: any[]
): Promise<ContractResponse> {
  const methodArgs: (string | ContractOptions | any[])[] = [
    accountAddress,
    {
      gasLimit: getGasLimit(registry, MAX_CALL_WEIGHT, PROOFSIZE),
      storageDepositLimit: null,
    },
  ];

  if (params) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    methodArgs.push(...params);
  }

  const { output, result, gasRequired } = await contract.query[
    method
    // @ts-ignore
  ](...methodArgs);
  return {
    output,
    result,
    gasRequired,
  };
}

export async function sendTransaction(
  options: ContractOptions,
  caller: AddressOrPair,
  contract: ContractPromise,
  method: string,
  params: any[]
): Promise<void | ErrorConstructor> {
  return new Promise<void>((resolve, reject) => {
    async function tx() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const tx = contract.tx[method](options, ...params);

      const unsub = await tx.signAndSend(caller, ({ status }) => {
        console.log(`Current status is ${status.type}`);
        if (status.isFinalized) {
          unsub();
          resolve();
        } else if (status.isDropped || status.isInvalid || status.isUsurped) {
          unsub();
          reject(new Error(status.type));
        }
      });
    }

    void tx();
  });
}
