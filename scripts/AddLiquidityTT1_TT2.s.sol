// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "../src/UniswapV3Pool.sol";
import "../src/UniswapV3Manager.sol";
import "../src/interfaces/IUniswapV3Pool.sol";

contract AddLiquidityTT1_TT2 is Script {
    address constant POOL = 0x6EFb56d87BC31598d030Ece8E2067ce5d9aE1692;
    address constant MANAGER = 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;
    
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Add liquidity around current price (1:1)
        // Using tick range ±10% around current price
        UniswapV3Manager(MANAGER).mint(
            POOL,
            tick(4500),  // Lower tick (~10% below)
            tick(5500),  // Upper tick (~10% above)
            100 ether,   // TT1 amount
            100 ether,   // TT2 amount (1:1 ratio)
            ""          // Empty callback data
        );

        // Log position details
        (uint160 sqrtPriceX96,,,,) = IUniswapV3Pool(POOL).slot0();
        console.log("Pool price after liquidity addition:");
        console.log("SqrtPriceX96:", sqrtPriceX96);

        vm.stopBroadcast();
    }

    function tick(uint256 price) internal pure returns (int24) {
        return int24(int256(log2(price) * 2**23));
    }

    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        uint256 temp = value;
        
        while (temp > 1) {
            temp >>= 1;
            result += 1;
        }
        
        return result;
    }
}
