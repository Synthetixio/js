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
	FunctionUnknown,
} from './types';
import { ERRORS } from './constants';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const synthetix = ({ networkId, network, signer, provider }: Config): SynthetixJS => {
	const [currentNetwork, currentNetworkId] = selectNetwork(networkId, network);
	const contracts = getSynthetixContracts(currentNetwork, signer, provider);
	const contractsCopy = { ...contracts };
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
		contracts,
		contractsAtBlock: (block: number) => memoizedBlockContracts(block, contractsCopy),
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

const memoizedBlockContracts = (block: number, contractsCopy: ContractsMap): ContractsMap => {
	return Object.entries(contractsCopy).reduce(
		(acc: ContractsMap, [contractName, contractInstance]: [string, ethers.Contract]) => {
			acc[contractName] = memoizedEthersContract(block, contractInstance);
			return acc;
		},
		{}
	);
};

const memoizedEthersContract = (
	block: number,
	contractInstance: ethers.Contract
): ethers.Contract => {
	const returnObj = Object.entries(contractInstance).reduce(
		(acc: ethers.Contract, [contractKey, contractItem]: [string, unknown | FunctionUnknown]) => {
			let newContractFunction = null;
			if (typeof contractItem === 'function') {
				newContractFunction = updateEthersMethodWithBlock(contractItem as FunctionUnknown, block);
			}
			if (contractKey != 'functions') {
				// @ts-ignore
				acc[contractKey] = newContractFunction || contractItem;
			} else {
				// @ts-ignore
				acc[contractKey] = Object.entries(contractItem).reduce(
					// @ts-ignore
					(acc: Record<string, unknown>, [fnName, fn]: [string, FunctionUnknown]) => {
						// @ts-ignore
						acc[fnName] = updateEthersMethodWithBlock(fn, block);
						return acc;
					},
					{}
				);
			}
			return acc;
		},
		{} as ethers.Contract
	);
	return returnObj;
};

const updateEthersMethodWithBlock = (contractFunction: FunctionUnknown, block: number): unknown => {
	return (...args: unknown[]) => {
		const newArgs = args.concat({ blockTag: block });
		return contractFunction(...newArgs);
	};
};

export { synthetix, Network, NetworkId };
export type { Config, Target, TargetsRecord, ContractsMap, SynthetixJS, Synth, Token };
export default synthetix;
