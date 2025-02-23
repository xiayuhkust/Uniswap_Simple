// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";

interface IUniswapV3Factory {
    function fees(uint24) external view returns (uint24);
}

contract VerifyFactoryContract is Script {
    address constant FACTORY = 0x7443318489164C50C22951Ad1c1a3C7e67714C5e;

    function run() public {
        // Verify Factory code exists
        uint256 factorySize;
        assembly {
            factorySize := extcodesize(FACTORY)
        }
        console.log("Factory code size:", factorySize);
        require(factorySize > 0, "Factory not deployed");

        // Verify fee tiers
        uint24 tickSpacing500 = IUniswapV3Factory(FACTORY).fees(500);
        uint24 tickSpacing3000 = IUniswapV3Factory(FACTORY).fees(3000);
        
        console.log("Fee 0.05% tick spacing:", tickSpacing500);
        console.log("Fee 0.3% tick spacing:", tickSpacing3000);
        
        require(tickSpacing500 == 10, "Fee tier 0.05% not configured correctly");
        require(tickSpacing3000 == 60, "Fee tier 0.3% not configured correctly");

        console.log("Factory contract verification passed");
    }
}
