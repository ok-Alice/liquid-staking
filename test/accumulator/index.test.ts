import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import AccumulatorFactory from "./typedContract/constructors/accumulator";
import Accumulator from "./typedContract/contracts/accumulator";
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";

use(chaiAsPromised);

// Create a new instance of contract
const wsProvider = new WsProvider("ws://127.0.0.1:9944");
// Create a keyring instance
const keyring = new Keyring({ type: "sr25519" });

describe("accumulator test", () => {
  let accumulatorFactory: AccumulatorFactory;
  let api: ApiPromise;
  let deployer: KeyringPair;
  
  let contract: Accumulator;
  const initialState = true;

  before(async function setup(): Promise<void> {
    api = await ApiPromise.create({ provider: wsProvider });
    deployer = keyring.addFromUri("//Alice");

    accumulatorFactory = new AccumulatorFactory(api, deployer);

    contract = new Accumulator(
      (await accumulatorFactory.new(initialState)).address,
      deployer,
      api
    );
  });

  after(async function tearDown() {
    await api.disconnect();
  });
});
