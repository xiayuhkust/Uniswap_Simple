// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IUniswapV3Factory.sol";
import "../src/interfaces/IUniswapV3Manager.sol";

contract VerifyManagerAndFactory is Script {
    address constant FACTORY = 0x55B8f604bb21767ad87DBe1ffBfec370992CD2AD;
    address constant MANAGER = 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        // Get factory instance
        IUniswapV3Factory factory = IUniswapV3Factory(FACTORY);
        IUniswapV3Manager manager = IUniswapV3Manager(MANAGER);

        // Check factory
        console.log("\nFactory verification:");
        console.log("Factory address:", address(factory));

        // Create WTURA/TT1 pool (0.3%)
        address pool1 = factory.getPool(TT1, WTURA, 3000);
        console.log("\nWTURA/TT1 pool (0.3%):");
        console.log("Address:", pool1);

        // Create WTURA/TT2 pool (0.3%)
        address pool2 = factory.getPool(TT2, WTURA, 3000);
        console.log("\nWTURA/TT2 pool (0.3%):");
        console.log("Address:", pool2);

        // Create TT1/TT2 pool (0.3%)
        address pool3 = factory.getPool(TT1, TT2, 3000);
        console.log("\nTT1/TT2 pool (0.3%):");
        console.log("Address:", pool3);
    }
}
