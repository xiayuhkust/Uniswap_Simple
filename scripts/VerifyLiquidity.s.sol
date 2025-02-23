// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/interfaces/IUniswapV3Pool.sol";

contract VerifyLiquidity is Script {
    address constant WTURA_TT1_POOL = 0x2044bDb84580aD2Edd74bbCF4106FE5C9D5b50cD;
    address constant WTURA_TT2_POOL = 0xE8f68FE64dc32A1a3636Ad303fC241154a952D50;
    address constant TT1_TT2_POOL = 0x279Ec96DEeDfb667C3280021196b2b0289F9BEa9;

    function run() public view {
        // Get deployer address
        address deployer = vm.addr(vm.envUint("PRIVATE_KEY"));
        bytes32 positionKey = keccak256(abi.encodePacked(deployer, int24(-887220), int24(887220)));

        // Verify WTURA/TT1 pool
        console.log("\nVerifying WTURA/TT1 pool liquidity:");
        (uint128 liquidity,,,,) = IUniswapV3Pool(WTURA_TT1_POOL).positions(positionKey);
        console.log("Liquidity:", liquidity);

        // Verify WTURA/TT2 pool
        console.log("\nVerifying WTURA/TT2 pool liquidity:");
        (liquidity,,,,) = IUniswapV3Pool(WTURA_TT2_POOL).positions(positionKey);
        console.log("Liquidity:", liquidity);

        // Verify TT1/TT2 pool
        console.log("\nVerifying TT1/TT2 pool liquidity:");
        (liquidity,,,,) = IUniswapV3Pool(TT1_TT2_POOL).positions(positionKey);
        console.log("Liquidity:", liquidity);
    }
}
