# Bitnou Smart Contracts

A comprehensive suite of smart contracts for the Bitnou ecosystem on Binance Smart Chain (BSC), built with Hardhat 3 and Viem.

## Table of Contents

- [Overview](#overview)
- [Contracts](#contracts)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Network Specifications](#network-specifications)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contract Verification](#contract-verification)
- [Security Considerations](#security-considerations)
- [License](#license)

## Overview

The Bitnou ecosystem consists of:
- **BNOU**: The main ERC-20 token with built-in liquidity and fee mechanisms
- **BNOUSafe**: Treasury contract for secure token management
- **MasterChef**: Staking rewards distribution contract
- **BNOUPool**: Fixed staking pool with MasterChef integration
- **BNOUFlexiblePool**: Flexible staking pool for BNOU tokens

### Project Status: ✅ PRODUCTION READY
- **Security Audit**: Completed ✅ (All issues resolved)
- **Test Suite**: 100% passing (12/12 tests) ✅
- **Smart Contract Compilation**: Clean, no warnings ✅

## Contracts

| Contract | Description |
|----------|-------------|
| `BNOU.sol` | Main ERC-20 token with auto-liquidity, staking fees, burn mechanism, and whale protection |
| `BNOU.dev.sol` | Development version (supports Hardhat chainId 31337 for local testing) |
| `BNOUSafe.sol` | Treasury safe for holding and distributing BNOU tokens |
| `MasterChef.sol` | Reward distribution system for staking pools |
| `BNOUPool.sol` | Fixed-term staking pool integrated with MasterChef |
| `BNOUFlexiblePool.sol` | Flexible staking pool without lock periods |
| `mocks/dummyToken.sol` | MockBEP20 for testing purposes (✅ Audit verified) |
| `mocks/Mocks.sol` | Mock contracts for PancakeSwap router/factory (✅ Audit verified) |

## Requirements

- Node.js v18+ (v22 recommended)
- pnpm v10+ (or npm/yarn)
- Git

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd bitnou-smart-contracts

# Install dependencies
pnpm install

# Compile contracts
pnpm compile
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# BSC RPC URLs (optional - defaults provided)
BSC_MAINNET_RPC_URL=https://bsc-dataseed.binance.org/
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/

# BscScan API key for contract verification
BSCSCAN_API_KEY=your_bscscan_api_key
```

### Solidity Configuration

- **Compiler Version**: 0.8.15
- **Optimizer**: Enabled with 800 runs
- **EVM Target**: London

## Network Specifications

### BSC Mainnet

| Parameter | Value |
|-----------|-------|
| Network Name | `bsc` |
| Chain ID | `56` |
| RPC URL | `https://bsc-dataseed.binance.org/` |
| Gas Price | `20 Gwei` |
| Block Explorer | [https://bscscan.com](https://bscscan.com) |
| PancakeSwap Router | `0x10ED43C718714eb63d5aA57B78B54704E256024E` |

**Native Token**: BNB

### BSC Testnet

| Parameter | Value |
|-----------|-------|
| Network Name | `bscTestnet` |
| Chain ID | `97` |
| RPC URL | `https://data-seed-prebsc-1-s1.binance.org:8545/` |
| Gas Price | `20 Gwei` |
| Block Explorer | [https://testnet.bscscan.com](https://testnet.bscscan.com) |
| PancakeSwap Router | `0xD99D1c33F9fC3444f8101754aBC46c52416550D1` |

**Native Token**: tBNB (Testnet BNB)

#### Testnet Faucets
- [BNB Smart Chain Faucet](https://testnet.bnbchain.org/faucet-smart)
- [Chainlink Faucet](https://faucets.chain.link/bnb-chain-testnet)

### Local Development

You have **two options** for local testing:

#### Option 1: Isolated Local Network (Faster, Simpler)

```bash
# Terminal 1: Start isolated Hardhat node
pnpm hardhat node

# Terminal 2: Deploy BNOU.dev
pnpm deploy:bnou:dev
```

**Use this for**: Unit tests, rapid development, basic contract testing

#### Option 2: Forked BSC Testnet (More Realistic)

```bash
# Terminal 1: Start Hardhat node forked from BSC Testnet
pnpm node:fork:testnet

# Terminal 2: Deploy BNOU.dev
pnpm deploy:bnou:dev
```

**Use this for**: DEX interactions, testing swaps, liquidity testing, full ecosystem testing

#### Comparison: Isolated vs. Forked

| Feature | Isolated Localnet | Forked Testnet |
|---------|-------------------|----------------|
| **Network Type** | Hardhat (CLI 31337) | BSC Testnet fork (CLI 97) |
| **Initial State** | Empty (no contracts) | Full testnet state (existing contracts + liquidity) |
| **PancakeSwap Router** | ❌ Not available | ✅ Available with real liquidity |
| **Speed** | ⚡ Ultra fast | 🔹 Slower (5-20GB download) |
| **Use Case** | Unit testing | DEX + full ecosystem testing |
| **Storage** | ~100MB | 5-20GB |
| **Gas Simulation** | Yes | Yes |

The **BNOU.dev contract** is a development version of BNOU that:
- Supports Hardhat's chain ID (31337)
- Skips pair creation on local networks (since routers don't exist)
- Identical to production BNOU otherwise

### Contracts

This project maintains **two contract versions**:

| File | Network | Use Case |
|------|---------|----------|
| `BNOU.sol` | Mainnet, Testnet, Ethereum | Production deployments |
| `BNOU.dev.sol` | Hardhat (31337) | Local development & testing |

Both compile to separate artifacts: `BNOU` and `BNOUDev` respectively.

## Scripts

| Command | Description | Status |
|---------|------------|--------|
| `pnpm compile` | Compile all Solidity contracts | ✅ Clean |
| `pnpm test` | Run Mocha test suite | ✅ 12/12 passing |
| `pnpm test:all` | Run all test runners (Mocha + Node.js) | ✅ Ready |
| `pnpm node` | Start a Hardhat node (default, isolated) | ✅ Ready |
| `pnpm node:fork:testnet` | Start a Hardhat node forked from BSC Testnet | ✅ Ready |
| `pnpm deploy:bnou:dev` | Deploy BNOU.dev to local Hardhat | ✅ Tested |
| `pnpm deploy:ignition:testnet` | Deploy BNOU (production) to BSC Testnet | ✅ Ready |
| `pnpm deploy:ignition:mainnet` | Deploy BNOU (production) to BSC Mainnet | ✅ Ready |

| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | Run TypeScript type checker |

## Testing

Tests are written using Mocha, Chai, and Viem with Hardhat 3's network helpers.

```bash
# Run all tests
pnpm test

# Run tests with verbose output
pnpm hardhat test mocha --verbosity 3

# Run specific test file
pnpm hardhat test mocha test/BitnouCoin.test.ts
```

### Test Coverage

**12/12 Tests Passing (100%)**

- **BNOU Contract Tests** (6 passing):
  -✅ Correct token name and symbol
  - ✅ Correct decimals (18)
  - ✅ Deployer ownership assignment
  - ✅ Non-zero total supply initialization
  - ✅ Router address configuration

- **MockBEP20 Tests** (6 passing):
  - ✅ Deployment and token metadata
  - ✅ Manager-based minting permissions
  - ✅ Token transfer and event emission

## Deployment

### BNOU Token (ERC20 with Anti-Whale)

The **BitnouCoreModule** deploys the complete BNOU ecosystem:
- **BNOU Token**: Standard ERC20 with dynamic router selection
  - Automatically selects router based on chainId
  - Anti-whale protection with adjustable limits
  - Fee exclusions for owner and contract
- **BNOUSafe**: Treasury contract for token management
- **MasterChef**: Staking rewards distribution system

#### Using Hardhat Ignition (Recommended)

```bash
# Deploy to BSC Testnet
pnpm deploy:ignition:testnet

# Deploy to BSC Mainnet
pnpm deploy:ignition:mainnet

# Or manually:
pnpm hardhat ignition deploy ignition/modules/BitnouCoreModule.ts --network bscTestnet
```

#### Post-Deployment Steps

After deployment with Ignition, the token is ready. Follow these steps:

```bash
# 1. Add liquidity on PancakeSwap
# Pair: BNOU + BNB in equal proportion

# 2. Deploy staking pools (BNOUPool, BNOUFlexiblePool)
# After deploying BNOU, deploy the pool contracts

# 3. Initialize pools
# Call pool.init() with the LP token address from PancakeSwap

# 4. Verify contract on BscScan
pnpm hardhat verify --network bscTestnet <CONTRACT_ADDRESS>
```



### Important Notes

⚠️ **Router Address**: BNOU has a hardcoded PancakeSwap router address that adapts based on chainId:
- **BSC Mainnet (56)**: `0x10ED43C718714eb63d5aA57B78B54704E256024E`
- **BSC Testnet (97)**: `0xD99D1c33F9fC3444f8101754aBC46c52416550D1`
- **Ethereum (1, 5)**: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`
- **Local/Hardhat (31337)**: Use BNOU.dev instead (skips router setup)

Ensure you deploy BNOU to a supported network or use BNOU.dev for local Hardhat testing.

## Contract Verification

Verify contracts on BscScan after deployment:

```bash
# Verify a contract
pnpm hardhat verify --network bscTestnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>

# Example: Verify BitnouCoin
pnpm hardhat verify --network bscTestnet 0x1234...5678 0xYourInitializerAddress
```

## Security & Quality Assurance

### Security Audit Status

✅ **Comprehensive Mocks Folder Audit Completed**
- All smart contracts verified for consistency
- No vulnerabilities found
- Mock contracts properly scoped for testing
- Full test suite passing (12/12 tests)
- Compilation clean with zero warnings

**See**: [reports/SECURITY_AUDIT_SUMMARY.md](./reports/SECURITY_AUDIT_SUMMARY.md)

### Security Considerations

1. **Private Key Security**: Never commit `.env` files or expose private keys
2. **Router Address**: Verify the PancakeSwap router address matches your target network
3. **Ownership**: BNOU transfers ownership to the deployer in the constructor
4. **Fee Exclusions**: The constructor automatically excludes owner and contract from fees
5. **Whale Protection**: Maximum transaction and wallet limits are enforced
6. **Reentrancy**: Contracts follow checks-effects-interactions pattern

### Pre-deployment Checklist

- [ ] Verify router address matches target network
- [ ] Test on testnet first
- [ ] Verify contract source code on BscScan
- [ ] Transfer ownership to multisig (recommended)
- [ ] Set up monitoring and alerts
- [ ] Document deployed addresses

## Project Structure

```
bitnou-smart-contracts/
├── contracts/           # Solidity smart contracts
│   ├── BNOU.sol                 # Production token (ERC20 with anti-whale)
│   ├── BNOU.dev.sol             # Development token (supports Hardhat chain ID 31337)
│   ├── BNOUSafe.sol             # Treasury contract
│   ├── MasterChef.sol           # Staking rewards distribution
│   ├── BNOUPool.sol             # Fixed-term staking pool
│   ├── BNOUFlexiblePool.sol     # Flexible staking pool
│   └── mocks/
│       ├── dummyToken.sol       # MockBEP20 implementation
│       └── Mocks.sol            # MockFactory, MockRouter, MockPair
├── ignition/
│   └── modules/
│       ├── BNOUDevModule.ts     # Deploy BNOU.dev to local Hardhat
│       ├── BitnouCoreModule.ts  # Deploy BNOU + BNOUSafe + MasterChef to mainnet/testnet
│       └── BitnouTestModule.ts  # Deploy full ecosystem with mocks for testing
├── test/
│   ├── BitnouCoin.test.ts       # BNOU contract integration tests
│   └── MockBEP20.test.ts        # MockBEP20 unit tests
├── reports/
│   ├── SECURITY_AUDIT_SUMMARY.md    # Security audit report
│   ├── MOCKS_AUDIT_REPORT.md        # Detailed mocks audit
│   └── ... (other reports)
├── hardhat.config.ts
├── etherscan.config.ts
├── tsconfig.json
└── package.json
```

## Tech Stack

- **Framework**: Hardhat 3.1.8
- **Language**: Solidity 0.8.15, TypeScript 5.x
- **Client Library**: Viem 2.x
- **Testing**: Mocha, Chai
- **Package Manager**: pnpm

## License

ISC

---

**Documentation**: For Spanish version, see [README.ES.md](./README.ES.md)
