import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('MockBEP20', () => {
  async function deployFixture() {
    const [owner, other] = await ethers.getSigners()
    const mintAmount = ethers.parseUnits('1000000', 18)
    const MockBEP20 = await ethers.getContractFactory('MockBEP20')
    const token = await MockBEP20.deploy('DummyToken', 'DUMMY', mintAmount, owner.address)
    await token.waitForDeployment()
    return { owner, other, token, mintAmount }
  }

  it('mints the entire supply to the initializer', async () => {
    const { owner, token, mintAmount } = await loadFixture(deployFixture)
    expect(await token.totalSupply()).to.equal(mintAmount)
    expect(await token.balanceOf(owner.address)).to.equal(mintAmount)
  })

  it('lets a flagged manager mint additional tokens', async () => {
    const { other, token } = await loadFixture(deployFixture)
    await token.management(other.address, true)
    const minted = ethers.parseUnits('123', 18)
    await token.connect(other).mintTokens(other.address, minted)
    expect(await token.balanceOf(other.address)).to.equal(minted)
  })

  it('reverts when a non-manager tries to mint', async () => {
    const { other, token } = await loadFixture(deployFixture)
    const minted = ethers.parseUnits('5', 18)
    await expect(token.connect(other).mintTokens(other.address, minted)).to.be.revertedWith(
      'Ownable: caller is not the Manager'
    )
  })
})
