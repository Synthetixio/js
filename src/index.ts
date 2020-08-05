import { ethers } from 'ethers';
import getSynthetixContracts from './getSynthetixContracts';
import { Config } from './types';
import { createContractInstance } from './createContractInstance';

export default function ({ network, signer, provider }: Config) {
	const contractData = getSynthetixContracts(network);
	const synthetixContracts = contractData.map(({ name, abi, address }) => ({
		[name]: createContractInstance(address, abi, provider || signer),
	}));
	return {
		synthetixContracts,
		utils: ethers.utils,
	};
}
