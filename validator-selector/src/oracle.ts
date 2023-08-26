import { ApiPromise, WsProvider } from '@polkadot/api';
import { OracleInfo, Validator } from './types';
import { Abi, ContractPromise } from '@polkadot/api-contract';
import { contractQuery, sendTransaction } from './contract';
import { Keyring } from '@polkadot/api';
// eslint-disable-next-line node/no-extraneous-import
import { U128, U32, createType } from '@polkadot/types';
// eslint-disable-next-line node/no-extraneous-import
import { AccountId } from '@polkadot/types/interfaces';

type ValidatorTuple = [AccountId, U32, U128];

export default async function sendValidators(
  oracleInfo: OracleInfo,
  validators: Validator[]
) {
  const provider = new WsProvider(oracleInfo.websocket);
  const api = await ApiPromise.create({ provider });
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
    ({ address, ema, bonded }) => {
      const accountId = createType(api.registry, 'AccountId', address);
      return [accountId, new U32(api.registry, ema), bonded as U128];
    }
  );

  // send validators in batches of 10, last batch could be less than 10.
  // wait for each batch to be mined before sending the next batch
  const batchSize = 10;
  const batches = Math.ceil(convertedToVec.length / batchSize);
  for (let i = 0; i < batches; i += 1) {
    const batch = convertedToVec.slice(i * batchSize, (i + 1) * batchSize);
    const contractMethod = i === 0 ? 'set' : 'append';
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
    }
  }
}
