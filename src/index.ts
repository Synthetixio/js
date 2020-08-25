import {
	getSource,
	getTarget,
	getSynths,
	getUsers,
	toBytes32,
	getVersions,
	getSuspensionReasons,
	getStakingRewards,
} from 'synthetix';
import { ethers } from 'ethers';

import {
	Config,
	Networks,
	NetworkIds,
	Target,
	TargetsRecord,
	ContractsMap,
	SynthetixJS,
	SupportedNetworks,
} from './types';
import { SUPPORTED_NETWORKS, ERRORS } from './constants';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const synthetix = ({ networkId, network, signer, provider }: Config) => {
	const currentNetwork = selectNetwork(networkId, network);
	const synthetixData: SynthetixJS = {
		currentNetwork,
		supportedNetworks,
		sources: getSource({ network: currentNetwork }),
		targets: getTarget({ network: currentNetwork }),
		synths: getSynths({ network: currentNetwork }),
		users: getUsers({ network: currentNetwork }),
		versions: getVersions({ network: currentNetwork }),
		stakingRewards: getStakingRewards({ network: currentNetwork }),
		suspensionReasons: getSuspensionReasons(),
		toBytes32,
		utils: ethers.utils,
	};
	const contracts: ContractsMap = getSynthetixContracts(currentNetwork, signer, provider);
	return {
		...contracts,
		...synthetixData,
	};
};

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
	const sources = getSource({ network });
	const targets: TargetsRecord = getTarget({ network });

	const contracts: ContractsMap = {};

	Object.values(targets)
		.map((target: Target) => {
			if (target.name === 'Synthetix') {
				target.address = targets.ProxyERC20.address;
			} else if (target.name === 'SynthsUSD') {
				target.address = targets.ProxyERC20sUSD.address;
			} else if (target.name.startsWith('Synths') || target.name.startsWith('Synthi')) {
				const newTarget = target.name.replace('Synth', 'Proxy');
				target.address = targets[newTarget].address;
			}
			return target;
		})
		.forEach(({ name, source, address }: Target) => {
			contracts[name] = new ethers.Contract(
				address,
				sources[source].abi,
				signer || provider || ethers.getDefaultProvider(network)
			);
		});

	return contracts;
};

export { synthetix, Networks, NetworkIds, SUPPORTED_NETWORKS };
export type { Config, Target, TargetsRecord, ContractsMap, SynthetixJS, SupportedNetworks };
export default synthetix;
