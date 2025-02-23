// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";

interface IUniswapV3Manager {
    function factory() external view returns (address);
}

contract VerifyManagerContract is Script {
    address constant FACTORY = 0x7443318489164C50C22951Ad1c1a3C7e67714C5e;
    address constant MANAGER = 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2;

    function run() public {
        // Verify Manager code exists
        uint256 managerSize;
        assembly {
            managerSize := extcodesize(MANAGER)
        }
        console.log("Manager code size:", managerSize);
        require(managerSize > 0, "Manager not deployed");

        // Verify Manager is linked to correct Factory
        address managerFactory = IUniswapV3Manager(MANAGER).factory();
        console.log("Manager factory:", managerFactory);
        require(managerFactory == FACTORY, "Manager not linked to Factory");

        console.log("Manager contract verification passed");
    }
}
