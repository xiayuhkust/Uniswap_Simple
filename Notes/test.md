# Tura DEX Test Records

## Test Environment
- Network: Tura Blockchain
- RPC URL: https://rpc-beta1.turablockchain.com
- Chain ID: 1337
- Test Date: February 23, 2025

## Contract Verification Tests
### Factory Contract
Status: ✅ Passed
- [x] Contract Deployment
  - Address: 0x7443318489164C50C22951Ad1c1a3C7e67714C5e
  - Code size: 13171 bytes
- [x] Fee Configuration
  - 0.05% fee -> 10 tick spacing
  - 0.3% fee -> 60 tick spacing

### Manager Contract
Status: ✅ Passed
- [x] Contract Deployment
  - Address: 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2
  - Code size: 19665 bytes
- [x] Factory Link Verification
  - Correctly linked to Factory: 0x7443318489164C50C22951Ad1c1a3C7e67714C5e

### WTURA Contract
Status: ✅ Passed
- [x] Contract Deployment
  - Address: 0xc8F7d7989a409472945b00177396f4e9b8601DF3
  - Code size: 3707 bytes
- [x] Token Configuration
  - Symbol: WTURA
  - Decimals: 18

### Pool Contracts
Status: ✅ Passed
- [x] WTURA/TT1 Pool (0.3% fee)
  - Address: 0x089A50C3868E1dd1FdC670CF5F1Bd5BB03AbfC1D
  - Token0: 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9 (TT1)
  - Token1: 0xc8F7d7989a409472945b00177396f4e9b8601DF3 (WTURA)
  - SqrtPriceX96: 792281625142643375935439503360 (1:100 ratio)

- [x] WTURA/TT2 Pool (0.3% fee)
  - Address: 0xB8aD8416742C6B5e4D00A5e8A0cfb0129c37101f
  - Token0: 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122 (TT2)
  - Token1: 0xc8F7d7989a409472945b00177396f4e9b8601DF3 (WTURA)
  - SqrtPriceX96: 792281625142643375935439503360 (1:100 ratio)

- [x] TT1/TT2 Pool (0.05% fee)
  - Address: 0x6EFb56d87BC31598d030Ece8E2067ce5d9aE1692
  - Already deployed and initialized

## Pool Creation and Initialization Tests
Status: ✅ Passed
- [x] Pool Creation
  - Test: scripts/CreatePools4.s.sol
  - Result: Successfully created all pools
  - Pool Addresses:
    * WTURA/TT1: 0x2044bDb84580aD2Edd74bbCF4106FE5C9D5b50cD
    * WTURA/TT2: 0xE8f68FE64dc32A1a3636Ad303fC241154a952D50
    * TT1/TT2: 0x279Ec96DEeDfb667C3280021196b2b0289F9BEa9

- [x] Pool Initialization
  - Test: scripts/InitializePools5.s.sol, scripts/VerifyPoolInitialization2.s.sol
  - Result: All pools initialized with correct sqrt prices
  - Price Ratios:
    * WTURA/TT1: 79228162514264337593543950336 (1:100)
    * WTURA/TT2: 79228162514264337593543950336 (1:100)
    * TT1/TT2: 792281625142643375935439503360 (1:1)

- [x] Liquidity Addition
  - Test: scripts/AddLiquidity6.s.sol, scripts/VerifyLiquidity.s.sol
  - Result: Successfully added liquidity to all pools
  - Liquidity Values:
    * WTURA/TT1: 100000000000000000005
    * WTURA/TT2: 100000000000000000005
    * TT1/TT2: 1000000000000000000005
  - Token Amounts:
    * WTURA/TT1: 100 WTURA + 10000 TT1
    * WTURA/TT2: 100 WTURA + 10000 TT2
    * TT1/TT2: 10000 TT1 + 10000 TT2

## Next Tests to Run
### Token Tests
- [ ] TT1 balance check
  - Address: 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9
  - Expected: Balance > 100 tokens
- [ ] TT2 balance check
  - Address: 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122
  - Expected: Balance > 100 tokens
- [ ] Token approvals for Manager contract
  - Expected: All tokens approved for Manager
