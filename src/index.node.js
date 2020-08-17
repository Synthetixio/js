const fs = require('fs');
const { ethers } = require('ethers');
const path = require('path');
// @ts-ignore
const { wrap } = require('synthetix');

const SUPPORTED_NETWORKS = {
	1: 'mainnet',
	3: 'ropsten',
	4: 'rinkeby',
	42: 'kovan',
};

const ERRORS = {
	badNetworkArg:
		'unsupported network or network id passed. Please check SynthetixJS.supportedNetworks for a list of supported networks and ids',
	noMatch: (type, value) => `no contracts match ${type}: ${value}`,
};

const { getSource, getSynths, getTarget, getUsers } = wrap({
	fs,
	path,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getStuff({ networkId, network, signer, provider }) {
	// const currentNetwork = selectNetwork(networkId, network);
	const synthetixData = {
		supportedNetworks,
		sources: getSource({ network }),
		targets: getTarget({ network }),
		synths: getSynths({ network }),
		users: getUsers({ network }),
		ethers,
	};
	console.log(synthetixData);
	const contracts = getSynthetixContracts(currentNetwork, signer, provider);
	return {
		...contracts,
		...synthetixData,
	};
}

const supportedNetworks = SUPPORTED_NETWORKS;

const selectNetwork = (networkId, network) => {
	let currentNetwork = Networks.Mainnet;
	if (
		(network && !Object.values(Networks).includes(network)) ||
		(networkId && !supportedNetworks[networkId])
	) {
		throw new Error(ERRORS.badNetworkArg);
	} else if (network && Object.values(Networks).includes(network)) {
		currentNetwork = network;
	} else if (networkId) {
		currentNetwork = supportedNetworks[networkId];
	}
	return currentNetwork;
};

const getSynthetixContracts = (network, signer, provider) => {
	const sources = getSource({ network });
	const targets = getTarget({ network });

	const contracts = {};

	Object.values(targets).forEach(({ name, source, address }) => {
		contracts[name] = new ethers.Contract(
			address,
			sources[source].abi,
			signer || provider || ethers.getDefaultProvider(network)
		);
	});

	return contracts;
};

const test = getStuff({ network: 'mainnet' });
console.log('test', test);
