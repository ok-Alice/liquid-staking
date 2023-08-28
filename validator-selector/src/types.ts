import {
  ContractExecResultResult,
  Weight,
  AccountId,
  // eslint-disable-next-line node/no-extraneous-import
} from '@polkadot/types/interfaces';
// eslint-disable-next-line node/no-extraneous-import
import { Codec } from '@polkadot/types/types';
import { BN } from '@polkadot/util';

export type ChainInfo = {
  decimals: number;
  token: string;
  websocket: string;
};

export type OracleInfo = {
  websocket: string;
  callerAddress: string;
  contractAddress: string;
  contractAbi: string;
};

export type Validator = {
  address: string;
  accountId: AccountId;
  commission: number;
  ema: number;
  bonded: BN;
  lastActiveEra: number;
};

export type ContractResponse = {
  output: Codec | null;
  result: ContractExecResultResult;
  gasRequired: Weight;
};

export type Era = { number: number; points: Record<string, number> };
