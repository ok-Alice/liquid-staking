import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import AdderFactory from "./typedContract/constructors/adder";
import Adder from "./typedContract/contracts/adder";
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";

use(chaiAsPromised);

// Create a new instance of contract
const wsProvider = new WsProvider("ws://127.0.0.1:9944");
// Create a keyring instance
const keyring = new Keyring({ type: "sr25519" });

describe("adder test", () => {
  let adderFactory: AdderFactory;
  let api: ApiPromise;
  let deployer: KeyringPair;
  
  let contract: Adder;
  const initialState = true;

  before(async function setup(): Promise<void> {
    api = await ApiPromise.create({ provider: wsProvider });
    deployer = keyring.addFromUri("//Alice");

    adderFactory = new AdderFactory(api, deployer);

    contract = new Adder(
      (await adderFactory.new(initialState)).address,
      deployer,
      api
    );
  });

  after(async function tearDown() {
    await api.disconnect();
  });
});
