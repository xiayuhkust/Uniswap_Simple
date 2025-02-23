// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Pool.sol";
import "../src/UniswapV3Manager.sol";
import "../src/interfaces/IUniswapV3Pool.sol";
import "../src/interfaces/IUniswapV3Manager.sol";

contract AddLiquidityTT1_TT2 is Script {
    address constant POOL = 0x6EFb56d87BC31598d030Ece8E2067ce5d9aE1692;
    address constant MANAGER = 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;
    
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Add liquidity with 1:1 ratio (TT1:TT2)
        // Note: TT1 < TT2, so TT1 is token0
        UniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: TT1,
                tokenB: TT2,
                fee: 500,   // 0.05%
                lowerTick: -887220,  // Full range
                upperTick: 887220,   // Full range
                amount0Desired: 100 ether, // TT1 amount (token0)
                amount1Desired: 100 ether, // TT2 amount (token1)
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
