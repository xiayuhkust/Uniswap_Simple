// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IERC20.sol";

interface IWETH {
    function deposit() external payable;
    function balanceOf(address) external view returns (uint256);
}

interface ITestToken {
    function mint(uint256 amount) external;
    function balanceOf(address) external view returns (uint256);
}

contract MintTestTokens3 is Script {
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get WTURA by depositing TURA
        IWETH(WTURA).deposit{value: 1 ether}();
        console.log("WTURA balance:", IWETH(WTURA).balanceOf(msg.sender));

        // Mint test tokens
        ITestToken(TT1).mint(100 ether);
        console.log("TT1 balance:", ITestToken(TT1).balanceOf(msg.sender));

        ITestToken(TT2).mint(100 ether);
        console.log("TT2 balance:", ITestToken(TT2).balanceOf(msg.sender));

        vm.stopBroadcast();
    }
}
