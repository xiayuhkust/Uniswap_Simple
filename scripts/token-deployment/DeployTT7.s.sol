// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../../test/ERC20Mintable.sol";

contract DeployTT7 is Script {
    function run() public {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TT7 token
        ERC20Mintable tt7 = new ERC20Mintable("Test Token 7", "TT7", 18);
        console.log("TT7 deployed at:", address(tt7));

        vm.stopBroadcast();
    }
}
