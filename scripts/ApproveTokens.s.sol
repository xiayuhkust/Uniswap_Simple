// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IERC20.sol";

contract ApproveTokens is Script {
    address constant MANAGER = 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Approve large amounts for testing
        IERC20(WTURA).approve(MANAGER, type(uint256).max);
        IERC20(TT1).approve(MANAGER, type(uint256).max);
        IERC20(TT2).approve(MANAGER, type(uint256).max);

        vm.stopBroadcast();
    }
}
