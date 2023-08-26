// eslint-disable-next-line node/no-extraneous-import
import '@polkadot/api-augment/substrate';

import config from './config';
import getValidators from './validators';
import sendValidators from './oracle';

// UNCOMMENT FOR PRODUCTION
// import { Command } from 'commander';
// const program = new Command();
// program
//   .name('validator-selector')
//   .requiredOption('-c, --chain <chain>', 'Substrate chain to connect to')
//   .parse(process.argv);

// const options = program.opts();
// const chain = options.chain as string;
// const chainInfo = config.chains[chain];

// UNCOMMENT FOR DEBUGGING VSCODE
const chainInfo = config.chains['polkadot'];

void (async function () {
  // get validators from chain
  const validators = await getValidators(chainInfo);

  // send validators to oracle
  await sendValidators(config.oracle, validators);
})();
