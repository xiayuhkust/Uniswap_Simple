// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";

interface IWETH {
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function deposit() external payable;
    function balanceOf(address) external view returns (uint256);
}

contract VerifyWTURAContract is Script {
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;

    function run() public {
        // Verify WTURA code exists
        uint256 wturaSize;
        assembly {
            wturaSize := extcodesize(WTURA)
        }
        console.log("WTURA code size:", wturaSize);
        require(wturaSize > 0, "WTURA not deployed");

        // Verify basic token info
        string memory symbol = IWETH(WTURA).symbol();
        uint8 decimals = IWETH(WTURA).decimals();
        console.log("WTURA symbol:", symbol);
        console.log("WTURA decimals:", decimals);
        require(decimals == 18, "WTURA decimals should be 18");

        console.log("WTURA contract verification passed");
    }
}
