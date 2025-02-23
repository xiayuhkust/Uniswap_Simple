// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";

interface IWETH {
    function deposit() external payable;
    function balanceOf(address) external view returns (uint256);
}

contract WrapTura is Script {
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Wrap 100 TURA to get WTURA with higher gas price
        IWETH(WTURA).deposit{value: 100 ether, gas: 100000}();
        console.log("WTURA balance:", IWETH(WTURA).balanceOf(msg.sender));

        vm.stopBroadcast();
    }
}
