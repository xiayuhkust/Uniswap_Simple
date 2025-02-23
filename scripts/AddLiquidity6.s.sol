// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IUniswapV3Pool.sol";
import "../src/interfaces/IUniswapV3Manager.sol";
import "../src/interfaces/IERC20.sol";

contract AddLiquidity6 is Script {
    address constant MANAGER = 0xeA55332dDe678746aCC684D323e357Df05B6F767;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Approve tokens
        IERC20(WTURA).approve(MANAGER, type(uint256).max);
        IERC20(TT1).approve(MANAGER, type(uint256).max);
        IERC20(TT2).approve(MANAGER, type(uint256).max);

        // Add liquidity to WTURA/TT1 pool (1:100 ratio)
        console.log("\nAdding liquidity to WTURA/TT1 pool:");
        IUniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: WTURA,
                tokenB: TT1,
                fee: 3000,
                lowerTick: -887220,  // Min tick
                upperTick: 887220,   // Max tick
                amount0Desired: 100 ether,    // WTURA amount
                amount1Desired: 10000 ether,  // TT1 amount (100x)
                amount0Min: 0,
                amount1Min: 0
            })
        );

        // Add liquidity to WTURA/TT2 pool (1:100 ratio)
        console.log("\nAdding liquidity to WTURA/TT2 pool:");
        IUniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: WTURA,
                tokenB: TT2,
                fee: 3000,
                lowerTick: -887220,
                upperTick: 887220,
                amount0Desired: 100 ether,    // WTURA amount
                amount1Desired: 10000 ether,  // TT2 amount (100x)
                amount0Min: 0,
                amount1Min: 0
            })
        );

        // Add liquidity to TT1/TT2 pool (1:1 ratio)
        console.log("\nAdding liquidity to TT1/TT2 pool:");
        IUniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: TT1,
                tokenB: TT2,
                fee: 3000,
                lowerTick: -887220,
                upperTick: 887220,
                amount0Desired: 10000 ether,  // TT1 amount
                amount1Desired: 10000 ether,  // TT2 amount (1:1)
                amount0Min: 0,
                amount1Min: 0
            })
        );

        vm.stopBroadcast();
    }
}
