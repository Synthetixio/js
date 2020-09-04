import {
	getSource,
	getTarget,
	getSynths,
	getUsers,
	toBytes32,
	getVersions,
	getSuspensionReasons,
	getStakingRewards,
	networks,
	networkToChainId,
	getTokens,
	decode,
	defaults,
	getFeeds,
} from 'synthetix';
import { ethers } from 'ethers';

import {
	Config,
	Network,
	NetworkId,
	Target,
	TargetsRecord,
	ContractsMap,
	SynthetixJS,
	Synth,
	Token,
} from './types';
import { ERRORS } from './constants';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const synthetix = ({ networkId, network, signer, provider }: Config): SynthetixJS => {
	const [currentNetwork, currentNetworkId] = selectNetwork(networkId, network);
	return {
		network: {
			id: currentNetworkId,
			name: currentNetwork,
		},
		networks,
		networkToChainId,
		decode,
		defaults,
		feeds: getFeeds({ network: currentNetwork }),
		tokens: getTokens({ network: currentNetwork }),
		sources: getSource({ network: currentNetwork }),
		targets: getTarget({ network: currentNetwork }),
		synths: getSynths({ network: currentNetwork }),
		users: getUsers({ network: currentNetwork }),
		versions: getVersions({ network: currentNetwork }),
		stakingRewards: getStakingRewards({ network: currentNetwork }),
		suspensionReasons: getSuspensionReasons(),
		toBytes32,
		utils: ethers.utils,
		contracts: getSynthetixContracts(currentNetwork, signer, provider),
	};
};

const selectNetwork = (networkId?: NetworkId, network?: Network): [Network, NetworkId] => {
	let currentNetwork: Network = Network.Mainnet;
	let currentNetworkId: NetworkId = NetworkId.Mainnet;
	if (
		(network && !networks.includes(network)) ||
		(networkId && !Object.values(networkToChainId).includes(networkId))
	) {
		throw new Error(ERRORS.badNetworkArg);
	} else if (network && networks.includes(network)) {
		currentNetwork = network;
		currentNetworkId = networkToChainId[network];
	} else if (networkId) {
		Object.entries(networkToChainId).forEach(([key, value]) => {
			if (value === networkId) {
				currentNetwork = key as Network;
				currentNetworkId = value as NetworkId;
			}
		});
	}
	return [currentNetwork, currentNetworkId];
};

const getSynthetixContracts = (
	network: Network,
	signer?: ethers.Signer,
	provider?: ethers.providers.Provider
): ContractsMap => {
	const sources = getSource({ network });
	const targets: TargetsRecord = getTarget({ network });

	return Object.values(targets)
		.map((target: Target) => {
			if (target.name === 'Synthetix') {
				target.address = targets.ProxyERC20.address;
			} else if (target.name === 'SynthsUSD') {
				target.address = targets.ProxyERC20sUSD.address;
			} else if (target.name === 'FeePool') {
				target.address = targets.ProxyFeePool.address;
			} else if (target.name.match(/Synth(s|i)[a-zA-Z]+$/)) {
				const newTarget = target.name.replace('Synth', 'Proxy');
				target.address = targets[newTarget].address;
			}
			return target;
		})
		.reduce((acc: ContractsMap, { name, source, address }: Target) => {
			acc[name] = new ethers.Contract(
				address,
				sources[source].abi,
				signer || provider || ethers.getDefaultProvider(network)
			);
			return acc;
		}, {});
};

export { synthetix, Network, NetworkId };
export type { Config, Target, TargetsRecord, ContractsMap, SynthetixJS, Synth, Token };
export default synthetix;
