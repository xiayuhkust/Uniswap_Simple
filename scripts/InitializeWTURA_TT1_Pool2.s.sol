// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Pool.sol";

contract InitializeWTURA_TT1_Pool2 is Script {
    address constant WTURA_TT1_POOL = 0x089A50C3868E1dd1FdC670CF5F1Bd5BB03AbfC1D;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Initialize WTURA/TT1 pool (1:100 ratio)
        // sqrt(1/100) * 2^96
        UniswapV3Pool(WTURA_TT1_POOL).initialize(79228162514264337593543950336);
        console.log("Initialized WTURA/TT1 pool");

        vm.stopBroadcast();
    }
}
