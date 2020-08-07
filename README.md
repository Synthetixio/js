Synthetix JS 
======

[![Synthetixio](https://circleci.com/gh/Synthetixio/js.svg?style=svg)](https://github.com/Synthetixio/js)

### The official Javascript library for interacting with Synthetix protocol contracts. 

This library can be used in 3 different environments:
  1. Common-js module for node environments
  2. UMD module for browser environments
  3. ES module for single page applications

#### Installation

```
// For node environments:
const synthetix = require('@synthetixio/js');

// For single page applications:
import synthetix from '@synthetixio/js';

// For browser environments:
// add the following script tag in your html file - <script src="somelinkherewhereweuploadtherightfile" />
// then you can access synthetix on the window object:
const synthetix = window.synthetix;
```

#### Usage

```
// this instance exposes props for the given network: synths, sources, targets, users, as well as helper function toBytes32 - as per synthetix: https://github.com/Synthetixio/synthetix/blob/develop/index.js#L199.
const snxjs = synthetix({ network: 'mainnet' });

const { formatEther } = synthetix.ethers.utils;

const synths = snxjs.synths.map(({ name }) => name);
const fromBlock = blockTarget.value;
const blockOptions = fromBlock ? { blockTag: Number(fromBlock) } : {};

let totalInUSD = 0;

const unformattedSnxPrice = await snxjs.ExchangeRates.contract.rateForCurrency('SNX', blockOptions) // note blockOptions must be passed to `ethers.Contract` as the final parameter (and fails if no archive node)
const snxPrice = formatEther(unformattedSnxPrice);
console.log('snxPrice', snxPrice);

let results = await Promise.all(synths.map(async synth => {
  const totalAmount = await snxjs[synth].contract.totalSupply(blockOptions);

  const totalSupply = formatEther(totalAmount);
  const rateForSynth = formatEther(await snxjs.ExchangeRates.contract.rateForCurrency(synth, blockOptions));
  const totalSupplyInUSD = rateForSynth * totalSupply;
  totalInUSD += totalSupplyInUSD;
  const rateIsFrozen = await snxjs.ExchangeRates.contract.rateIsFrozen(synth, blockOptions);

  return { synth, totalAmount, totalSupply, rateForSynth, totalSupplyInUSD, rateIsFrozen };
}));

console.log('totalInUSD', totalInUSD)
console.log('results', results);
```
