// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IUniswapV3Pool.sol";

contract VerifyPool is Script {
    address constant WTURA_TT1_POOL = 0x089A50C3868E1dd1FdC670CF5F1Bd5BB03AbfC1D;
    address constant WTURA_TT2_POOL = 0xB8aD8416742C6B5e4D00A5e8A0cfb0129c37101f;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function verifyPool(address poolAddress, string memory poolName) internal {
        // Get pool instance
        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);

        // Verify pool exists
        uint256 poolSize;
        assembly {
            poolSize := extcodesize(poolAddress)
        }
        console.log("\nVerifying", poolName);
        console.log("Pool code size:", poolSize);
        require(poolSize > 0, "Pool not deployed");

        // Get token addresses
        address token0 = pool.token0();
        address token1 = pool.token1();
        console.log("Token0:", token0);
        console.log("Token1:", token1);

        // Get fee and tick spacing
        uint24 fee = pool.fee();
        uint24 tickSpacing = pool.tickSpacing();
        console.log("Fee:", fee);
        console.log("Tick spacing:", tickSpacing);

        // Get factory
        address factory = pool.factory();
        console.log("Factory:", factory);
    }

    function run() public {
        // Verify WTURA/TT1 pool
        verifyPool(WTURA_TT1_POOL, "WTURA/TT1 Pool");

        // Verify WTURA/TT2 pool
        verifyPool(WTURA_TT2_POOL, "WTURA/TT2 Pool");
    }
}
