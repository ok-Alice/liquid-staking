import '@polkadot/api-augment/substrate';
import { Command } from 'commander';

import config from './config';
import getValidators from './validators';
import sendValidators from './oracle';

const program = new Command();
program
  .name('validator-selector')
  .requiredOption('-c, --chain <chain>', 'Substrate chain to connect to')
  .parse(process.argv);

const options = program.opts();
const chain = options.chain as string;
const chainInfo = config.chains[chain];

void (async function () {
  // get validators from chain
  console.log(`Getting validators from ${chain}...`);
  const validators = await getValidators(chainInfo);

  // send validators to oracle
  console.log('Sending validators to oracle...');
  await sendValidators(config.oracle, validators);

  // shutdown
  console.log('Done!');
  // eslint-disable-next-line no-process-exit
  process.exit(0);
})();
