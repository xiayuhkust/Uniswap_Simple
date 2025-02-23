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
