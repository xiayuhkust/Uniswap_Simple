// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";

interface IWETH {
    function deposit() external payable;
    function balanceOf(address) external view returns (uint256);
}

contract WrapTura is Script {
    address constant WTURA = 0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Wrap 10 TURA to get WTURA
        IWETH(WTURA).deposit{value: 10 ether}();
        console.log("WTURA balance:", IWETH(WTURA).balanceOf(msg.sender));

        vm.stopBroadcast();
    }
}
