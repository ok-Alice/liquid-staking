namespace deployDiamond {
  const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
  const {
    deployContract,
    contractQuery,
    contractTx,
    transferFromTo,
  } = require("./include/contract-operations");

  const { AbiMessage } = require("@polkadot/api-contract/types");

  const getSelectorsFromMessages = (
    messages: (typeof AbiMessage)[]
  ): number[][] => {
    return messages.map((message) => {
      return message.selector.toU8a() as unknown as number[];
    });
  };

  const getSelectorsFromMessagesString = (
    messages: (typeof AbiMessage)[]
  ): string[] => {
    return messages.map((message) => {
      return message.selector.toString();
    });
  };

  const getSelectorByName = (
    messages: (typeof AbiMessage)[],
    name: string
  ): number[] => {
    return messages
      .filter((message) => {
        return message.identifier == name;
      })[0]
      .selector.toU8a() as unknown as number[];
  };

  const getSelectorByNameString = (
    messages: (typeof AbiMessage)[],
    name: string
  ): string => {
    return messages
      .filter((message) => {
        return message.identifier == name;
      })[0]
      .selector.toString();
  };

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Zabbux: Attempt to call contracts pallet via API. Strangely the properties returned by this call
  // are not the same as when calling the same method form polkdadot.js.org...
  // I don't understand why?
  const contractCodeHash = async (
    api: typeof ApiPromise,
    contractAddress: string
  ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const gasLimit = api.registry.createType("WeightV2", {
        refTime: 100000n * 1000000n,
        proofSize: 100000n,
      });
      const storageDepositLimit = null;

      const result = await api.query.contracts.contractInfoOf(contractAddress);

      console.log(await api.query.contracts.contractInfoOf(contractAddress));

      console.log(api.query.contract);
      //console.log(result.createdAtHash.toHex());

      resolve(result);
    });
  };

  async function main() {
    const wsProvider = new WsProvider(); //defaults to localhost
    const api = await ApiPromise.create({ provider: wsProvider });

    // Get Alice Account for signing transactions
    const keyring = new Keyring({ type: "sr25519" });
    const alice = keyring.addFromUri("//Alice", { name: "Alice" });
    const bob = keyring.addFromUri("//Bob", { name: "Bob" });

    ////////////
    //
    // Deploy Flipper Facet contract
    //

    const issuerFacetContract = await deployContract(
      api,
      alice,
      "issuer_facet_v1"
    );

    const issuerFacetHash =
      issuerFacetContract.abi.info.source.wasmHash.toString();
    console.log("issuer_facet_v1 contract hash:", issuerFacetHash);

    const issuerFacetInit = getSelectorByName(
      issuerFacetContract.abi.messages,
      "init_psp22"
    );
    const issuerFacetSelectors = getSelectorsFromMessages(
      issuerFacetContract.abi.messages
    );
    const issuerFacetCut = [
      {
        hash: issuerFacetHash,
        selectors: issuerFacetSelectors,
      },
    ];

    ////////////
    //
    // Deploy PSP22 Facet contract
    //

    const stakerFacetContract = await deployContract(
      api,
      alice,
      "staker_facet_v1"
    );

    const stakerFacetHash =
      stakerFacetContract.abi.info.source.wasmHash.toString();
    console.log("staker_facet_v1 contract hash:", stakerFacetHash);

    const stakerFacetInit = getSelectorByName(
      stakerFacetContract.abi.messages,
      "pause"
    );
    const stakerFacetSelectors = getSelectorsFromMessages(
      stakerFacetContract.abi.messages
    );
    const stakerFacetCut = [
      {
        hash: stakerFacetHash,
        selectors: stakerFacetSelectors,
      },
    ];

    ////////////
    //
    // Deploy PSP22 Facet contract
    //

    const diamondCallerContract = await deployContract(
      api,
      alice,
      "diamond_caller"
    );

    const diamondCallerHash =
      diamondCallerContract.abi.info.source.wasmHash.toString();
    console.log("diamond_caller_v1 contract hash:", diamondCallerHash);

    const diamondCallerInit = getSelectorByName(
      diamondCallerContract.abi.messages,
      "balance_of"
    );
    const diamondCallerSelectors = getSelectorsFromMessages(
      diamondCallerContract.abi.messages
    );
    const diamondCallerCut = [
      {
        hash: diamondCallerHash,
        selectors: diamondCallerSelectors,
      },
    ];

    //////////////
    //
    // Deploy Diamond contract
    //

    const diamondContract = await deployContract(
      api,
      alice,
      "delegator",
      "./target/ink",
      alice.address
    );
    console.log(`diamond contract: ${diamondContract.address}`);

    const diamond_owner = await contractQuery(
      api,
      alice.address,
      diamondContract,
      "ownable::owner"
    );
    console.log(`diamond_owner: ${diamond_owner}`);

    //const tx_result = await transferFromTo(api, alice,diamond_contract.address, BigInt(8*1e19));
    //console.log(`transfer result: ${tx_result.status}`);

    const diamond_cut_result_issuer_facet = await contractTx(
      api,
      alice,
      alice.address,
      diamondContract,
      "diamond::diamondCut",
      issuerFacetCut,
      null
    );
    console.log(
      `diamond_cut add issuer facet:  ${diamond_cut_result_issuer_facet.status}`
    );

    const diamond_cut_result_staker_facet = await contractTx(
      api,
      alice,
      alice.address,
      diamondContract,
      "diamond::diamondCut",
      stakerFacetCut,
      null
    );
    console.log(
      `diamond_cut add staker facet:  ${diamond_cut_result_staker_facet.status}`
    );

    const diamond_cut_result_diamond_caller_facet = await contractTx(
      api,
      alice,
      alice.address,
      diamondContract,
      "diamond::diamondCut",
      diamondCallerCut,
      null
    );
    console.log(
      `diamond_cut add diamond caller facet:  ${diamond_cut_result_diamond_caller_facet.status}`
    );

    const facets = await contractQuery(
      api,
      alice.address,
      diamondContract,
      "diamondLoupe::facets"
    );
    console.log(`diamondLoup::facets: ${facets}`);

    ///////////////
    //
    // Call Facet functions through diamond

    const fstate = await contractQuery(
      api,
      alice.address,
      diamondContract,
      "forward",
      stakerFacetContract.query["pausable::paused"].meta.selector
    );
    console.log(`Staker facet paused state: ${fstate}`);

    // const flip = await contractTx(alice, stakerFacetContract, 'flip');
    // console.log(`Set Flip: ${flip.status}`);
    //
    // const fstate2 = await contractQuery(alice.address, stakerFacetContract, "get");
    // console.log(`Get Flipper state via Diamond: ${fstate2}`);

    // redirect psp22_contract through diamond
    // diamondCallerContract.address = diamond_contract.address;

    // const balance_alice = await contractQuery(alice.address, diamondCallerContract, "psp22::balance_of", alice.address, alice.address);
    // console.log(`PSP22 Balance Alice: ${balance_alice}`);
    // //
    // const approve = await contractTx(alice, issuerFacetContract, 'psp22::approve',  bob.address, 100);
    // console.log(`PSP22 Approve allowance: ${approve.status}`);
    //
    // const allowance = await contractQuery(alice.address, issuerFacetContract, "psp22::allowance", alice.address, bob.address);
    // console.log(`PSP22 Allowance Alice -> Bob : ${allowance}`);
    //
    // const transfer = await contractTx(bob, issuerFacetContract, 'psp22::transferFrom', alice.address, bob.address, 10, "test");
    // console.log(`PSP22 Balance transfer: ${transfer.status}`);
    //
    // const balance_alice2 = await contractQuery(alice.address, issuerFacetContract, "psp22::balanceOf", alice.address);
    // console.log(`PSP22 Balance Alice: ${balance_alice2}`);
    //
    // const balance_bob = await contractQuery(alice.address, issuerFacetContract, "psp22::balanceOf", bob.address);
    // console.log(`PSP22 Balance Alice: ${balance_bob}`);
    //
    // const allowance2 = await contractQuery(alice.address, issuerFacetContract, "psp22::allowance", alice.address, bob.address);
    // console.log(`PSP22 Allowance Alice -> Bob : ${allowance2}`);
  }

  main()
    .catch(console.error)
    .finally(() => process.exit());
}
