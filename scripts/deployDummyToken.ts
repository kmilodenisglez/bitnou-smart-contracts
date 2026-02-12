import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying MockBEP20 with account:', deployer.address)

  const MockBEP20 = await ethers.getContractFactory('MockBEP20')
  const dummy = await MockBEP20.deploy('DummyToken', 'DUMMY', ethers.parseUnits('1000000', 18), deployer.address)
  await dummy.waitForDeployment()

  console.log('MockBEP20 deployed at', dummy.target)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
