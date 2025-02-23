// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Factory.sol";

contract CreatePools2 is Script {
    address constant FACTORY = 0x7443318489164C50C22951Ad1c1a3C7e67714C5e;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get factory instance
        UniswapV3Factory factory = UniswapV3Factory(FACTORY);

        // Create WTURA/TT1 pool (0.3% fee)
        address pool1 = factory.createPool(WTURA, TT1, 3000);
        console.log("WTURA/TT1 pool created at:", pool1);

        // Create WTURA/TT2 pool (0.3% fee)
        address pool2 = factory.createPool(WTURA, TT2, 3000);
        console.log("WTURA/TT2 pool created at:", pool2);

        // Create TT1/TT2 pool (0.05% fee)
        address pool3 = factory.createPool(TT1, TT2, 500);
        console.log("TT1/TT2 pool created at:", pool3);

        vm.stopBroadcast();
    }
}
