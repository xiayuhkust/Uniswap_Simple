// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Pool.sol";
import "../src/UniswapV3Manager.sol";
import "../src/interfaces/IUniswapV3Pool.sol";
import "../src/interfaces/IUniswapV3Manager.sol";

contract AddLiquidityWTURA_TT1 is Script {
    // TT1 < WTURA, so TT1 is token0
    address constant POOL = 0x089A50C3868E1dd1FdC670CF5F1Bd5BB03AbfC1D;
    address constant MANAGER = 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Add liquidity with 1:100 ratio (WTURA:TT1)
        // Note: TT1 < WTURA, so TT1 is token0
        UniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: TT1,
                tokenB: WTURA,
                fee: 3000,
                lowerTick: -887220,  // Full range
                upperTick: 887220,   // Full range
                amount0Desired: 10000 ether, // TT1 amount (token0)
                amount1Desired: 100 ether,   // WTURA amount (token1)
                amount0Min: 0,
                amount1Min: 0
            })
        );

        // Log position details
        (uint160 sqrtPriceX96,,,,) = IUniswapV3Pool(POOL).slot0();
        console.log("Pool price after liquidity addition:");
        console.log("SqrtPriceX96:", sqrtPriceX96);

        vm.stopBroadcast();
    }


}
