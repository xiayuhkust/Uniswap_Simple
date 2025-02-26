// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../../test/ERC20Mintable.sol";

contract MintTestTokens3to8 is Script {
    // Replace these with the actual deployed addresses after deployment
    address constant TT3 = 0x0000000000000000000000000000000000000000; // To be updated
    address constant TT4 = 0x0000000000000000000000000000000000000000; // To be updated
    address constant TT5 = 0x0000000000000000000000000000000000000000; // To be updated
    address constant TT6 = 0x0000000000000000000000000000000000000000; // To be updated
    address constant TT7 = 0x0000000000000000000000000000000000000000; // To be updated
    address constant TT8 = 0x0000000000000000000000000000000000000000; // To be updated

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // Mint 1,000,000 tokens to the owner's address for each token
        ERC20Mintable(TT3).mint(owner, 1000000 ether);
        ERC20Mintable(TT4).mint(owner, 1000000 ether);
        ERC20Mintable(TT5).mint(owner, 1000000 ether);
        ERC20Mintable(TT6).mint(owner, 1000000 ether);
        ERC20Mintable(TT7).mint(owner, 1000000 ether);
        ERC20Mintable(TT8).mint(owner, 1000000 ether);

        vm.stopBroadcast();
    }
}
