import hre from 'hardhat'
import { parseUnits } from 'viem'

async function main() {
  const connection = await hre.network.connect()
  const { viem } = connection as { viem: typeof connection.viem }

  const [deployer] = await viem.getWalletClients()

  console.log('Deploying MockBEP20 with account:', deployer.account.address)

  const dummy = await viem.deployContract('MockBEP20', [
    'DummyToken',
    'DUMMY',
    parseUnits('1000000', 18),
    deployer.account.address
  ])

  console.log('MockBEP20 deployed at', dummy.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
