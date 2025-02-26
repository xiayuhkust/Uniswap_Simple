// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../../test/ERC20Mintable.sol";

contract DeployTT4 is Script {
    function run() public {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TT4 token
        ERC20Mintable tt4 = new ERC20Mintable("Test Token 4", "TT4", 18);
        console.log("TT4 deployed at:", address(tt4));

        vm.stopBroadcast();
    }
}
