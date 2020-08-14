const synthetix = require('../build/index.js')(async () => {
	console.log('what is in synthetix', synthetix);
	// this instance exposes props for the given network: synths, sources, targets, users, as well as helper function toBytes32 - as per synthetix: https://github.com/Synthetixio/synthetix/blob/develop/index.js#L199.
	const snxjs = synthetix({ network: 'mainnet' });

	const { formatEther } = snxjs.ethers.utils;

	const synths = snxjs.synths.map(({ name }) => name);
	const fromBlock = blockTarget.value;
	const blockOptions = fromBlock ? { blockTag: Number(fromBlock) } : {};

	let totalInUSD = 0;

	const unformattedSnxPrice = await snxjs.ExchangeRates.rateForCurrency(
		snxjs.toBytes32('SNX'),
		blockOptions
	); // note blockOptions must be passed to `ethers.Contract` as the final parameter (and fails if no archive node)
	const snxPrice = formatEther(unformattedSnxPrice);
	console.log('snxPrice', snxPrice);

	let results = await Promise.all(
		synths.map(async (synth) => {
			const totalAmount = await snxjs[`Synth${synth}`].totalSupply(blockOptions);

			const totalSupply = formatEther(totalAmount);
			const rateForSynth = formatEther(
				await snxjs.ExchangeRates.rateForCurrency(snxjs.toBytes32(synth), blockOptions)
			);
			const totalSupplyInUSD = rateForSynth * totalSupply;
			totalInUSD += totalSupplyInUSD;
			const rateIsFrozen = await snxjs.ExchangeRates.rateIsFrozen(
				snxjs.toBytes32(synth),
				blockOptions
			);

			return { synth, totalAmount, totalSupply, rateForSynth, totalSupplyInUSD, rateIsFrozen };
		})
	);

	console.log('totalInUSD', totalInUSD);
	console.log('results', results);
})().catch((e) => {
	console.log('error');
});
