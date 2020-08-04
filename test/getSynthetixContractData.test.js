import findIndex from 'lodash/findIndex'

import getSynthetixContractData from '../src/getSynthetixContractData'
import { Networks } from '../src/types'
import { NUM_SYNTHETIX_CONTRACTS } from './constants'

describe('Checks pulling data from synthetix repo', () => {
  let contractData
  beforeAll(() => {
    contractData = getSynthetixContractData(Networks.Kovan)
  })

  test('should return the right number of contracts', () => {
    expect(contractData.length).toBe(NUM_SYNTHETIX_CONTRACTS)
  })

  test('should return the FeePool contract', () => {
    const feePoolContract = findIndex(contractData, c => c.name == 'FeePool')
    expect(feePoolContract).not.toBe(-1)
  })

  test('should not return a random contract name', () => {
    const feePoolContract = findIndex(contractData, c => c.name == 'RandomContract')
    expect(feePoolContract).toBe(-1)
  })

  test('should throw error with wrong network', () => {
    try {
      getSynthetixContractData('wrongnetwork')
    } catch (e) {
      expect(e.message).toEqual('unsupported network passed')
    }
  })
})
