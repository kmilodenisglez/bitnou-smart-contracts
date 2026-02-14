import type { HardhatUserConfig } from 'hardhat/config'
import hardhatEthersPlugin from '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-ignition-ethers'
import '@nomicfoundation/hardhat-typechain'
import '@nomicfoundation/hardhat-verify'
import * as dotenv from 'dotenv'
import etherscanConfig from './etherscan.config'

dotenv.config()

const privateKey = process.env.PRIVATE_KEY?.trim()
const accounts = privateKey ? [privateKey] : []
const bscMainnetRpcUrl = process.env.BSC_MAINNET_RPC_URL || 'https://bsc-dataseed.binance.org/'
const bscTestnetRpcUrl = process.env.BSC_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/'

const config: HardhatUserConfig = {
  plugins: [hardhatEthersPlugin],
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
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  },
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
    alwaysGenerateOverloads: false,
    dontOverrideCompile: false
  },
  networks: {
    hardhat: {
      type: 'edr-simulated',
      chainId: 1337
    },
    bsc: {
      type: 'http',
      url: bscMainnetRpcUrl,
      chainId: 56,
      accounts,
      gasPrice: 20_000_000_000
    },
    bscTestnet: {
      type: 'http',
      url: bscTestnetRpcUrl,
      chainId: 97,
      accounts,
      gasPrice: 20_000_000_000
    }
  },
  mocha: {
    timeout: 20000
  },
  ...etherscanConfig
}

export default config
