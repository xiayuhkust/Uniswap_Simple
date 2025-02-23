// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Pool.sol";

contract InitializeWTURA_TT1_Pool3 is Script {
    address constant WTURA_TT1_POOL = 0x089A50C3868E1dd1FdC670CF5F1Bd5BB03AbfC1D;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get pool instance
        UniswapV3Pool pool = UniswapV3Pool(WTURA_TT1_POOL);

        // Verify tokens
        require(pool.token0() == WTURA, "Incorrect token0");
        require(pool.token1() == TT1, "Incorrect token1");

        // Initialize WTURA/TT1 pool (1:100 ratio)
        // sqrt(1/100) * 2^96
        pool.initialize(79228162514264337593543950336);
        console.log("Initialized WTURA/TT1 pool");

        vm.stopBroadcast();
    }
}
