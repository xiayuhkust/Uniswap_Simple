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
    address constant WTURA_TT1_POOL = 0xC9cfE71004db8985aD5d7c5Ad9dB33DF285bde5c;
    address constant WTURA_TT2_POOL = 0xd72c33b2fF191c415F8696c6966A1F94B5f7cdd8;
    address constant TT1_TT2_POOL = 0x612e2bc9FC618d94927CE56b8B5E7cABD6e914bd;

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
