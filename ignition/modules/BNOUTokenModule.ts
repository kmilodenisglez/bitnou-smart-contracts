import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * BNOUTokenModule - BNOU Token Deployment Module
 * 
 * Deploys the BNOU token contract (ERC20 with anti-whale protection and emergency recovery).
 * 
 * Contract Features:
 * - Standard ERC20 implementation
 * - Dynamic router selection based on chain ID (BSC Mainnet/Testnet, Ethereum)
 * - Anti-whale protection with adjustable transaction limits
 * - One-way trading toggle to prevent launch front-running
 * - Emergency token recovery function
 * - No transaction fees (simple transfers)
 * 
 * Usage:
 * 
 * Deploy to BSC Testnet:
 *   pnpm hardhat ignition deploy ignition/modules/BNOUTokenModule.ts --network bscTestnet
 * 
 * Deploy to BSC Mainnet:
 *   pnpm hardhat ignition deploy ignition/modules/BNOUTokenModule.ts --network bsc
 * 
 * Deploy to Ethereum Testnet (Sepolia):
 *   pnpm hardhat ignition deploy ignition/modules/BNOUTokenModule.ts --network sepolia
 * 
 * Post-Deployment Steps:
 * 1. Enable trading: call enableTrading() on the deployed token
 * 2. Optional: Adjust anti-whale limits via setMaxTransactionAmounts()
 * 3. Optional: Exclude addresses from limits via excludeFromMaxTransactionLimit()
 * 4. Create liquidity pair on DEX (PancakeSwap for BSC, Uniswap for Ethereum)
 */
export default buildModule("BNOUTokenModule", (m) => {
  // Deploy BNOU token
  // Constructor takes no arguments - router is selected dynamically based on block.chainid
  const bnou = m.contract("BNOU", []);

  return { bnou };
});
