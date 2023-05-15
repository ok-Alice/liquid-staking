import { ApiPromise, Keyring } from '@polkadot/api';
const { CodePromise, ContractPromise, ContractSubmittableResult } = require('@polkadot/api-contract');

import  fs  from 'fs';
import {delay} from "rxjs";

export const fetchContractJson = (name: string) => {
    const fullname = `./target/ink/${name}/${name}.contract`;

    return JSON.parse(fs.readFileSync(fullname,'utf-8'));
}


export const deployContract = async (
    api: ApiPromise,
    account: Keyring,
    contractName: string,
    ...args: any[]
): Promise<typeof ContractPromise> => {
    console.log(`deployContract(${contractName})`);
    return new Promise(async (resolve, reject) => {
        const contractJson = fetchContractJson(contractName);

        const code = new CodePromise(api, contractJson, contractJson.wasm);

        const gasLimit = 100000n * 1000000n;
        const storageDepositLimit = null;

        const tx = code.tx.new({ gasLimit, storageDepositLimit}, ...args);

        const deploy = new Promise<string>(async (resolve, reject) => {
            const unsub = await tx.signAndSend(account, async ({ contract, status }) => {

                const rejectPromise = (error: any) => {
                    console.error(`Error sending tx`, error);
                    console.log(`tx for the error above`, tx.toHuman());
                    unsub();
                    reject(error);
                }

                console.log(`status: ${status}`);

                if (status.isInBlock || status.isFinalized) {
                    // get address retrying if not available yet wait 3 seconds and retry 3 times
                    let address: string | null = null;
                    let retries = 0;
                    while(address == null && retries < 3) {
                        if(contract && contract.address != null) {
                            address = contract.address;
                        } else {
                            console.log(`contract.address is null, retrying in 3 seconds`);
                            await delay(3000);
                            retries++;
                        }
                    }

                    if(address == null) {
                        rejectPromise(new Error(`Extrinsic isInBlock or isFinalized but contract.address is null`))
                    } else {
                        unsub();
                        resolve(address);
                    }
                } else if(status.isInvalid) {
                    rejectPromise(new Error(`Extrinsic isInvalid`))
                }
            });
        });

        const address = await deploy;

        resolve(new ContractPromise(api, contractJson, address));

    });
};


export const contractQuery = async (
    account: string,
    contract: typeof ContractPromise,
    method: string,
    ...args: any[]
) : Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const gasLimit = 100000n * 1000000n;
        const storageDepositLimit = null;

        const { gasRequired, storageDeposit, result, output } = await contract.query[method](
            account,
            {
                gasLimit,
                storageDepositLimit,
            },
            ...args,
        );

        if(result.isOk) {
            resolve(output);
        } else {
            reject(new Error('contractQuery failed!'));
        }
    });
};

export const contractTx = async (
    account: Keyring,
    contract: typeof ContractPromise,
    method: string,
    ...args: any[]
) : Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const gasLimit = 100000n * 1000000n;
        const storageDepositLimit = null;

        //console.log(`Calling ${contract.address} method ${method} with args ${args}`);

        const txresult = new Promise<typeof ContractSubmittableResult>(async(resolve, reject) => {
            await contract.tx[method]({ storageDepositLimit, gasLimit }, ...args)
                .signAndSend(
                    account,
                    (result: typeof ContractSubmittableResult) => {
                        const rejectPromise = (error: any) => {
                            console.error(`Error sending tx`, error);
                            console.log(`tx for the error above`, contract.tx.toHuman());
                            reject(error);
                        }

                        if (result.status.isInBlock || result.status.isFinalized) {
                            resolve(result);
                        } else if(result.status.isInvalid) {
                            rejectPromise(new Error(`Extrinsic isInvalid`));
                        }
                    });
        });


        const result = await txresult;

        if(result.dispatchError) {
            reject(new Error(`Dispatch error: ${result.dispatchError}`));
        } if(result.internalError) {
            reject(new Error(`Dispatch error: ${result.internalError}`));
        }  else {
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
        const txresult = new Promise<typeof ContractSubmittableResult>(async(resolve, reject) => {
            const transfer_tx = await api.tx.balances.transfer(to, amount)
                .signAndSend(
                    from,
                    (result) => {
                        const rejectPromise = (error: any) => {
                            console.error(`Error sending tx`, error);
                            reject(error);
                        }

                        if (result.status.isInBlock || result.status.isFinalized) {
                            resolve(result);
                        } else if(result.status.isInvalid) {
                            rejectPromise(new Error(`Extrinsic isInvalid`));
                        }
                    });
        });


        const result = await txresult;

        if(result.dispatchError) {
            reject(new Error(`Dispatch error: ${result.dispatchError}`));
        } if(result.internalError) {
            reject(new Error(`Dispatch error: ${result.internalError}`));
        }  else {
            resolve(result);
        }
    });

};