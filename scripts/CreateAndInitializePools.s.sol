// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IUniswapV3Factory.sol";
import "../src/interfaces/IUniswapV3Pool.sol";

contract CreateAndInitializePools is Script {
    address constant FACTORY = 0x7443318489164C50C22951Ad1c1a3C7e67714C5e;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        IUniswapV3Factory factory = IUniswapV3Factory(FACTORY);

        // Create WTURA/TT1 pool (0.3%)
        address pool1 = factory.createPool(WTURA, TT1, 3000);
        console.log("\nCreated WTURA/TT1 pool (0.3%):");
        console.log("Address:", pool1);

        // Create WTURA/TT2 pool (0.3%)
        address pool2 = factory.createPool(WTURA, TT2, 3000);
        console.log("\nCreated WTURA/TT2 pool (0.3%):");
        console.log("Address:", pool2);

        // Create TT1/TT2 pool (0.3%)
        address pool3 = factory.createPool(TT1, TT2, 3000);
        console.log("\nCreated TT1/TT2 pool (0.3%):");
        console.log("Address:", pool3);

        // Initialize pools with correct sqrt prices
        // For 1:100 ratio: sqrt(1/100) * 2^96
        uint160 sqrtPriceX96_1_100 = 79228162514264337593543950336;
        // For 1:1 ratio: sqrt(1) * 2^96
        uint160 sqrtPriceX96_1_1 = 792281625142643375935439503360;

        IUniswapV3Pool(pool1).initialize(sqrtPriceX96_1_100);
        IUniswapV3Pool(pool2).initialize(sqrtPriceX96_1_100);
        IUniswapV3Pool(pool3).initialize(sqrtPriceX96_1_1);

        vm.stopBroadcast();
    }
}
