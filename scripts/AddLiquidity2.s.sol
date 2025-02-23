// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Manager.sol";
import "../src/interfaces/IERC20.sol";
import "../src/interfaces/IUniswapV3Manager.sol";

contract AddLiquidity2 is Script {
    address constant WTURA = 0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;
    address constant MANAGER = 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Approve tokens
        IERC20(WTURA).approve(MANAGER, type(uint256).max);
        IERC20(TT1).approve(MANAGER, type(uint256).max);
        IERC20(TT2).approve(MANAGER, type(uint256).max);

        // Add liquidity to WTURA/TT1 pool (1:100)
        UniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: WTURA,
                tokenB: TT1,
                fee: 3000,
                lowerTick: -887220,
                upperTick: 887220,
                amount0Desired: 1 ether,
                amount1Desired: 100 ether,
                amount0Min: 0,
                amount1Min: 0
            })
        );

        // Add liquidity to WTURA/TT2 pool (1:100)
        UniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: WTURA,
                tokenB: TT2,
                fee: 3000,
                lowerTick: -887220,
                upperTick: 887220,
                amount0Desired: 1 ether,
                amount1Desired: 100 ether,
                amount0Min: 0,
                amount1Min: 0
            })
        );

        // Add liquidity to TT1/TT2 pool (1:1)
        UniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: TT1,
                tokenB: TT2,
                fee: 500,
                lowerTick: -887220,
                upperTick: 887220,
                amount0Desired: 100 ether,
                amount1Desired: 100 ether,
                amount0Min: 0,
                amount1Min: 0
            })
        );

        vm.stopBroadcast();
    }
}
