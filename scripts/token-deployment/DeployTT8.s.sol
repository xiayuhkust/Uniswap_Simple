// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../../test/ERC20Mintable.sol";

contract DeployTT8 is Script {
    function run() public {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TT8 token
        ERC20Mintable tt8 = new ERC20Mintable("Test Token 8", "TT8", 18);
        console.log("TT8 deployed at:", address(tt8));

        vm.stopBroadcast();
    }
}
