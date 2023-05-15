import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import StakerFactory from "./typedContract/constructors/staker_facet_v1";
import Staker from "./typedContract/contracts/staker_facet_v1";
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";

use(chaiAsPromised);

// Create a new instance of contract
const wsProvider = new WsProvider("ws://127.0.0.1:9944");
// Create a keyring instance
const keyring = new Keyring({ type: "sr25519" });

describe("staker_facet_v1 test", () => {
  let stakerFactory: StakerFactory;
  let api: ApiPromise;
  let deployer: KeyringPair;
  
  let contract: Staker;
  const initialState = true;

  before(async function setup(): Promise<void> {
    api = await ApiPromise.create({ provider: wsProvider });
    deployer = keyring.addFromUri("//Alice");

    stakerFactory = new StakerFactory(api, deployer);

    contract = new Staker(
      (await stakerFactory.new(initialState)).address,
      deployer,
      api
    );
  });

  after(async function tearDown() {
    await api.disconnect();
  });
});
