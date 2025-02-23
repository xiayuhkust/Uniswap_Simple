// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Factory.sol";
import "../src/UniswapV3Manager.sol";

interface IWETH {
    function deposit() external payable;
    function balanceOf(address) external view returns (uint256);
}

contract VerifyContracts is Script {
    address constant FACTORY = 0x7443318489164C50C22951Ad1c1a3C7e67714C5e;
    address constant MANAGER = 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;

    function run() public {
        // Verify Factory
        uint256 factorySize;
        assembly {
            factorySize := extcodesize(FACTORY)
        }
        console.log("Factory code size:", factorySize);
        require(factorySize > 0, "Factory not deployed");

        // Verify Manager
        uint256 managerSize;
        assembly {
            managerSize := extcodesize(MANAGER)
        }
        console.log("Manager code size:", managerSize);
        require(managerSize > 0, "Manager not deployed");

        // Verify WTURA
        uint256 wturaSize;
        assembly {
            wturaSize := extcodesize(WTURA)
        }
        console.log("WTURA code size:", wturaSize);
        require(wturaSize > 0, "WTURA not deployed");

        // Verify Manager is linked to Factory
        address managerFactory = UniswapV3Manager(MANAGER).factory();
        console.log("Manager factory:", managerFactory);
        require(managerFactory == FACTORY, "Manager not linked to Factory");

        // Try to deposit WTURA to verify it's working
        IWETH(WTURA).deposit{value: 0.1 ether}();
        uint256 balance = IWETH(WTURA).balanceOf(msg.sender);
        console.log("WTURA balance after deposit:", balance);
        require(balance >= 0.1 ether, "WTURA deposit failed");
    }
}
