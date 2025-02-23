// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Factory.sol";

contract CreatePools3 is Script {
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
        // Ensure tokens are in correct order
        (address token0, address token1) = WTURA < TT1 ? (WTURA, TT1) : (TT1, WTURA);
        address pool1 = factory.createPool(token0, token1, 3000);
        console.log("\nWTURA/TT1 pool (0.3%):");
        console.log("Token0:", token0);
        console.log("Token1:", token1);
        console.log("Pool:", pool1);

        // Create WTURA/TT2 pool (0.3% fee)
        (token0, token1) = WTURA < TT2 ? (WTURA, TT2) : (TT2, WTURA);
        address pool2 = factory.createPool(token0, token1, 3000);
        console.log("\nWTURA/TT2 pool (0.3%):");
        console.log("Token0:", token0);
        console.log("Token1:", token1);
        console.log("Pool:", pool2);

        // TT1/TT2 pool already exists at 0x6EFb56d87BC31598d030Ece8E2067ce5d9aE1692
        console.log("\nTT1/TT2 pool (0.05%) already exists at:");
        console.log("Address: 0x6EFb56d87BC31598d030Ece8E2067ce5d9aE1692");

        vm.stopBroadcast();
    }
}
