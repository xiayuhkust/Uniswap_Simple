// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Factory.sol";
import "../src/UniswapV3Pool.sol";
import "../src/UniswapV3Manager.sol";
import "../src/UniswapV3Quoter.sol";

contract DeployTura is Script {
    function run() public {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Factory
        UniswapV3Factory factory = new UniswapV3Factory();
        console.log("Factory deployed at:", address(factory));

        // Deploy Manager
        UniswapV3Manager manager = new UniswapV3Manager(address(factory));
        console.log("Manager deployed at:", address(manager));

        // Deploy Quoter
        UniswapV3Quoter quoter = new UniswapV3Quoter(address(factory));
        console.log("Quoter deployed at:", address(quoter));

        // Fee amounts are set in constructor
        // 500 (0.05%) -> tickSpacing 10
        // 3000 (0.3%) -> tickSpacing 60

        vm.stopBroadcast();
    }
}
