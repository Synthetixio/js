import findIndex from 'lodash/findIndex'
import { Networks, EthereumLibraries } from '../src/types'
import getSynthetixObject from '../src'
import { NUM_SYNTHETIX_CONTRACTS } from './constants'

describe('Checks main method is returning correct data with ethers included', function () {
  let synthetixObject
  beforeAll(() => {
    synthetixObject = getSynthetixObject({ network: Networks.Kovan, library: EthereumLibraries.Ethers })
  })

  test('should return the right number of contracts', function () {
    expect(synthetixObject.synthetixContracts.length).toBe(NUM_SYNTHETIX_CONTRACTS)
  })

  test('should return the ethers object', function () {
    expect(typeof synthetixObject.ethers).toBe('object')
  })
})
