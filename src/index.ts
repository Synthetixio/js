// @ts-ignore
import * as snx from 'synthetix';
import { ethers } from 'ethers';
import keyBy from 'lodash/keyBy';

import {
	Config,
	Networks,
	NetworkIds,
	ContractDefinitionWithInstance,
	Target,
	ContractsMap,
} from './types';
import { SupportedNetworks, Errors } from './constants';

export default function ({ networkId, network, signer, provider }: Config) {
	const currentNetwork = selectNetwork(networkId, network);
	return {
		currentNetwork,
		contracts: getSynthetixContracts(currentNetwork, signer, provider),
		supportedNetworks,
		utils,
	};
}

const supportedNetworks: Record<NetworkIds, Networks> = SupportedNetworks;
const utils: typeof ethers.utils = ethers.utils;

const selectNetwork = (networkId?: NetworkIds, network?: Networks): Networks => {
	let currentNetwork: Networks = Networks.Mainnet;
	if (
		(network && !Object.values(Networks).includes(network)) ||
		(networkId && !SupportedNetworks[networkId])
	) {
		throw new Error(Errors.badNetworkArg);
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
	const targets: Record<string, Target> = snx.getTarget({ network });

	const contracts = Object.values(targets).map(
		({ name, source, address }: Target): ContractDefinitionWithInstance => ({
			name,
			abi: sources[source].abi,
			address,
			instance: new ethers.Contract(
				address,
				sources[source].abi,
				signer || provider || ethers.getDefaultProvider(network)
			),
		})
	);

	return keyBy(contracts, 'name');
};
