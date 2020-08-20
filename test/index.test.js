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
} from './constants';
import synthetix from '../src';
import { Networks, NetworkIds } from '../src/types';
import { ERRORS } from '../src/constants';

describe('@synthetixio/js tests', () => {
	let snxjs;

	beforeAll(() => {
		snxjs = synthetix({ network: Networks.Kovan });
	});

	test('should return the right number of contracts', () => {
		expect(Object.keys(snxjs.targets).length).toBe(numSynthetixContracts);
	});

	test('should return the ethers object', () => {
		expect(typeof snxjs.utils).toBe(typeof ethers.utils);
	});

	test('should include the supported networks', () => {
		expect(snxjs.supportedNetworks[NetworkIds.Mainnet]).toBe(Networks.Mainnet);
		expect(snxjs.supportedNetworks[NetworkIds.Kovan]).toBe(Networks.Kovan);
		expect(snxjs.supportedNetworks[NetworkIds.Rinkeby]).not.toBe(Networks.Ropsten);
	});

	test('should include the current network', () => {
		expect(snxjs.currentNetwork).toBe(Networks.Kovan);
	});

	test('should return the right number of users', () => {
		expect(snxjs.users.length).toBe(numUsers);
	});

	test('should return valid contracts', () => {
		const validContract = snxjs[validContractName];
		expect(validContract).not.toBe(undefined);
	});

	test('should not return an invalid contract', () => {
		const invalidContract = snxjs[badContractName];
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
		const mainnetSnxjs = synthetix({ network: Networks.Mainnet });
		console.log(mainnetSnxjs.stakingRewards);
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

	test('should throw error with wrong network', () => {
		try {
			synthetix({ network: 'wrongnetwork' });
		} catch (e) {
			expect(e.message).toEqual(ERRORS.badNetworkArg);
		}
	});
});
