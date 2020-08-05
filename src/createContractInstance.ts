import { ethers } from 'ethers';
import { Networks } from './types';

export const createContractInstance = (
	address: string,
	abi: ethers.ContractInterface,
	signerOrProvider?: ethers.Signer | ethers.providers.Provider,
	network?: Networks,
): ethers.Contract =>
	new ethers.Contract(
		address,
		abi,
		signerOrProvider ?? ethers.getDefaultProvider(network ?? Networks.Mainnet),
	);
