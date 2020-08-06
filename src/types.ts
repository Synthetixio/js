import { ethers } from 'ethers';

export enum Networks {
	Mainnet = 'mainnet',
	Ropsten = 'ropsten',
	Rinkeby = 'rinkeby',
	Kovan = 'kovan',
}

export enum NetworkIds {
	Mainnet = 1,
	Ropsten = 3,
	Rinkeby = 4,
	Kovan = 42,
}

export type Target = {
	name: string;
	source: string;
	address: string;
};

export type ContractDefinition = {
	name: string;
	abi: ethers.ContractInterface;
	address: string;
};

export type Config = {
	networkId?: NetworkIds;
	network?: Networks;
	signer?: ethers.Signer;
	provider?: ethers.providers.Provider;
};
