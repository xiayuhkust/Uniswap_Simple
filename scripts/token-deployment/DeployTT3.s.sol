// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../../test/ERC20Mintable.sol";

contract DeployTT3 is Script {
    function run() public {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TT3 token
        ERC20Mintable tt3 = new ERC20Mintable("Test Token 3", "TT3", 18);
        console.log("TT3 deployed at:", address(tt3));

        vm.stopBroadcast();
    }
}
