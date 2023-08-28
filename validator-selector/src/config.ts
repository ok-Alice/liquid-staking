import { ChainInfo, OracleInfo } from './types';

const config: {
  chains: Record<string, ChainInfo>;
  maxCommission: number;
  maxEras: number;
  maxValidators: number;
  oracle: OracleInfo;
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
  oracle: {
    websocket: 'ws://127.0.0.1:9944',
    contractAddress: '5FEXbD7M4cBGkJfsR5MCuFPHt6shNSzxERoJYrv2u83WFCNT',
    contractAbi: '../../docker/milestone1/artefacts/oracle_validators.json',
    callerAddress: '//Alice',
  },
};

export default config;
