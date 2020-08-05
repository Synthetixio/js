import { createContractInstance } from '../src/createContractInstance';
import { randomContract } from './mockData';

describe('Checks creating new contract instances using ethers', function () {
  let noProviderContract;
  beforeAll(() => {
    noProviderContract = createContractInstance(randomContract.address, randomContract.abi);
  });

  test('works properly on the random test contract', function () {
    expect(typeof noProviderContract.get_dy_underlying).toBe('function');
  });

  test('does not return methods that are undefined', function () {
    expect(typeof noProviderContract.method_not_included).toBe('undefined');
  });
});
