// @ts-ignore
import * as snx from 'synthetix';
import { ethers } from 'ethers';
import find from 'lodash/find';

import { Config, Networks, NetworkIds, ContractDefinition, Target } from './types';
import { SupportedNetworks, Errors } from './constants';

class SynthetixJS {
	static supportedNetworks: Record<NetworkIds, Networks> = SupportedNetworks;
	static utils: typeof ethers.utils = ethers.utils;

	readonly signer?: ethers.Signer;
	readonly provider?: ethers.providers.Provider;

	readonly currentNetwork: Networks;
	readonly contractsData: ContractDefinition[];
	readonly contracts: { [name: string]: ethers.Contract }[];

	constructor({ networkId, network, signer, provider }: Config) {
		let selectedNetwork: Networks = Networks.Mainnet;
		if (
			(network && !Object.values(Networks).includes(network)) ||
			(networkId && !SupportedNetworks[networkId])
		) {
			throw new Error(Errors.badNetworkArg);
		} else if (network && Object.values(Networks).includes(network)) {
			selectedNetwork = network;
		} else if (networkId) {
			selectedNetwork = SynthetixJS.supportedNetworks[networkId];
		}
		this.currentNetwork = selectedNetwork;

		const contractsData = getSynthetixContracts(selectedNetwork);
		this.contractsData = contractsData;
		this.contracts = contractsData.map(({ name, abi, address }: ContractDefinition) => ({
			[name]: new ethers.Contract(
				address,
				abi,
				signer || provider || ethers.getDefaultProvider(selectedNetwork)
			),
		}));
	}

	get contractNames(): string[] {
		return this.contractsData.map(({ name }) => name);
	}

	getContractNameByAddress(address: string): string {
		const contract = find(this.contractsData, (c: ContractDefinition) => c.address === address);
		return contract ? contract.name : Errors.noMatch('address', address);
	}

	getAddressByContractName(name: string): string {
		const contract = find(this.contractsData, (c: ContractDefinition) => c.name === name);
		return contract ? contract.address : Errors.noMatch('name', name);
	}
}

export const getSynthetixContracts = (network: Networks): ContractDefinition[] => {
	const sources = snx.getSource({ network });
	const targets: Record<string, Target> = snx.getTarget({ network });

	return Object.values(targets).map(({ name, source, address }: Target) => ({
		name,
		abi: sources[source].abi,
		address,
	}));
};

export default SynthetixJS;
