// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/interfaces/IUniswapV3Factory.sol";

contract VerifyFactoryGetPool4 is Script {
    address constant FACTORY = 0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70;
    address constant WTURA = 0xc8F7d7989a409472945b00177396f4e9b8601DF3;
    address constant TT1 = 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9;
    address constant TT2 = 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122;

    function run() public view {
        IUniswapV3Factory factory = IUniswapV3Factory(FACTORY);

        // Try both orderings for WTURA/TT1
        console.log("\nTrying WTURA/TT1 pool both ways:");
        try factory.getPool(WTURA, TT1, 3000) returns (address pool) {
            console.log("WTURA, TT1:", pool);
        } catch {
            console.log("WTURA, TT1: reverted");
        }
        try factory.getPool(TT1, WTURA, 3000) returns (address pool) {
            console.log("TT1, WTURA:", pool);
        } catch {
            console.log("TT1, WTURA: reverted");
        }

        // Try both orderings for WTURA/TT2
        console.log("\nTrying WTURA/TT2 pool both ways:");
        try factory.getPool(WTURA, TT2, 3000) returns (address pool) {
            console.log("WTURA, TT2:", pool);
        } catch {
            console.log("WTURA, TT2: reverted");
        }
        try factory.getPool(TT2, WTURA, 3000) returns (address pool) {
            console.log("TT2, WTURA:", pool);
        } catch {
            console.log("TT2, WTURA: reverted");
        }

        // Try both orderings for TT1/TT2
        console.log("\nTrying TT1/TT2 pool both ways:");
        try factory.getPool(TT1, TT2, 3000) returns (address pool) {
            console.log("TT1, TT2:", pool);
        } catch {
            console.log("TT1, TT2: reverted");
        }
        try factory.getPool(TT2, TT1, 3000) returns (address pool) {
            console.log("TT2, TT1:", pool);
        } catch {
            console.log("TT2, TT1: reverted");
        }
    }
}
