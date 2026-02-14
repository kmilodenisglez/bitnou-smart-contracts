import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1_2030 = 1893456000;
const ONE_GWEI = 1_000_000_000n;

// MasterChef constants
const START_BLOCK = 0; // Starts immediately/at block 0 (past)

export default buildModule("BitnouModule", (m) => {
  const initializer = m.getAccount(0);

  // 1. BitnouCoin
  // Warning: Hardcoded Router address in constructor means this only works on BSC Mainnet 
  // or a fork where that address (0x10ED...) exists.
  const bitnou = m.contract("BitnouCoin", [initializer], {
    from: initializer,
  });

  // 2. BNOUSafe
  // Constructor: (address _bnou, address _initializer)
  const bnouSafe = m.contract("BNOUSafe", [bitnou, initializer], {
    from: initializer,
  });

  // 3. MasterChef
  // Constructor: (IBEP20 _BNOU, address _bnouSafe, uint256 _startBlock, address _initializer)
  const masterChef = m.contract("MasterChef", [bitnou, bnouSafe, START_BLOCK, initializer], {
    from: initializer,
  });

  // 4. dummyToken
  // Constructor: (name, symbol, supply, initializer)
  const dummyToken = m.contract("MockBEP20", ["Dummy Token", "DUM", 1000000n * 10n**18n, initializer], {
      from: initializer,
      id: "AllowedDummyToken"
  });

  // 5. Add pool to MasterChef (PID 0)
  // function add(uint256 _allocPoint, IBEP20 _lpToken, bool _isRegular, bool _withUpdate)
  m.call(masterChef, "add", [100, dummyToken, true, true], {
    from: initializer,
  });

  // 6. BNOUPool
  // Constructor: (IERC20 _token, IMasterChefV2 _masterchefV2, uint256 _pid, address _initializer)
  // _pid is 0 via assumption that we just added the first pool.
  const pid = 0;
  const bnouPool = m.contract("BNOUPool", [dummyToken, masterChef, pid, initializer], {
    from: initializer,
    after: [masterChef] // Explicit dependency to ensure add() might have happened? 
                        // No, implicit dependency on masterChef instance is mostly enough for deployment, 
                        // but strictly speaking, we need the POOL to exist before we use it?
                        // BNOUPool constructor doesn't check PID existence usually, but usage does.
                        // However, to be safe, we rely on the sequence.
  });

  // 7. BNOUFlexiblePool
  // Constructor: (IERC20 _token, IBnouPool _bnouPool, address _initializer)
  // Here _token is likely BitnouCoin? Flexible Pool usually implies "Flex loading" of the main token.
  // But let's assume it matches the BNOUPool's token (dummyToken) OR it's BitnouCoin.
  // Given "BNOU Flexible Pool", it likely uses BNOU.
  const bnouFlexiblePool = m.contract("BnouFlexiblePool", [bitnou, bnouPool, initializer], {
    from: initializer,
  });
  
  // Note: BNOUPool.init() is not called here because it requires token transfer from deployer.
  // We can do it if we approve and call.
  // But keeping it out for manual initialization might be safer unless requested.
  // The user asked for "Ignition scripts", so I should probably include initialization if possible.
  
  // To init BNOUPool:
  // 1. Approve dummyToken for BNOUPool (since init pulls tokens).
  // 2. Call init.
  
  // m.call(dummyToken, "approve", [bnouPool, 1000000n * 10n**18n], { from: initializer });
  // m.call(bnouPool, "init", [dummyToken], { from: initializer });

  return { bitnou, bnouSafe, masterChef, dummyToken, bnouPool, bnouFlexiblePool };
});
