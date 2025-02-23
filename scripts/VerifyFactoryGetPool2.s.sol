// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/interfaces/IUniswapV3Factory.sol";

contract VerifyFactoryGetPool2 is Script {
    address constant FACTORY = 0x55B8f604bb21767ad87DBe1ffBfec370992CD2AD;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        // Check WTURA/TT1 pool
        console.log("\nChecking WTURA/TT1 pool:");
        console.log("Token0 (TT1):", TT1);
        console.log("Token1 (WTURA):", WTURA);
        address pool1 = IUniswapV3Factory(FACTORY).getPool(TT1, WTURA, 3000);
        console.log("Pool address:", pool1);

        // Check WTURA/TT2 pool
        console.log("\nChecking WTURA/TT2 pool:");
        console.log("Token0 (TT2):", TT2);
        console.log("Token1 (WTURA):", WTURA);
        address pool2 = IUniswapV3Factory(FACTORY).getPool(TT2, WTURA, 3000);
        console.log("Pool address:", pool2);

        // Check TT1/TT2 pool
        console.log("\nChecking TT1/TT2 pool:");
        console.log("Token0 (TT1):", TT1);
        console.log("Token1 (TT2):", TT2);
        address pool3 = IUniswapV3Factory(FACTORY).getPool(TT1, TT2, 3000);
        console.log("Pool address:", pool3);
    }
}
