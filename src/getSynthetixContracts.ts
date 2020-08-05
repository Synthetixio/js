// @ts-ignore
import * as snx from 'synthetix';
import { ethers } from 'ethers';

import { Networks } from './types';

type Target = {
	name: string;
	source: string;
	address: string;
};

type ContractDefinition = {
	name: string;
	abi: ethers.ContractInterface;
	address: string;
};

type ContractDefinitions = ContractDefinition[];

const getSynthetixContracts = (network: Networks): ContractDefinitions => {
	if (!Object.values(Networks).includes(network)) {
		throw new Error('unsupported network passed');
	}
	const sources = snx.getSource({ network });
	const targets = snx.getTarget({ network });

	// TODO: figure out what's going on here
	// @ts-ignore
	return Object.values(targets).map(({ name, source, address }: Target) => ({
		name,
		abi: sources[source].abi,
		address,
	}));
};

export default getSynthetixContracts;
