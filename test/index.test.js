import { ethers } from 'ethers';
import findIndex from 'lodash/findIndex';

import {
	numSynthetixContracts,
	badContractName,
	validContractName,
	numUsers,
	validSynthName,
	badSynthName,
	snxBytes,
	suspensionReason,
	numVersions,
	waitingPeriodSecs,
	tokensLength,
} from './constants';
import synthetix from '../src';
import { Network, NetworkId } from '../src/types';
import { ERRORS } from '../src/constants';

describe('@synthetixio/js tests', () => {
	let snxjs;
	const fromBlock = 10929392;

	beforeAll(() => {
		snxjs = synthetix({ network: Network.Kovan });
	});

	test('should return the right number of contracts', () => {
		expect(Object.keys(snxjs.targets).length).toBe(numSynthetixContracts);
	});

	test('should return the ethers object', () => {
		expect(typeof snxjs.utils).toBe(typeof ethers.utils);
	});

	test('should include the supported networks', () => {
		expect(snxjs.networkToChainId[Network.Mainnet]).toBe(NetworkId.Mainnet);
		expect(snxjs.networkToChainId[Network.Kovan]).toBe(NetworkId.Kovan);
		expect(snxjs.networkToChainId[Network.Rinkeby]).not.toBe(NetworkId.Ropsten);
	});

	test('should include the current network', () => {
		expect(snxjs.network.name).toBe(Network.Kovan);
		expect(snxjs.network.id).toBe(NetworkId.Kovan);
	});

	test('should return the right number of users', () => {
		expect(snxjs.users.length).toBe(numUsers);
	});

	test('should return valid contracts', () => {
		const validContract = snxjs.contracts[validContractName];
		expect(validContract).not.toBe(undefined);
	});

	test('should not return an invalid contract', () => {
		const invalidContract = snxjs.contracts[badContractName];
		expect(invalidContract).toBe(undefined);
	});

	test('should return valid older contracts at a block', () => {
		const olderContracts = snxjs.contractsAtBlock(fromBlock);
		const validContract = olderContracts[validContractName];
		expect(validContract).not.toBe(undefined);
		expect(validContract.claimFees).not.toBe(undefined);
	});

	test('should not return invalid older contracts at a block', () => {
		const olderContracts = snxjs.contractsAtBlock(fromBlock);
		const invalidContract = olderContracts[badContractName];
		expect(invalidContract).toBe(undefined);
	});

	test('should get the right sources data', () => {
		const validSource = snxjs.sources[validContractName];
		expect(validSource.bytecode).not.toBe(undefined);
		expect(validSource.abi).not.toBe(undefined);
	});

	test('should not include invalid sources data', () => {
		const invalidSource = snxjs.sources[badContractName];
		expect(invalidSource).toBe(undefined);
	});

	test('should get the right synths data', () => {
		const validSynthIndex = findIndex(snxjs.synths, ({ name }) => name === validSynthName);
		expect(validSynthIndex).not.toBe(-1);
	});

	test('should not include invalid synths data', () => {
		const invalidSynthIndex = findIndex(snxjs.synths, ({ name }) => name === badSynthName);
		expect(invalidSynthIndex).toBe(-1);
	});

	test('should have a list of staking rewards', () => {
		expect(snxjs.stakingRewards.length).toEqual(0);
		const mainnetSnxjs = synthetix({ network: Network.Mainnet });
		expect(mainnetSnxjs.stakingRewards[0].name).toBeTruthy();
	});

	test('should have the right number of versions', () => {
		expect(Object.keys(snxjs.versions).length).toBe(numVersions);
	});

	test('should have the right suspension reasons', () => {
		expect(snxjs.suspensionReasons[1]).toEqual(suspensionReason);
	});

	test('should not have the wrong suspension reasons', () => {
		expect(snxjs.suspensionReasons[10000]).toBe(undefined);
	});

	test('toBytes32 is working properly', () => {
		expect(snxjs.toBytes32('SNX')).toBe(snxBytes);
	});

	test('the right defaults are available', () => {
		expect(snxjs.defaults.WAITING_PERIOD_SECS).toBe(waitingPeriodSecs);
		expect(snxjs.defaults.RANDOM_NAME).toBe(undefined);
	});

	test('the correct tokens are returned', () => {
		expect(Object.keys(snxjs.tokens).length).toBe(tokensLength);
	});

	test('the right feeds are returned', () => {
		expect(snxjs.feeds.SNX.asset).toBe('SNX');
		expect(snxjs.feeds.SOMETHING).toBe(undefined);
	});

	test('the decode method is defined', () => {
		expect(snxjs.decode).toBeTruthy();
		expect(typeof snxjs.decode).toBe('function');
	});

	test('should throw error with wrong network', () => {
		try {
			synthetix({ network: 'wrongnetwork' });
		} catch (e) {
			expect(e.message).toEqual(ERRORS.badNetworkArg);
		}
	});
});
