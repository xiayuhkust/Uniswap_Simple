// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/interfaces/IUniswapV3Manager.sol";
import "../src/interfaces/IUniswapV3Pool.sol";
import "../src/lib/LiquidityMath.sol";
import "../src/lib/TickMath.sol";
import "../src/interfaces/IERC20.sol";

interface IUniswapV3MintCallback {
    function uniswapV3MintCallback(
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external;
}

contract AddLiquidity5 is Script, IUniswapV3MintCallback {
    function uniswapV3MintCallback(
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external {
        (address token0, address token1) = abi.decode(data, (address, address));
        
        if (amount0 > 0) {
            console.log("Transferring token0:", amount0);
            IERC20(token0).transferFrom(msg.sender, address(this), amount0);
            IERC20(token0).transfer(msg.sender, amount0);
        }
        if (amount1 > 0) {
            console.log("Transferring token1:", amount1);
            IERC20(token1).transferFrom(msg.sender, address(this), amount1);
            IERC20(token1).transfer(msg.sender, amount1);
        }
    }
    address constant MANAGER = 0xF7d3b6638416C67B7F42e58A6cFB15B048A26112;
    address constant WTURA_TT1_POOL = 0x39b9f5DedeF10dB30117d405BAAE73BED4A3Ac40;
    address constant WTURA_TT2_POOL = 0xe3624a6986D539FDfc5D72b0AA54b810762900F9;
    address constant TT1_TT2_POOL = 0x90398935386F7917a472a6F3177Eb24A689aDc03;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Approve tokens for pools
        IERC20(WTURA).approve(WTURA_TT1_POOL, type(uint256).max);
        IERC20(WTURA).approve(WTURA_TT2_POOL, type(uint256).max);
        IERC20(TT1).approve(WTURA_TT1_POOL, type(uint256).max);
        IERC20(TT1).approve(TT1_TT2_POOL, type(uint256).max);
        IERC20(TT2).approve(WTURA_TT2_POOL, type(uint256).max);
        IERC20(TT2).approve(TT1_TT2_POOL, type(uint256).max);

        // Add liquidity to WTURA/TT1 pool (1:100)
        // TT1 < WTURA, so TT1 is token0
        console.log("\nAdding liquidity to WTURA/TT1 pool (1:100):");
        console.log("Pool address:", WTURA_TT1_POOL);
        uint128 liquidity = uint128(LiquidityMath.getLiquidityForAmounts(
            TickMath.getSqrtRatioAtTick(-887220),
            TickMath.getSqrtRatioAtTick(887220),
            79228162514264337593543950336, // sqrt(1/100) * 2^96
            10000 ether, // TT1 amount (token0)
            100 ether    // WTURA amount (token1)
        ));
        console.log("Calculated liquidity:", liquidity);
        IUniswapV3Pool(WTURA_TT1_POOL).mint(
            address(this),
            -887220,
            887220,
            liquidity,
            abi.encode(TT1, WTURA)
        );

        // Add liquidity to WTURA/TT2 pool (1:100)
        // TT2 < WTURA, so TT2 is token0
        console.log("\nAdding liquidity to WTURA/TT2 pool (1:100):");
        console.log("Pool address:", WTURA_TT2_POOL);
        liquidity = uint128(LiquidityMath.getLiquidityForAmounts(
            TickMath.getSqrtRatioAtTick(-887220),
            TickMath.getSqrtRatioAtTick(887220),
            79228162514264337593543950336, // sqrt(1/100) * 2^96
            10000 ether, // TT2 amount (token0)
            100 ether    // WTURA amount (token1)
        ));
        console.log("Calculated liquidity:", liquidity);
        IUniswapV3Pool(WTURA_TT2_POOL).mint(
            address(this),
            -887220,
            887220,
            liquidity,
            abi.encode(TT2, WTURA)
        );

        // Add liquidity to TT1/TT2 pool (1:1)
        // TT1 < TT2, so TT1 is token0
        console.log("\nAdding liquidity to TT1/TT2 pool (1:1):");
        console.log("Pool address:", TT1_TT2_POOL);
        liquidity = uint128(LiquidityMath.getLiquidityForAmounts(
            TickMath.getSqrtRatioAtTick(-887220),
            TickMath.getSqrtRatioAtTick(887220),
            792281625142643375935439503360, // sqrt(1) * 2^96
            100 ether, // TT1 amount (token0)
            100 ether  // TT2 amount (token1)
        ));
        console.log("Calculated liquidity:", liquidity);
        IUniswapV3Pool(TT1_TT2_POOL).mint(
            address(this),
            -887220,
            887220,
            liquidity,
            abi.encode(TT1, TT2)
        );

        vm.stopBroadcast();
    }
}
