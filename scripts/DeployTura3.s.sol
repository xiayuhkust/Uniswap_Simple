// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Factory.sol";
import "../src/UniswapV3Manager.sol";
import "../src/UniswapV3Pool.sol";

contract DeployTura3 is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Factory
        UniswapV3Factory factory = new UniswapV3Factory();
        console.log("Factory deployed at:", address(factory));

        // Deploy Manager
        UniswapV3Manager manager = new UniswapV3Manager(address(factory));
        console.log("Manager deployed at:", address(manager));

        vm.stopBroadcast();
    }
}
