// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Pool.sol";
import "../src/interfaces/IUniswapV3Pool.sol";

contract InitializePools2 is Script {
    // Newly created pools
    address constant WTURA_TT1_POOL = 0x089A50C3868E1dd1FdC670CF5F1Bd5BB03AbfC1D;
    address constant WTURA_TT2_POOL = 0xB8aD8416742C6B5e4D00A5e8A0cfb0129c37101f;
    
    // Existing pool
    address constant TT1_TT2_POOL = 0x6EFb56d87BC31598d030Ece8E2067ce5d9aE1692;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Initialize WTURA/TT1 pool (1:100 ratio)
        // sqrt(1/100) * 2^96
        UniswapV3Pool(WTURA_TT1_POOL).initialize(79228162514264337593543950336);
        console.log("Initialized WTURA/TT1 pool");

        // Initialize WTURA/TT2 pool (1:100 ratio)
        // sqrt(1/100) * 2^96
        UniswapV3Pool(WTURA_TT2_POOL).initialize(79228162514264337593543950336);
        console.log("Initialized WTURA/TT2 pool");

        vm.stopBroadcast();
    }
}
