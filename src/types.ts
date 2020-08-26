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

type ContractInfo = {
	address: string;
	replaced_in: string;
	status: string;
};

type Version = {
	commit: string;
	contracts: { [name: string]: ContractInfo };
	date: string;
	fulltag: string;
	network: string;
	release: string;
	tag: string;
};

type StakingReward = {
	name: string;
	rewardsToken: string;
	stakingToken: string;
};

export type SynthetixJS = {
	currentNetwork: Networks;
	supportedNetworks: SupportedNetworks;
	sources: { [name: string]: SourceData };
	targets: TargetsRecord;
	synths: Synth[];
	versions: { [version: string]: Version };
	stakingRewards: Array<StakingReward>;
	suspensionReasons: { [code: number]: string };
	users: User[];
	toBytes32: (key: string) => string;
	utils: typeof ethers.utils;
	contracts: ContractsMap;
};

export type SupportedNetworks = Record<NetworkIds, Networks>;

export type SourceData = {
	bytecode: string;
	abi: ethers.ContractInterface;
};

export type Target = {
	name: string;
	source: string;
	address: string;
	link: string;
	timestamp: string;
	txn: string;
	network: Networks;
};

export type TargetsRecord = Record<string, Target>;

export interface ContractDefinition {
	name: string;
	abi: ethers.ContractInterface;
	address: string;
}

export type ContractsMap = {
	[name: string]: ethers.Contract;
};

export type Config = {
	networkId?: NetworkIds;
	network?: Networks;
	signer?: ethers.Signer;
	provider?: ethers.providers.Provider;
};

export type Synth = {
	name: string;
	asset: string;
	category: string;
	sign: string;
	desc: string;
	aggregator?: string;
	subclass?: string;
};

export type User = {
	name: string;
	address: string;
};
