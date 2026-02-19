// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/**
 * @title MockFactory
 * @dev Mock Uniswap V2 Factory for testing - creates MockPair instances
 */
contract MockFactory {
    function createPair(address, address) external returns (address pair) {
        // Note: Token parameters are intentionally unused in mock implementation
        // This matches the interface without tracking pairs
        // (Solidity convention: omit parameter names to silence unused variable warnings)
        return address(new MockPair());
    }
}

/**
 * @title MockPair
 * @dev Dummy Uniswap V2 Pair for testing
 */
contract MockPair {
    // dummy
}

/**
 * @title MockRouter
 * @dev Mock Uniswap V2 Router for testing BitnouCoin deployment
 * @notice Uses immutable variables so they're stored in bytecode, not storage.
 *         This allows the router code to be copied to a hardcoded address via setCode.
 */
contract MockRouter {
    address public immutable factory;
    address public immutable WETH;

    constructor(address _factory, address _weth) {
        factory = _factory;
        WETH = _weth;
    }
}
