import { BN } from '@polkadot/util';

export type ChainInfo = {
  decimals: number;
  token: string;
  websocket: string;
};

export type Validator = {
  address: string;
  commission: number;
  ema: number;
  bonded: BN;
  lastActiveEra: number;
};

export type Era = { number: number; points: Record<string, number> };
