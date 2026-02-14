import type { HardhatUserConfig } from 'hardhat/config'
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem'
import hardhatMochaPlugin from '@nomicfoundation/hardhat-mocha'

// import '@nomicfoundation/hardhat-ignition-ethers'
import '@nomicfoundation/hardhat-verify'
import * as dotenv from 'dotenv'
import etherscanConfig from './etherscan.config.js'

dotenv.config()

const privateKey = process.env.PRIVATE_KEY?.trim()
const accounts = privateKey ? [privateKey] : []
const bscMainnetRpcUrl = process.env.BSC_MAINNET_RPC_URL || 'https://bsc-dataseed.binance.org/'
const bscTestnetRpcUrl = process.env.BSC_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/'

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin, hardhatMochaPlugin],
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
  ...etherscanConfig
}

export default config
