import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// MasterChef constants
const START_BLOCK = 0; // Starts immediately at block 0

/**
 * BitnouCoreModule - Production deployment module
 * 
 * Deploys the core Bitnou ecosystem contracts:
 * - BitnouCoin: Main BEP-20 token with auto-liquidity and fees
 * - BNOUSafe: Treasury contract for token management
 * - MasterChef: Staking rewards distribution
 * 
 * After deployment:
 * 1. Add liquidity on PancakeSwap (BNOU + BNB)
 * 2. Get LP token address from PancakeSwap
 * 3. Call masterChef.add(allocPoint, lpTokenAddress, isRegular, withUpdate)
 * 4. Deploy BNOUPool with the LP token address
 * 5. Deploy BNOUFlexiblePool
 * 6. Call bnouPool.init(lpToken) after approving tokens
 */
export default buildModule("BitnouCoreModule", (m) => {
  const initializer = m.getAccount(0);

  // 1. BitnouCoin
  // Note: Router address is hardcoded in constructor
  // - Testnet: 0xD99D1c33F9fC3444f8101754aBC46c52416550D1
  // - Mainnet: 0x10ED43C718714eb63d5aA57B78B54704E256024E
  const bitnou = m.contract("BitnouCoin", [initializer], {
    from: initializer,
  });

  // 2. BNOUSafe - Treasury
  // Constructor: (address _bnou, address _initializer)
  const bnouSafe = m.contract("BNOUSafe", [bitnou, initializer], {
    from: initializer,
  });

  // 3. MasterChef - Staking rewards
  // Constructor: (IBEP20 _BNOU, address _bnouSafe, uint256 _startBlock, address _initializer)
  const masterChef = m.contract("MasterChef", [bitnou, bnouSafe, START_BLOCK, initializer], {
    from: initializer,
  });

  return { bitnou, bnouSafe, masterChef };
});
