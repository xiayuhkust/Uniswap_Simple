// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/lib/PoolAddress.sol";

contract VerifyPoolAddressComputation is Script {
    address constant FACTORY = 0x55B8f604bb21767ad87DBe1ffBfec370992CD2AD;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        // Check WTURA/TT1 pool
        console.log("\nComputing WTURA/TT1 pool address:");
        console.log("Token0 (TT1):", TT1);
        console.log("Token1 (WTURA):", WTURA);
        address pool1 = PoolAddress.computeAddress(FACTORY, TT1, WTURA, 3000);
        console.log("Computed pool address:", pool1);

        // Check WTURA/TT2 pool
        console.log("\nComputing WTURA/TT2 pool address:");
        console.log("Token0 (TT2):", TT2);
        console.log("Token1 (WTURA):", WTURA);
        address pool2 = PoolAddress.computeAddress(FACTORY, TT2, WTURA, 3000);
        console.log("Computed pool address:", pool2);

        // Check TT1/TT2 pool
        console.log("\nComputing TT1/TT2 pool address:");
        console.log("Token0 (TT1):", TT1);
        console.log("Token1 (TT2):", TT2);
        address pool3 = PoolAddress.computeAddress(FACTORY, TT1, TT2, 3000);
        console.log("Computed pool address:", pool3);
    }
}
