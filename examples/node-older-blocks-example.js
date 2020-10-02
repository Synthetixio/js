/// <reference types="../src/missing-types" />
const { synthetix } = require('../src/index.ts');
const { ethers } = require('ethers');

(async () => {
	let snxjs;
	if (process.env.INFURA_KEY) {
		console.log('using test infura key:', process.env.INFURA_KEY);
		const provider = new ethers.providers.InfuraProvider('homestead', process.env.INFURA_KEY);
		snxjs = synthetix({ network: 'mainnet', provider });
	} else {
		snxjs = synthetix({ network: 'mainnet' });
	}
	const { formatEther } = snxjs.utils;
	const fromBlock = 10290987;

	// method 1: using contractsAtBlock
	// NOTE: instead of using block options like we did in browser-example.html and node-example.js,
	// you can use the contractsAtBlock method to store the block in the ethers contract instance and
	// then every call you make will reference the old block data
	const olderContracts = snxjs.contractsAtBlock(fromBlock);
	try {
		const unformattedSnxPriceFromOlderContracts = await olderContracts.ExchangeRates.rateForCurrency(
			snxjs.toBytes32('SNX')
		);
		const snxPriceFromOlderContracts = formatEther(unformattedSnxPriceFromOlderContracts);
		console.log('snxPriceFromOlderContracts', snxPriceFromOlderContracts);
	} catch (olderContractsErr) {
		console.log('olderContractsErr', olderContractsErr);
	}

	// method 2: manually adding block tag like we did in browser-example.html and node-example.js
	try {
		const unformattedSnxPriceFromBlockTag = await snxjs.contracts.ExchangeRates.rateForCurrency(
			snxjs.toBytes32('SNX'),
			{ blockTag: fromBlock }
		);
		const snxPriceFromBlockTag = formatEther(unformattedSnxPriceFromBlockTag);
		console.log('snxPriceFromBlockTag', snxPriceFromBlockTag);
	} catch (blockTagErr) {
		console.log('blockTagErr', blockTagErr);
	}

	try {
		const unformattedSnxPrice = await snxjs.contracts.ExchangeRates.rateForCurrency(
			snxjs.toBytes32('SNX')
		); // note blockOptions must be passed to `ethers.Contract` as the final parameter (and fails if no archive node)
		const snxPrice = formatEther(unformattedSnxPrice);
		console.log('snxPrice', snxPrice);
	} catch (latestBlockErr) {
		console.log('latestBlockErr', latestBlockErr);
	}

	console.log(
		'there will only be a different value with prices at older blocks if you use an archive node provider'
	);
})().catch((e) => {
	console.log('error', e);
});
