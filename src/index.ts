// @ts-ignore
import * as snx from 'synthetix';
import { ethers } from 'ethers';
import keyBy from 'lodash/keyBy';

import {
	Config,
	Networks,
	NetworkIds,
	ContractWithInstance,
	Target,
	TargetsRecord,
	ContractsMap,
	SynthetixJS,
	SupportedNetworks,
} from './types';
import { SUPPORTED_NETWORKS, ERRORS } from './constants';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function ({ networkId, network, signer, provider }: Config) {
	const currentNetwork = selectNetwork(networkId, network);
	const synthetixData: SynthetixJS = {
		currentNetwork,
		supportedNetworks,
		sources: snx.getSource({ network: currentNetwork }),
		targets: snx.getTarget({ network: currentNetwork }),
		synths: snx.getSynths({ network: currentNetwork }),
		users: snx.getUsers({ network: currentNetwork }),
		toBytes32: snx.toBytes32,
		ethers,
	};
	const contracts: ContractsMap = getSynthetixContracts(currentNetwork, signer, provider);
	return {
		...contracts,
		...synthetixData,
	};
}

const supportedNetworks: SupportedNetworks = SUPPORTED_NETWORKS;

const selectNetwork = (networkId?: NetworkIds, network?: Networks): Networks => {
	let currentNetwork: Networks = Networks.Mainnet;
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

const getSynthetixContracts = (
	network: Networks,
	signer?: ethers.Signer,
	provider?: ethers.providers.Provider
): ContractsMap => {
	const sources = snx.getSource({ network });
	const targets: TargetsRecord = snx.getTarget({ network });

	const contracts = Object.values(targets).map(
		({ name, source, address }: Target): ContractWithInstance => ({
			name,
			address,
			contract: new ethers.Contract(
				address,
				sources[source].abi,
				signer || provider || ethers.getDefaultProvider(network)
			),
		})
	);

	return keyBy(contracts, 'name');
};
