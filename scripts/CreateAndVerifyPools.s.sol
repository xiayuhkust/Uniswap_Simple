// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/interfaces/IUniswapV3Factory.sol";

contract CreateAndVerifyPools is Script {
    address constant FACTORY = 0x38776e4492e63062255C96205038952E815ab56b;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        IUniswapV3Factory factory = IUniswapV3Factory(FACTORY);

        // Create WTURA/TT1 pool
        console.log("\nCreating WTURA/TT1 pool:");
        address pool1 = factory.createPool(TT1, WTURA, 3000);
        console.log("Created pool at:", pool1);
        address existingPool1 = factory.getPool(TT1, WTURA, 3000);
        console.log("Verified pool address:", existingPool1);

        // Create WTURA/TT2 pool
        console.log("\nCreating WTURA/TT2 pool:");
        address pool2 = factory.createPool(TT2, WTURA, 3000);
        console.log("Created pool at:", pool2);
        address existingPool2 = factory.getPool(TT2, WTURA, 3000);
        console.log("Verified pool address:", existingPool2);

        // Create TT1/TT2 pool
        console.log("\nCreating TT1/TT2 pool:");
        address pool3 = factory.createPool(TT1, TT2, 3000);
        console.log("Created pool at:", pool3);
        address existingPool3 = factory.getPool(TT1, TT2, 3000);
        console.log("Verified pool address:", existingPool3);

        vm.stopBroadcast();
    }
}
