// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Pool.sol";
import "../src/interfaces/IUniswapV3Pool.sol";

contract InitializePools is Script {
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    // Pool addresses
    address constant WTURA_TT1_POOL = 0xF5e11e34d7e57bfb090f1aCF8C5367De96d33F75;
    address constant WTURA_TT2_POOL = 0x1b7375D2300De80a27630A34C88b8C8fAa688F84;
    address constant TT1_TT2_POOL = 0x6EFb56d87BC31598d030Ece8E2067ce5d9aE1692;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Initialize WTURA/TT1 pool (1:100 ratio)
        UniswapV3Pool(WTURA_TT1_POOL).initialize(
            79228162514264337593543950336 // sqrt(1/100) * 2^96
        );

        // Initialize WTURA/TT2 pool (1:100 ratio)
        UniswapV3Pool(WTURA_TT2_POOL).initialize(
            79228162514264337593543950336 // sqrt(1/100) * 2^96
        );

        // Initialize TT1/TT2 pool (1:1 ratio)
        UniswapV3Pool(TT1_TT2_POOL).initialize(
            792281625142643375935439503360 // sqrt(1) * 2^96
        );

        vm.stopBroadcast();
    }
}
