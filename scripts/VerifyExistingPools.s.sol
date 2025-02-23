// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/interfaces/IUniswapV3Factory.sol";

contract VerifyExistingPools is Script {
    address constant FACTORY = 0x38776e4492e63062255C96205038952E815ab56b;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        IUniswapV3Factory factory = IUniswapV3Factory(FACTORY);

        // Verify WTURA/TT1 pool
        console.log("\nVerifying WTURA/TT1 pool:");
        address pool1 = factory.getPool(TT1, WTURA, 3000);
        console.log("Pool address:", pool1);

        // Verify WTURA/TT2 pool
        console.log("\nVerifying WTURA/TT2 pool:");
        address pool2 = factory.getPool(TT2, WTURA, 3000);
        console.log("Pool address:", pool2);

        // Verify TT1/TT2 pool
        console.log("\nVerifying TT1/TT2 pool:");
        address pool3 = factory.getPool(TT1, TT2, 3000);
        console.log("Pool address:", pool3);
    }
}
