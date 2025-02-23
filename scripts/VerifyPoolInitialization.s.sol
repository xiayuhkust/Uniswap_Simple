// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IUniswapV3Pool.sol";

contract VerifyPoolInitialization is Script {
    address constant WTURA_TT1_POOL = 0x089A50C3868E1dd1FdC670CF5F1Bd5BB03AbfC1D;
    address constant WTURA_TT2_POOL = 0xB8aD8416742C6B5e4D00A5e8A0cfb0129c37101f;

    function run() public {
        // Verify WTURA/TT1 pool
        IUniswapV3Pool pool1 = IUniswapV3Pool(WTURA_TT1_POOL);
        (uint160 sqrtPrice1,,,,) = pool1.slot0();
        console.log("\nWTURA/TT1 Pool:");
        console.log("Token0:", pool1.token0());
        console.log("Token1:", pool1.token1());
        console.log("SqrtPriceX96:", sqrtPrice1);

        // Verify WTURA/TT2 pool
        IUniswapV3Pool pool2 = IUniswapV3Pool(WTURA_TT2_POOL);
        (uint160 sqrtPrice2,,,,) = pool2.slot0();
        console.log("\nWTURA/TT2 Pool:");
        console.log("Token0:", pool2.token0());
        console.log("Token1:", pool2.token1());
        console.log("SqrtPriceX96:", sqrtPrice2);
    }
}
