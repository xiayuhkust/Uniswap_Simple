// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IERC20.sol";

contract MintTestTokens is Script {
    address constant WTURA = 0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Mint WTURA by depositing native TURA
        (bool success,) = WTURA.call{value: 1 ether}("");
        require(success, "WTURA deposit failed");

        // Mint TT1 and TT2 (assuming they have a mint function)
        bytes memory mintData = abi.encodeWithSignature("mint(address,uint256)", msg.sender, 100 ether);
        (success,) = TT1.call(mintData);
        require(success, "TT1 mint failed");

        (success,) = TT2.call(mintData);
        require(success, "TT2 mint failed");

        vm.stopBroadcast();
    }
}
