import { ethers } from 'ethers'

import getSynthetixContractData from './getSynthetixContractData'
import { Config, EthereumLibraries } from './types'
import { createContractInstance } from './ethereum-libraries/ethers'

export default function ({ network, signer, provider, library }: Config) {
	const contractData = getSynthetixContractData(network)
	switch (library) {
		case EthereumLibraries.Ethers: {
			const synthetixContracts = contractData.map(({ name, abi, address }) => ({
				[name]: createContractInstance(address, abi, provider || signer),
			}))
			return {
				synthetixContracts,
				ethers,
			}
		}
	}
}
