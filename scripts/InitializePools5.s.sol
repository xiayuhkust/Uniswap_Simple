// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/interfaces/IUniswapV3Pool.sol";

contract InitializePools5 is Script {
    address constant WTURA_TT1_POOL = 0x2044bDb84580aD2Edd74bbCF4106FE5C9D5b50cD;
    address constant WTURA_TT2_POOL = 0xE8f68FE64dc32A1a3636Ad303fC241154a952D50;
    address constant TT1_TT2_POOL = 0x279Ec96DEeDfb667C3280021196b2b0289F9BEa9;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Initialize WTURA/TT1 pool (1:100 ratio)
        console.log("\nInitializing WTURA/TT1 pool:");
        IUniswapV3Pool(WTURA_TT1_POOL).initialize(
            79228162514264337593543950336 // sqrt(1/100) * 2^96
        );
        console.log("Pool initialized");

        // Initialize WTURA/TT2 pool (1:100 ratio)
        console.log("\nInitializing WTURA/TT2 pool:");
        IUniswapV3Pool(WTURA_TT2_POOL).initialize(
            79228162514264337593543950336 // sqrt(1/100) * 2^96
        );
        console.log("Pool initialized");

        // Initialize TT1/TT2 pool (1:1 ratio)
        console.log("\nInitializing TT1/TT2 pool:");
        IUniswapV3Pool(TT1_TT2_POOL).initialize(
            792281625142643375935439503360 // sqrt(1) * 2^96
        );
        console.log("Pool initialized");

        vm.stopBroadcast();
    }
}
