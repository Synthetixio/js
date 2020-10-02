# Synthetix JS

[![Synthetixio](https://circleci.com/gh/Synthetixio/js.svg?style=svg)](https://github.com/Synthetixio/js)

:warning: This library is still under construction and in BETA, please use with caution.

### The official Javascript library for interacting with Synthetix protocol contracts.

This library can be used in 2 different environments:

1. Common-js module for node environments
2. UMD module for browser environments

#### Installation

```

// For node environments:
const { synthetix } = require('@synthetixio/js');

// For single page applications:
import { synthetix } from '@synthetixio/js';

// For browser environments:
// after running npm build take the index.browser.js file and put it in a script tag
// then you can access synthetix on the window object:
const { synthetix } = window;


const snxjs = synthetix({ network: 'mainnet' });


// Note for typescript applications:
import { synthetix, Network } from '@synthetixio/js';
const snxjs = synthetix({ network: Network.Mainnet });
```

#### Usage

```
// this instance exposes props for the given network: synths, sources, targets, users, etc... as well as helper function toBytes32 - as per synthetix: https://github.com/Synthetixio/synthetix/blob/develop/index.js#L199.
const snxjs = synthetix({ network: 'mainnet' });

// If you want to interact with a contract, simply follow the convention:
// await snxjs[contractName].methodName(arguments)
// many arguments require being formatted toBytes32, which we also provide with the library
const unformattedSnxPrice = await snxjs.contracts.ExchangeRates.rateForCurrency(snxjs.toBytes32('SNX'));
const unformattedTotalSupply = await snxjs.contracts.SynthsUSD.totalSupply({});

// We also expose ethers utils which provides handy methods for formatting responses to queries.
const { formatEther } = snxjs.utils;

const snxPrice = formatEther(unformattedSnxPrice);
const totalSupply = formatEther(unformattedTotalSupply);

```

###### Historic block data

```
// NOTE for historic block data you have two options:
// both of these options require an archive node as a provider to work properly

// Option 1:
const unformattedSnxPrice = await snxjs.contracts.ExchangeRates.rateForCurrency(snxjs.toBytes32('SNX'), { blockTag: 10000000 });
const unformattedTotalSupply = await snxjs.contracts.SynthsUSD.totalSupply({ blockTag: 10000000 });

// Option 2 (see examples/node-older-blocks-example.js):
// we added a helper to make life easier if you are pulling a lot of data from the same older block\
// so you don't have to add the blockTag every time.
const olderContracts = snxjs.contractsAtBlock(10290987);
const olderUnformattedSnxPrice = await olderContracts.ExchangeRates.rateForCurrency(
	snxjs.toBytes32('SNX')
);
// this will automatically pass the block 10290987 as the blockTag reference for every method called on olderContracts

```

See the examples folder for more usage details
