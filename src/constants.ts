import { Networks } from './types';

export type NetworkId = 1 | 3 | 4 | 42;

export const SUPPORTED_NETWORKS: Record<NetworkId, Networks> = {
	1: Networks.Mainnet,
	3: Networks.Ropsten,
	4: Networks.Rinkeby,
	42: Networks.Kovan,
};
