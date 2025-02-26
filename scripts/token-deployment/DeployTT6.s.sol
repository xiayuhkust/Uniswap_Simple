// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../../test/ERC20Mintable.sol";

contract DeployTT6 is Script {
    function run() public {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TT6 token
        ERC20Mintable tt6 = new ERC20Mintable("Test Token 6", "TT6", 18);
        console.log("TT6 deployed at:", address(tt6));

        vm.stopBroadcast();
    }
}
