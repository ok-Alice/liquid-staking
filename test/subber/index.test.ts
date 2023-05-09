import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import SubberFactory from "./typedContract/constructors/subber";
import Subber from "./typedContract/contracts/subber";
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";

use(chaiAsPromised);

// Create a new instance of contract
const wsProvider = new WsProvider("ws://127.0.0.1:9944");
// Create a keyring instance
const keyring = new Keyring({ type: "sr25519" });

describe("subber test", () => {
  let subberFactory: SubberFactory;
  let api: ApiPromise;
  let deployer: KeyringPair;
  
  let contract: Subber;
  const initialState = true;

  before(async function setup(): Promise<void> {
    api = await ApiPromise.create({ provider: wsProvider });
    deployer = keyring.addFromUri("//Alice");

    subberFactory = new SubberFactory(api, deployer);

    contract = new Subber(
      (await subberFactory.new(initialState)).address,
      deployer,
      api
    );
  });

  after(async function tearDown() {
    await api.disconnect();
  });
});
