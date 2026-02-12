import { HardhatUserConfig } from 'hardhat/config'
import * as dotenv from 'dotenv'

dotenv.config()

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.15',
    settings: {
      optimizer: {
        enabled: true,
        runs: 800
      }
    }
  },
  paths: {
    sources: './contracts'
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v6'
  },
  networks: {
    hardhat: {
      type: 'edr-simulated',
      chainId: 1337,
      allowUnlimitedContractSize: true
    }
  },
  mocha: {
    timeout: 20000
  }
}

export default config
