import { ethers } from 'ethers';

export enum Networks {
	Mainnet = 'mainnet',
	Ropsten = 'ropsten',
	Rinkeby = 'rinkeby',
	Kovan = 'kovan',
}

export interface Config {
	network: Networks;
	signer?: ethers.Signer;
	provider?: ethers.providers.Provider;
}
