// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/interfaces/IUniswapV3Pool.sol";

contract InitializePools4 is Script {
    // Pool addresses
    address constant WTURA_TT1_POOL = 0x089A50C3868E1dd1FdC670CF5F1Bd5BB03AbfC1D;
    address constant WTURA_TT2_POOL = 0xB8aD8416742C6B5e4D00A5e8A0cfb0129c37101f;
    address constant TT1_TT2_POOL = 0x6EFb56d87BC31598d030Ece8E2067ce5d9aE1692;

    // Price ratios
    // 1:100 ratio = sqrt(1/100) * 2^96
    uint160 constant SQRT_RATIO_1_100 = 79228162514264337593543950336;
    // 1:1 ratio = sqrt(1) * 2^96
    uint160 constant SQRT_RATIO_1_1 = 792281625142643375935439503360;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        console.log("\nInitializing WTURA/TT1 pool (1:100):");
        IUniswapV3Pool(WTURA_TT1_POOL).initialize(SQRT_RATIO_1_100);
        
        console.log("\nInitializing WTURA/TT2 pool (1:100):");
        IUniswapV3Pool(WTURA_TT2_POOL).initialize(SQRT_RATIO_1_100);
        
        console.log("\nInitializing TT1/TT2 pool (1:1):");
        IUniswapV3Pool(TT1_TT2_POOL).initialize(SQRT_RATIO_1_1);

        vm.stopBroadcast();
    }
}
