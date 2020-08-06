import { ethers } from 'ethers';
import findIndex from 'lodash/findIndex';

import { numSynthetixContracts, badContractName, validContractName } from './constants';
import SynthetixJS from '../src';
import { Networks, NetworkIds } from '../src/types';
import { Errors } from '../src/constants';

describe('@synthetixio/js tests', () => {
  let synthetix;

  beforeAll(() => {
    synthetix = new SynthetixJS({ network: Networks.Kovan });
  });

  test('should return the right number of contracts', () => {
    expect(Object.keys(synthetix.contracts).length).toBe(numSynthetixContracts);
  });

  test('should return the ethers object', () => {
    expect(typeof SynthetixJS.utils).toBe(typeof ethers.utils);
  });

  // TODO define a provider and test it works too
  test('should leave the class signer and provider undefined when not included in the constructor', () => {
    expect(typeof synthetix.provider).toBe('undefined');
    expect(typeof synthetix.signer).toBe('undefined');
  });

  test('should include the supported networks', () => {
    const supportedNetworks = SynthetixJS.supportedNetworks;
    expect(supportedNetworks[NetworkIds.Mainnet]).toBe(Networks.Mainnet);
    expect(supportedNetworks[NetworkIds.Kovan]).toBe(Networks.Kovan);
    expect(supportedNetworks[NetworkIds.Rinkeby]).not.toBe(Networks.Ropsten);
  });

  test('should return the right number of contracts in the data key', () => {
    expect(synthetix.contractsData.length).toBe(numSynthetixContracts);
  });

  test('should return a valid contract', () => {
    const validContract = findIndex(synthetix.contractsData, c => c.name == validContractName);
    expect(validContract).not.toBe(-1);
    const validContractTwo = findIndex(synthetix.contracts, c => c[validContractName]);
    expect(validContractTwo).not.toBe(-1);
  });

  test('should return an invalid contract', () => {
    const invalidContract = findIndex(synthetix.contractsData, c => c.name == badContractName);
    expect(invalidContract).toBe(-1);
    const invalidContractTwo = findIndex(synthetix.contracts, c => c[badContractName]);
    expect(invalidContractTwo).toBe(-1);
  });

  test('should throw error with wrong network', () => {
    try {
      new SynthetixJS({ network: 'wrongnetwork' });
    } catch (e) {
      expect(e.message).toEqual(Errors.badNetworkArg);
    }
  });

  test('should pull all the contract names', () => {
    expect(synthetix.contractNames.includes(validContractName)).toBeTruthy();
    expect(synthetix.contractNames.includes(badContractName)).toBeFalsy();
  });

  test('should get address by contract name and vice versa', () => {
    const validAddress = synthetix.getAddressByContractName(validContractName);
    expect(validAddress.startsWith('0x')).toBeTruthy();
    expect(synthetix.getContractNameByAddress(validAddress)).toEqual(validContractName);
    expect(synthetix.getAddressByContractName(badContractName)).toEqual(Errors.noMatch('name', badContractName));
  });
});
