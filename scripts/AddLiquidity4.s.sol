// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Manager.sol";
import "../src/interfaces/IERC20.sol";
import "../src/interfaces/IUniswapV3Manager.sol";

interface IWETH {
    function deposit() external payable;
    function balanceOf(address) external view returns (uint256);
}

contract AddLiquidity4 is Script {
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;
    address constant MANAGER = 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // First wrap some TURA to get WTURA
        IWETH(WTURA).deposit{value: 10 ether}();
        console.log("WTURA balance:", IWETH(WTURA).balanceOf(msg.sender));

        // Approve tokens
        IERC20(WTURA).approve(MANAGER, type(uint256).max);
        IERC20(TT1).approve(MANAGER, type(uint256).max);
        IERC20(TT2).approve(MANAGER, type(uint256).max);

        // Sort tokens for WTURA/TT1 pool (1:100)
        (address token0, address token1) = WTURA < TT1 ? (WTURA, TT1) : (TT1, WTURA);
        uint256 amount0 = WTURA < TT1 ? 1 ether : 100 ether;
        uint256 amount1 = WTURA < TT1 ? 100 ether : 1 ether;

        // Add liquidity to WTURA/TT1 pool
        UniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: token0,
                tokenB: token1,
                fee: 3000,
                lowerTick: -887220,
                upperTick: 887220,
                amount0Desired: amount0,
                amount1Desired: amount1,
                amount0Min: 0,
                amount1Min: 0
            })
        );

        // Sort tokens for WTURA/TT2 pool (1:100)
        (token0, token1) = WTURA < TT2 ? (WTURA, TT2) : (TT2, WTURA);
        amount0 = WTURA < TT2 ? 1 ether : 100 ether;
        amount1 = WTURA < TT2 ? 100 ether : 1 ether;

        // Add liquidity to WTURA/TT2 pool
        UniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: token0,
                tokenB: token1,
                fee: 3000,
                lowerTick: -887220,
                upperTick: 887220,
                amount0Desired: amount0,
                amount1Desired: amount1,
                amount0Min: 0,
                amount1Min: 0
            })
        );

        // Sort tokens for TT1/TT2 pool (1:1)
        (token0, token1) = TT1 < TT2 ? (TT1, TT2) : (TT2, TT1);
        amount0 = 100 ether;
        amount1 = 100 ether;

        // Add liquidity to TT1/TT2 pool
        UniswapV3Manager(MANAGER).mint(
            IUniswapV3Manager.MintParams({
                tokenA: token0,
                tokenB: token1,
                fee: 500,
                lowerTick: -887220,
                upperTick: 887220,
                amount0Desired: amount0,
                amount1Desired: amount1,
                amount0Min: 0,
                amount1Min: 0
            })
        );

        vm.stopBroadcast();
    }
}
