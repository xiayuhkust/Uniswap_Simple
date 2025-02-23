// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Pool.sol";
import "../src/UniswapV3Manager.sol";
import "../src/interfaces/IUniswapV3Pool.sol";
import "../src/interfaces/IUniswapV3Manager.sol";

contract AddLiquidityWTURA_TT2 is Script {
    // TT2 < WTURA, so TT2 is token0
    address constant POOL = 0xB8aD8416742C6B5e4D00A5e8A0cfb0129c37101f;
    address constant MANAGER = 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;
    
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Add liquidity with 1:100 ratio (WTURA:TT2)
        // Note: TT2 < WTURA, so TT2 is token0
        UniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: TT2,
                tokenB: WTURA,
                fee: 3000,
                lowerTick: -887220,  // Full range
                upperTick: 887220,   // Full range
                amount0Desired: 10000 ether, // TT2 amount (token0)
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
