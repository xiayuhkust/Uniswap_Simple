// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/interfaces/IUniswapV3Pool.sol";

contract VerifyPoolInitialization2 is Script {
    address constant WTURA_TT1_POOL = 0x2044bDb84580aD2Edd74bbCF4106FE5C9D5b50cD;
    address constant WTURA_TT2_POOL = 0xE8f68FE64dc32A1a3636Ad303fC241154a952D50;
    address constant TT1_TT2_POOL = 0x279Ec96DEeDfb667C3280021196b2b0289F9BEa9;

    function run() public view {
        // Verify WTURA/TT1 pool (1:100 ratio)
        console.log("Verifying WTURA/TT1 pool initialization:");
        (uint160 sqrtPriceX96, int24 tick,,,) = IUniswapV3Pool(WTURA_TT1_POOL).slot0();
        console.log("sqrtPriceX96: %s", uint256(sqrtPriceX96));
        console.log("tick: %s", uint256(uint24(tick)));
        console.log("Expected sqrtPriceX96: %s", uint256(79228162514264337593543950336));

        // Verify WTURA/TT2 pool (1:100 ratio)
        console.log("Verifying WTURA/TT2 pool initialization:");
        (sqrtPriceX96, tick,,,) = IUniswapV3Pool(WTURA_TT2_POOL).slot0();
        console.log("sqrtPriceX96: %s", uint256(sqrtPriceX96));
        console.log("tick: %s", uint256(uint24(tick)));
        console.log("Expected sqrtPriceX96: %s", uint256(79228162514264337593543950336));

        // Verify TT1/TT2 pool (1:1 ratio)
        console.log("Verifying TT1/TT2 pool initialization:");
        (sqrtPriceX96, tick,,,) = IUniswapV3Pool(TT1_TT2_POOL).slot0();
        console.log("sqrtPriceX96: %s", uint256(sqrtPriceX96));
        console.log("tick: %s", uint256(uint24(tick)));
        console.log("Expected sqrtPriceX96: %s", uint256(792281625142643375935439503360));
    }
}
