// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Pool.sol";
import "../src/lib/TickMath.sol";

contract InitializeWTURA_TT1_Pool4 is Script {
    address constant WTURA_TT1_POOL = 0x089A50C3868E1dd1FdC670CF5F1Bd5BB03AbfC1D;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get pool instance
        UniswapV3Pool pool = UniswapV3Pool(WTURA_TT1_POOL);

        // Get token order
        address token0 = pool.token0();
        address token1 = pool.token1();
        console.log("Token0:", token0);
        console.log("Token1:", token1);

        // Calculate initial sqrt price for 1:100 ratio
        // If WTURA is token0: sqrt(1/100) * 2^96
        // If WTURA is token1: sqrt(100) * 2^96
        uint160 sqrtPriceX96 = token0 == WTURA ? 
            79228162514264337593543950336 :  // sqrt(1/100) * 2^96
            792281625142643375935439503360;  // sqrt(100) * 2^96

        // Initialize pool
        pool.initialize(sqrtPriceX96);
        console.log("Initialized WTURA/TT1 pool with sqrtPriceX96:", sqrtPriceX96);

        vm.stopBroadcast();
    }
}
