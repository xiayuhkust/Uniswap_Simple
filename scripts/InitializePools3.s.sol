// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Pool.sol";

contract InitializePools3 is Script {
    address constant WTURA_TT1_POOL = 0x089A50C3868E1dd1FdC670CF5F1Bd5BB03AbfC1D;
    address constant WTURA_TT2_POOL = 0xB8aD8416742C6B5e4D00A5e8A0cfb0129c37101f;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Initialize WTURA/TT1 pool (1:100 ratio)
        // Since TT1 is token0 and WTURA is token1, we need sqrt(100) * 2^96
        UniswapV3Pool(WTURA_TT1_POOL).initialize(792281625142643375935439503360);
        console.log("Initialized WTURA/TT1 pool");

        // Initialize WTURA/TT2 pool (1:100 ratio)
        // Since TT2 is token0 and WTURA is token1, we need sqrt(100) * 2^96
        UniswapV3Pool(WTURA_TT2_POOL).initialize(792281625142643375935439503360);
        console.log("Initialized WTURA/TT2 pool");

        vm.stopBroadcast();
    }
}
