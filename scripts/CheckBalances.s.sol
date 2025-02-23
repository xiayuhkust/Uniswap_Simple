// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IERC20.sol";

contract CheckBalances is Script {
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        address deployer = vm.addr(vm.envUint("PRIVATE_KEY"));
        
        uint256 wturaBal = IERC20(WTURA).balanceOf(deployer);
        uint256 tt1Bal = IERC20(TT1).balanceOf(deployer);
        uint256 tt2Bal = IERC20(TT2).balanceOf(deployer);
        
        console.log("Deployer:", deployer);
        console.log("WTURA balance:", wturaBal);
        console.log("TT1 balance:", tt1Bal);
        console.log("TT2 balance:", tt2Bal);
    }
}
