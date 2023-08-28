/* eslint-disable node/no-extraneous-import */
import { OracleInfo, Validator } from './types';
import { Abi, ContractPromise } from '@polkadot/api-contract';
import { contractQuery, sendTransaction } from './contract';
import { Keyring } from '@polkadot/api';
import { AccountId } from '@polkadot/types/interfaces';
import { U128, U32 } from '@polkadot/types';

import { connect } from './utils';

type ValidatorTuple = [AccountId, U32, U128];

export default async function sendValidators(
  oracleInfo: OracleInfo,
  validators: Validator[]
) {
  const api = await connect(oracleInfo.websocket);
  const contractAbi: Abi = require(oracleInfo.contractAbi);
  const oracleContract = new ContractPromise(
    api,
    contractAbi,
    oracleInfo.contractAddress
  );
  const keyring = new Keyring({ type: 'sr25519' });
  const caller = keyring.addFromUri(oracleInfo.callerAddress, {
    name: 'Alice',
  });

  // make a Vec of validators array
  const convertedToVec: ValidatorTuple[] = validators.map(
    ({ accountId, ema, bonded }) => [
      accountId,
      new U32(api.registry, ema),
      bonded as U128,
    ]
  );

  // send validators in batches

  const batchSize = 50;
  const batches = Math.ceil(convertedToVec.length / batchSize);

  console.log(
    `Sending ${convertedToVec.length} validators in batches of ${batchSize}`
  );

  for (let i = 0; i < batches; i += 1) {
    const batch = convertedToVec.slice(i * batchSize, (i + 1) * batchSize);
    const contractMethod = i === 0 ? 'set' : 'append';
    console.log(`Sending batch ${i + 1} of ${batches}`);

    const { gasRequired } = await contractQuery(
      oracleContract,
      api.registry,
      caller.address,
      contractMethod,
      [batch]
    );

    try {
      await sendTransaction(
        { gasLimit: gasRequired },
        caller,
        oracleContract,
        contractMethod,
        [batch]
      );
    } catch (e) {
      console.log(e);
      break;
    }
  }

  console.log('All validators sent to oracle');
}
