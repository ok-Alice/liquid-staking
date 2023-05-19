import { ApiPromise, Keyring } from "@polkadot/api";
import { BN, BN_ONE } from "@polkadot/util";
import type { WeightV2 } from "@polkadot/types/interfaces";
import fs from "fs";
import { delay } from "rxjs";
const {
  CodePromise,
  ContractPromise,
  ContractSubmittableResult,
} = require("@polkadot/api-contract");

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);

export const fetchContractJson = (name: string) => {
  const fullname = `./target/ink/${name}/${name}.contract`;

  return JSON.parse(fs.readFileSync(fullname, "utf-8"));
};

export const deployContract = async (
  api: ApiPromise,
  account: Keyring,
  contractName: string,
  overridePath?: string,
  ...args: any[]
): Promise<typeof ContractPromise> => {
  return new Promise(async (resolve, reject) => {
    const contractJson = overridePath
      ? JSON.parse(
          fs.readFileSync(
            overridePath + "/" + contractName + ".contract",
            "utf-8"
          )
        )
      : fetchContractJson(contractName);

    const code = new CodePromise(api, contractJson, contractJson.wasm);

    const gasLimit = api.registry.createType("WeightV2", {
      refTime: 100000n * 1000000n,
      proofSize: 100000n,
    });
    const storageDepositLimit = null;

    const tx = code.tx.new({ gasLimit, storageDepositLimit }, ...args);

    const deploy = new Promise<string>(async (resolve, reject) => {
      const unsub = await tx.signAndSend(
        account,
        async ({ contract, status }) => {
          const rejectPromise = (error: any) => {
            console.error(`Error sending tx`, error);
            console.log(`tx for the error above`, tx.toHuman());
            unsub();
            reject(error);
          };

          console.log(`status: ${status}`);

          if (status.isInBlock || status.isFinalized) {
            // get address retrying if not available yet wait 3 seconds and retry 3 times
            let address: string | null = null;
            let retries = 0;
            while (address == null && retries < 3) {
              if (contract && contract.address != null) {
                address = contract.address;
              } else {
                console.log(`contract.address is null, retrying in 3 seconds`);
                await delay(3000);
                retries++;
              }
            }

            if (address == null) {
              rejectPromise(
                new Error(
                  `Extrinsic isInBlock or isFinalized but contract.address is null`
                )
              );
            } else {
              unsub();
              resolve(address);
            }
          } else if (status.isInvalid) {
            rejectPromise(new Error(`Extrinsic isInvalid`));
          }
        }
      );
    });

    const address = await deploy;

    resolve(new ContractPromise(api, contractJson, address));
  });
};

export const contractQuery = async (
  api: ApiPromise,
  account: string,
  contract: typeof ContractPromise,
  method: string,
  ...args: any[]
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const gasLimit = api.registry.createType("WeightV2", {
      refTime: MAX_CALL_WEIGHT,
      proofSize: PROOFSIZE,
    }) as WeightV2;
    const storageDepositLimit = null;

    const { gasRequired, storageDeposit, result, output } =
      await contract.query[method](
        account,
        {
          gasLimit,
          storageDepositLimit,
        },
        ...args
      );

    if (result.isOk) {
      resolve(output);
    } else {
      console.log(result.toHuman());
      reject(new Error("contractQuery failed!"));
    }
  });
};

export const contractTx = async (
  api: ApiPromise,
  account: Keyring,
  accountAddress: string,
  contract: typeof ContractPromise,
  method: string,
  ...args: any[]
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const storageDepositLimit = null;

    const { gasRequired } = await contract.query[method](
      accountAddress,
      {
        gasLimit: api?.registry.createType("WeightV2", {
          refTime: MAX_CALL_WEIGHT,
          proofSize: PROOFSIZE,
        }) as WeightV2,
        storageDepositLimit,
      },
      ...args
    );

    const gasLimit = api?.registry.createType(
      "WeightV2",
      gasRequired
    ) as WeightV2;

    const txresult = new Promise<typeof ContractSubmittableResult>(
      async (resolve, reject) => {
        await contract.tx[method](
          { gasLimit, storageDepositLimit },
          ...args
        ).signAndSend(account, (result: typeof ContractSubmittableResult) => {
          const rejectPromise = (error: any) => {
            console.error(`Error sending tx`, error);
            console.log(`tx for the error above`, contract.tx.toHuman());
            reject(error);
          };

          console.log(result.toHuman());

          if (result.status.isInBlock || result.status.isFinalized) {
            resolve(result);
          } else if (result.status.isInvalid) {
            rejectPromise(new Error(`Extrinsic isInvalid`));
          }
        });
      }
    );

    const result = await txresult;

    if (result.dispatchError) {
      reject(new Error(`Dispatch error: ${result.dispatchError}`));
    }
    if (result.internalError) {
      reject(new Error(`Dispatch error: ${result.internalError}`));
    } else {
      resolve(result);
    }
  });
};

export const transferFromTo = async (
  api: ApiPromise,
  from: string,
  to: string,
  amount: number
) => {
  return new Promise(async (resolve, reject) => {
    const txresult = new Promise<typeof ContractSubmittableResult>(
      async (resolve, reject) => {
        const transfer_tx = await api.tx.balances
          .transfer(to, amount)
          .signAndSend(from, (result) => {
            const rejectPromise = (error: any) => {
              console.error(`Error sending tx`, error);
              reject(error);
            };

            if (result.status.isInBlock || result.status.isFinalized) {
              resolve(result);
            } else if (result.status.isInvalid) {
              rejectPromise(new Error(`Extrinsic isInvalid`));
            }
          });
      }
    );

    const result = await txresult;

    if (result.dispatchError) {
      reject(new Error(`Dispatch error: ${result.dispatchError}`));
    }
    if (result.internalError) {
      reject(new Error(`Dispatch error: ${result.internalError}`));
    } else {
      resolve(result);
    }
  });
};
