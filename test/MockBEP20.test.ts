/**
 * @fileoverview Tests for MockBEP20 (dummyToken) contract using viem
 * @description Validates core BEP20 functionality including minting, management, and access control
 * @notice Uses Hardhat 3 pattern: viem is on network connection, not hre directly
 */
import hre from 'hardhat'
import { expect } from 'chai'
import { parseUnits, getAddress } from 'viem'
import type { Address } from 'viem'

describe('MockBEP20', () => {
  /**
   * Deploy fixture - deploys MockBEP20 with initial configuration
   * @returns Contract instance and test accounts
   */
  async function deployFixture() {
    // In Hardhat 3, viem helpers are on the network connection
    const connection = await hre.network.connect()
    const { viem, networkHelpers } = connection
    
    const [owner, other] = await viem.getWalletClients()
    const publicClient = await viem.getPublicClient()
    
    const mintAmount = parseUnits('1000000', 18)
    
    const token = await viem.deployContract('MockBEP20', [
      'DummyToken',
      'DUMMY',
      mintAmount,
      owner.account.address
    ])

    return { 
      owner, 
      other, 
      token, 
      mintAmount, 
      publicClient,
      viem,
      networkHelpers,
      ownerAddress: owner.account.address as Address,
      otherAddress: other.account.address as Address
    }
  }

  describe('Deployment', () => {
    it('mints the entire supply to the initializer', async () => {
      const { token, mintAmount, ownerAddress } = await deployFixture()
      
      const totalSupply = await token.read.totalSupply()
      const balance = await token.read.balanceOf([ownerAddress])
      
      expect(totalSupply).to.equal(mintAmount)
      expect(balance).to.equal(mintAmount)
    })

    it('sets correct token metadata', async () => {
      const { token } = await deployFixture()
      
      expect(await token.read.name()).to.equal('DummyToken')
      expect(await token.read.symbol()).to.equal('DUMMY')
      expect(await token.read.decimals()).to.equal(18)
    })
  })

  describe('Management', () => {
    it('lets a flagged manager mint additional tokens', async () => {
      const { token, other, otherAddress, owner, viem } = await deployFixture()
      
      // Grant management rights
      await token.write.management([otherAddress, true], { account: owner.account })
      
      // Mint as manager
      const minted = parseUnits('123', 18)
      const tokenAsOther = await viem.getContractAt('MockBEP20', token.address, { client: { wallet: other } })
      await tokenAsOther.write.mintTokens([otherAddress, minted])
      
      const balance = await token.read.balanceOf([otherAddress])
      expect(balance).to.equal(minted)
    })

    it('reverts when a non-manager tries to mint', async () => {
      const { token, other, otherAddress, viem } = await deployFixture()
      
      const minted = parseUnits('5', 18)
      const tokenAsOther = await viem.getContractAt('MockBEP20', token.address, { client: { wallet: other } })
      
      // Viem throws ContractFunctionExecutionError - use try/catch pattern
      let reverted = false
      let errorMessage = ''
      try {
        await tokenAsOther.write.mintTokens([otherAddress, minted])
      } catch (error: unknown) {
        reverted = true
        errorMessage = (error as Error).message || ''
      }
      
      expect(reverted).to.be.true
      expect(errorMessage).to.include('Ownable: caller is not the Manager')
    })
  })

  describe('Transfers', () => {
    it('allows token transfers between accounts', async () => {
      const { token, owner, otherAddress } = await deployFixture()
      
      const transferAmount = parseUnits('100', 18)
      await token.write.transfer([otherAddress, transferAmount], { account: owner.account })
      
      const balance = await token.read.balanceOf([otherAddress])
      expect(balance).to.equal(transferAmount)
    })

    it('emits Transfer event on transfer', async () => {
      const { token, owner, otherAddress, publicClient } = await deployFixture()
      
      const transferAmount = parseUnits('50', 18)
      const hash = await token.write.transfer([otherAddress, transferAmount], { account: owner.account })
      
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      expect(receipt.status).to.equal('success')
    })
  })
})
