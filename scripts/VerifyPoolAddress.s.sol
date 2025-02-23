// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IUniswapV3Factory.sol";
import "../src/lib/PoolAddress.sol";

contract VerifyPoolAddress is Script {
    address constant FACTORY = 0x7443318489164C50C22951Ad1c1a3C7e67714C5e;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        // Check WTURA/TT1 pool
        address computedPool1 = PoolAddress.computeAddress(FACTORY, TT1, WTURA, 3000);
        address actualPool1 = 0x089A50C3868E1dd1FdC670CF5F1Bd5BB03AbfC1D;
        console.log("\nWTURA/TT1 pool (0.3%):");
        console.log("Computed:", computedPool1);
        console.log("Actual:", actualPool1);

        // Check WTURA/TT2 pool
        address computedPool2 = PoolAddress.computeAddress(FACTORY, TT2, WTURA, 3000);
        address actualPool2 = 0xB8aD8416742C6B5e4D00A5e8A0cfb0129c37101f;
        console.log("\nWTURA/TT2 pool (0.3%):");
        console.log("Computed:", computedPool2);
        console.log("Actual:", actualPool2);
    }
}
