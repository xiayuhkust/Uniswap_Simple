// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IERC20.sol";

interface IWETH {
    function deposit() external payable;
}

interface ITestToken {
    function mint(address to, uint256 amount) external;
}

contract MintTestTokens2 is Script {
    address constant WTURA = 0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deposit TURA to get WTURA
        IWETH(WTURA).deposit{value: 1 ether}();

        // Mint test tokens
        ITestToken(TT1).mint(msg.sender, 100 ether);
        ITestToken(TT2).mint(msg.sender, 100 ether);

        vm.stopBroadcast();
    }
}
