import { Networks, NetworkIds, SupportedNetworks } from './types';

export const SUPPORTED_NETWORKS: SupportedNetworks = {
	[NetworkIds.Mainnet]: Networks.Mainnet,
	[NetworkIds.Ropsten]: Networks.Ropsten,
	[NetworkIds.Rinkeby]: Networks.Rinkeby,
	[NetworkIds.Kovan]: Networks.Kovan,
};

export const ERRORS = {
	badNetworkArg:
		'unsupported network or network id passed. Please check SynthetixJS.supportedNetworks for a list of supported networks and ids',
	noMatch: (type: string, value: string): string => `no contracts match ${type}: ${value}`,
};
