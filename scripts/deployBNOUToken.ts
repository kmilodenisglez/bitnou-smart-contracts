/**
 * deployBNOUToken.ts
 * 
 * Information script for BNOU token deployment
 * 
 * Usage:
 *   pnpm deploy:bnou:testnet    # Deploy to BSC Testnet
 *   pnpm deploy:bnou:mainnet    # Deploy to BSC Mainnet
 * 
 * This script provides deployment information and recommends using Ignition.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

async function main() {
  console.log("\n🚀 BNOU Token Deployment Guide\n");
  console.log("=====================================\n");

  console.log("✅ Recommended: Use Hardhat Ignition (automatic)\n");
  console.log("   Command:");
  console.log("   pnpm hardhat ignition deploy ignition/modules/BNOUTokenModule.ts --network bscTestnet\n");

  console.log("   Or use npm script:");
  console.log("   pnpm ignition:bnou:testnet\n");

  console.log("📖 Token Features:\n");
  console.log("   ✓ Dynamic router selection (BSC Mainnet/Testnet, Ethereum)");
  console.log("   ✓ Anti-whale protection (adjustable limits)");
  console.log("   ✓ Trading toggle (one-way, prevents front-running)");
  console.log("   ✓ Emergency token recovery");
  console.log("   ✓ Standard ERC20 implementation\n");

  console.log("📋 Post-Deployment Steps:\n");
  console.log("   1. Enable trading (one-time):");
  console.log("      await bnou.enableTrading()\n");

  console.log("   2. Configure anti-whale limits (optional):");
  console.log("      await bnou.setMaxTransactionAmounts(maxBuy, maxSell)\n");

  console.log("   3. Exclude addresses (optional):");
  console.log("      await bnou.excludeFromMaxTransactionLimit(address, bool)\n");

  console.log("   4. Create liquidity pair on DEX");
  console.log("      PancakeSwap (BSC): BNOU-BNB");
  console.log("      Uniswap (Ethereum): BNOU-ETH\n");

  console.log("🔄 Router Addresses by Network:\n");
  console.log("   BSC Mainnet:  0x10ED43C718714eb63d5aA57B78B54704E256024E");
  console.log("   BSC Testnet:  0xD99D1c33F9fC3444f8101754aBC46c52416550D1");
  console.log("   Ethereum:     0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D\n");

  console.log("🔍 Verification Command:\n");
  console.log("   pnpm hardhat verify --network <network> <CONTRACT_ADDRESS>\n");

  console.log("📚 Documentation:");
  console.log("   See ignition/modules/BNOUTokenModule.ts for deployment details\n");

  console.log("=====================================\n");
}

main().catch(console.error);
