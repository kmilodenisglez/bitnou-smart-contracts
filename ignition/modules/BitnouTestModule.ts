import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import BitnouCoreModule from "./BitnouCoreModule.js";

/**
 * BitnouTestModule - Development/Testing deployment module
 * 
 * Extends BitnouCoreModule with test infrastructure:
 * - MockBEP20 (dummyToken): Placeholder staking token for testing
 * - BNOUPool: Fixed staking pool using dummyToken
 * - BNOUFlexiblePool: Flexible staking pool
 * 
 * This module is intended for:
 * - Local development (Hardhat network)
 * - Testnet deployments for integration testing
 * 
 * In production, replace dummyToken with the actual LP token from PancakeSwap.
 */
export default buildModule("BitnouTestModule", (m) => {
  const initializer = m.getAccount(0);

  // Import core contracts from BitnouCoreModule
  const { bitnou, bnouSafe, masterChef } = m.useModule(BitnouCoreModule);

  // 4. MockBEP20 (dummyToken) - Test staking token
  // In production, this would be the LP token from PancakeSwap (BNOU-BNB pair)
  const dummyToken = m.contract("MockBEP20", ["Dummy Token", "DUM", 1000000n * 10n ** 18n, initializer], {
    from: initializer,
    id: "DummyStakingToken",
  });

  // 5. Add pool to MasterChef (creates PID 0)
  // function add(uint256 _allocPoint, IBEP20 _lpToken, bool _isRegular, bool _withUpdate)
  const addPoolCall = m.call(masterChef, "add", [100n, dummyToken, true, true], {
    from: initializer,
    id: "AddDummyPool",
  });

  // 6. BNOUPool - Fixed staking pool
  // Constructor: (IERC20 _token, IMasterChefV2 _masterchefV2, uint256 _pid, address _initializer)
  const pid = 0n;
  const bnouPool = m.contract("BNOUPool", [dummyToken, masterChef, pid, initializer], {
    from: initializer,
    after: [addPoolCall], // Ensure pool is added before deploying
  });

  // 7. BNOUFlexiblePool - Flexible staking pool
  // Constructor: (IERC20 _token, IBnouPool _bnouPool, address _initializer)
  // Uses BitnouCoin as the staking token
  const bnouFlexiblePool = m.contract("BnouFlexiblePool", [bitnou, bnouPool, initializer], {
    from: initializer,
  });

  // Optional: Initialize BNOUPool (requires token approval)
  // Uncomment these lines to auto-initialize during deployment:
  //
  // const approveCall = m.call(dummyToken, "approve", [bnouPool, 1000000n * 10n ** 18n], {
  //   from: initializer,
  //   id: "ApproveDummyForPool",
  // });
  //
  // m.call(bnouPool, "init", [dummyToken], {
  //   from: initializer,
  //   id: "InitBnouPool",
  //   after: [approveCall],
  // });

  return { bitnou, bnouSafe, masterChef, dummyToken, bnouPool, bnouFlexiblePool };
});
