// @ts-ignore
import * as snx from 'synthetix';
import { ethers } from 'ethers';

import { Networks } from './types';

export default function (
	network: Networks,
): Array<{
	name: string;
	abi: ethers.ContractInterface;
	address: string;
}> {
	if (!Object.values(Networks).includes(network)) {
		throw new Error('unsupported network passed');
	}
	const sources = snx.getSource({ network });
	const targets = snx.getTarget({ network });

	return Object.values(targets).map(
		({ name, source, address }: { name: string; source: string; address: string }) => ({
			name,
			abi: sources[source].abi,
			address,
		}),
	);
}
