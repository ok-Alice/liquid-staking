import { ChainInfo } from './types';

const config: {
  chains: Record<string, ChainInfo>;
  maxCommission: number;
  maxEras: number;
  maxValidators: number;
} = {
  chains: {
    polkadot: {
      decimals: 10,
      token: 'DOT',
      websocket: 'wss://rpc.polkadot.io',
    },
    kusama: {
      decimals: 12,
      token: 'KSM',
      websocket: 'wss://kusama-rpc.polkadot.io',
    },
    westend: {
      decimals: 12,
      token: 'WND',
      websocket: 'wss://westend-rpc.polkadot.io',
    },
  },
  maxCommission: 5,
  maxEras: 25,
  maxValidators: 250,
};

export default config;
