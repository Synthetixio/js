import { ethers } from 'ethers'

export enum Networks {
	Mainnet = 'mainnet',
	Ropsten = 'ropsten',
	Rinkeby = 'rinkeby',
	Kovan = 'kovan',
}

export enum EthereumLibraries {
	Ethers = 'ethers',
}

export interface Config {
	network: Networks
	signer?: ethers.Signer
	provider?: ethers.providers.Provider
	library: EthereumLibraries
}
