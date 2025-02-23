// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Factory.sol";

contract VerifyPoolsFromFactory is Script {
    address constant FACTORY = 0x7443318489164C50C22951Ad1c1a3C7e67714C5e;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        // Get factory instance
        UniswapV3Factory factory = UniswapV3Factory(FACTORY);

        // Check WTURA/TT1 pool
        address pool1 = factory.getPool(WTURA, TT1, 3000);
        console.log("\nWTURA/TT1 pool (0.3%):");
        console.log("Address:", pool1);

        // Check WTURA/TT2 pool
        address pool2 = factory.getPool(WTURA, TT2, 3000);
        console.log("\nWTURA/TT2 pool (0.3%):");
        console.log("Address:", pool2);

        // Check TT1/TT2 pool
        address pool3 = factory.getPool(TT1, TT2, 500);
        console.log("\nTT1/TT2 pool (0.05%):");
        console.log("Address:", pool3);
    }
}
