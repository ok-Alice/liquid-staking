// eslint-disable-next-line node/no-extraneous-import
import '@polkadot/api-augment/substrate';

import config from './config';
import init from './validators';

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

void init(chainInfo)
  .then(validators => {
    // pretty print each validator with keys. convert BN to string
    validators.forEach(validator => {
      console.log(
        JSON.stringify(
          {
            ...validator,
            bonded: validator.bonded.toString(),
          },
          null,
          2
        )
      );
    });
  })
  // eslint-disable-next-line no-process-exit
  .finally(() => process.exit());
