// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/interfaces/IUniswapV3Factory.sol";
import "../src/interfaces/IUniswapV3Manager.sol";

contract VerifyExistingContracts is Script {
    address constant FACTORY = 0x15DD62f283fCE90DfF2d6718422505834c1B5115;
    address constant MANAGER = 0xF7d3b6638416C67B7F42e58A6cFB15B048A26112;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public {
        // Verify Factory
        IUniswapV3Factory factory = IUniswapV3Factory(FACTORY);
        console.log("\nVerifying Factory contract at:", FACTORY);
        
        // Verify Manager
        IUniswapV3Manager manager = IUniswapV3Manager(MANAGER);
        console.log("\nVerifying Manager contract at:", MANAGER);

        // Verify Factory can get pools
        console.log("\nVerifying Factory getPool function:");
        address pool1 = factory.getPool(TT1, WTURA, 3000);
        console.log("WTURA/TT1 pool:", pool1);
        address pool2 = factory.getPool(TT2, WTURA, 3000);
        console.log("WTURA/TT2 pool:", pool2);
        address pool3 = factory.getPool(TT1, TT2, 3000);
        console.log("TT1/TT2 pool:", pool3);
    }
}
