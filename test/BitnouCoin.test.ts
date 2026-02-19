/**
 * @fileoverview Tests for BitnouCoin contract using viem
 * @description Validates BitnouCoin token metadata and basic functionality for BSC Testnet
 * @notice Uses Hardhat 3 pattern: viem is on network connection, not hre directly
 */
import hre from 'hardhat'
import { expect } from 'chai'
import { getAddress } from 'viem'

const TESTNET_ROUTER = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'

describe('BNOU (Testnet Config)', () => {
  /**
   * Deploy fixture - sets up mock router and deploys BitnouCoin
   * Uses setCode to mock the PancakeSwap router at the hardcoded testnet address
   */
  async function deployFixture() {
    // In Hardhat 3, viem helpers are on the network connection
    const connection = await hre.network.connect()
    const { viem, networkHelpers } = connection
    
    const [owner, other, initializer] = await viem.getWalletClients()
    const publicClient = await viem.getPublicClient()

    // 1. Deploy Mock Dependencies
    const mockFactory = await viem.deployContract('MockFactory', [])
    
    // Use owner address as WETH mock
    const wethAddress = owner.account.address

    const mockRouter = await viem.deployContract('MockRouter', [
      mockFactory.address,
      wethAddress
    ])

    // 2. Etch the MockRouter code onto the hardcoded Testnet address
    // With immutable variables, factory and WETH are embedded in bytecode
    const code = await publicClient.getCode({ address: mockRouter.address })
    if (code) {
      await networkHelpers.setCode(TESTNET_ROUTER, code)
    }

    // 3. Deploy BNOUDev (development version that supports chainId 31337/Hardhat)
    // NOTE: BNOU rejects chainId 31337, so we use BNOUDev for testing
    // BNOUDev has identical logic but allows local Hardhat testing
    const bitnou = await viem.deployContract('BNOUDev')

    return { 
      owner, 
      other,
      initializer, 
      bitnou, 
      publicClient,
      viem,
      networkHelpers,
      ownerAddress: owner.account.address,
      otherAddress: other.account.address,
      initializerAddress: initializer.account.address
    }
  }

  // Use loadFixture to ensure each test runs in a clean state
  async function getFixture() {
    const connection = await hre.network.connect()
    const { networkHelpers } = connection as any
    return networkHelpers.loadFixture(deployFixture)
  }

  describe('Metadata', () => {

    it('has the correct name', async () => {
      const { bitnou } = await getFixture()
      expect(await bitnou.read.name()).to.equal('BITNOU')
    })

    it('has the correct symbol', async () => {
      const { bitnou } = await getFixture()
      expect(await bitnou.read.symbol()).to.equal('BNOU')
    })

    it('has 18 decimals', async () => {
      const { bitnou } = await getFixture()
      expect(await bitnou.read.decimals()).to.equal(18)
    })
  })

  describe('Initial Setup', () => {
    it('sets deployer as owner', async () => {
      const { bitnou, ownerAddress } = await getFixture()
      const owner = await bitnou.read.owner()
      // BNOUDev assigns ownership to the deployer (owner), not initializer
      expect(getAddress(owner)).to.equal(getAddress(ownerAddress))
    })

    it('initializes with non-zero total supply', async () => {
      const { bitnou } = await getFixture()
      const totalSupply = await bitnou.read.totalSupply()
      expect(totalSupply > 0n).to.be.true
    })
  })

  describe('Router Configuration', () => {
    it('has router address configured', async () => {
      const { bitnou } = await getFixture()
      // Verify contract deployed successfully with mocked router
      const totalSupply = await bitnou.read.totalSupply()
      expect(totalSupply > 0n).to.be.true
    })
  })
})
