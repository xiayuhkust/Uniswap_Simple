// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Factory.sol";

contract CreatePools is Script {
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;
    address constant FACTORY = 0x15DD62f283fCE90DfF2d6718422505834c1B5115;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Create WTURA/TT1 pool (0.3% fee)
        // TT1 < WTURA, so TT1 is token0
        address pool1 = UniswapV3Factory(FACTORY).createPool(TT1, WTURA, 3000);
        console.log("WTURA/TT1 pool created at:", pool1);

        // Create WTURA/TT2 pool (0.3% fee)
        // TT2 < WTURA, so TT2 is token0
        address pool2 = UniswapV3Factory(FACTORY).createPool(TT2, WTURA, 3000);
        console.log("WTURA/TT2 pool created at:", pool2);

        // Create TT1/TT2 pool (0.3% fee)
        // TT1 < TT2, so TT1 is token0
        address pool3 = UniswapV3Factory(FACTORY).createPool(TT1, TT2, 3000);
        console.log("TT1/TT2 pool created at:", pool3);

        vm.stopBroadcast();
    }
}
