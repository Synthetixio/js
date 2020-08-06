import { ethers } from 'ethers';

import { numSynthetixContracts, badContractName, validContractName } from './constants';
import SynthetixJS from '../src';
import { Networks, NetworkIds } from '../src/types';
import { Errors } from '../src/constants';

describe('@synthetixio/js tests', () => {
  let synthetix;

  beforeAll(() => {
    synthetix = SynthetixJS({ network: Networks.Kovan });
  });

  test('should return the right number of contracts', () => {
    expect(Object.keys(synthetix.contracts).length).toBe(numSynthetixContracts);
  });

  test('should return the ethers object', () => {
    expect(typeof synthetix.utils).toBe(typeof ethers.utils);
  });

  // TODO define a provider and test it works too
  test('should leave the class signer and provider undefined when not included in the constructor', () => {
    expect(typeof synthetix.provider).toBe('undefined');
    expect(typeof synthetix.signer).toBe('undefined');
  });

  test('should include the supported networks', () => {
    expect(synthetix.supportedNetworks[NetworkIds.Mainnet]).toBe(Networks.Mainnet);
    expect(synthetix.supportedNetworks[NetworkIds.Kovan]).toBe(Networks.Kovan);
    expect(synthetix.supportedNetworks[NetworkIds.Rinkeby]).not.toBe(Networks.Ropsten);
  });

  test('should return valid contracts', () => {
    const validContract = synthetix.contracts[validContractName];
    expect(validContract.name).toBe(validContractName);
  });

  test('should return an invalid contract', () => {
    const invalidContract = synthetix.contracts[badContractName];
    expect(invalidContract).toBe(undefined);
  });

  test('should throw error with wrong network', () => {
    try {
      SynthetixJS({ network: 'wrongnetwork' });
    } catch (e) {
      expect(e.message).toEqual(Errors.badNetworkArg);
    }
  });
});
