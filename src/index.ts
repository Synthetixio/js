import { ethers } from 'ethers';

import getSynthetixContracts from './getSynthetixContracts';
import createContractInstance from './createContractInstance';

import { Config } from './types';

// TODO: consider using a class?

const init = ({
	network,
	signer,
	provider,
}: Config): {
	// TODO: type this
	synthetixContracts: Record<string, ethers.Contract>[];
	utils: typeof ethers.utils;
} => {
	const contractData = getSynthetixContracts(network);
	const synthetixContracts = contractData.map(({ name, abi, address }) => ({
		[name]: createContractInstance(address, abi, provider || signer),
	}));

	return {
		synthetixContracts,
		utils: ethers.utils,
	};
};

export default init;
