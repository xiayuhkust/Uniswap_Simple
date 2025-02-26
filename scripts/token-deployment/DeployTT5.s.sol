// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../../test/ERC20Mintable.sol";

contract DeployTT5 is Script {
    function run() public {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TT5 token
        ERC20Mintable tt5 = new ERC20Mintable("Test Token 5", "TT5", 18);
        console.log("TT5 deployed at:", address(tt5));

        vm.stopBroadcast();
    }
}
