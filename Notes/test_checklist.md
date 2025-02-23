# Uniswap V3 Test Checklist

## Contract Verification Tests
- [ ] Verify Factory contract deployment
  - Address: 0x7443318489164C50C22951Ad1c1a3C7e67714C5e
  - Expected: Contract code exists and is correct
- [ ] Verify Manager contract deployment
  - Address: 0x3Ca8634383E707Fb465A1bB4d5D6E0cdeaacc6c2
  - Expected: Contract code exists and is correct
- [ ] Verify WTURA contract deployment
  - Address: 0xc8F7d7989a409472945b00177396f4e9b8601DF3
  - Expected: Contract code exists and is correct

## Token Tests
- [ ] WTURA balance check and wrapping test
  - Expected: Can wrap TURA to WTURA
  - Expected: Balance updates correctly
- [ ] TT1 balance check
  - Address: 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9
  - Expected: Balance > 100 tokens
- [ ] TT2 balance check
  - Address: 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122
  - Expected: Balance > 100 tokens
- [ ] Token approvals for Manager contract
  - Expected: All tokens approved for Manager

## Pool Creation Tests
- [ ] Verify Factory can create WTURA/TT1 pool (0.3% fee)
  - Expected: Pool created with correct parameters
  - Expected: Pool code deployed successfully
- [ ] Verify Factory can create WTURA/TT2 pool (0.3% fee)
  - Expected: Pool created with correct parameters
  - Expected: Pool code deployed successfully
- [ ] Verify TT1/TT2 pool exists (0.05% fee)
  - Expected: Pool exists with correct parameters
  - Expected: Pool code deployed successfully

## Pool Initialization Tests
- [ ] Initialize WTURA/TT1 pool
  - Required sqrt price: 79228162514264337593543950336 (for 1:100 ratio)
  - Expected: Pool initialized with correct price
- [ ] Initialize WTURA/TT2 pool
  - Required sqrt price: 79228162514264337593543950336 (for 1:100 ratio)
  - Expected: Pool initialized with correct price
- [ ] Verify TT1/TT2 pool initialization
  - Required sqrt price: 792281625142643375935439503360 (for 1:1 ratio)
  - Expected: Pool initialized with correct price

## Liquidity Addition Tests
- [ ] Add liquidity to WTURA/TT1 pool
  - Ratio: 1:100
  - Fee: 0.3%
  - Amount WTURA: 1 TURA
  - Amount TT1: 100 TT1
  - Expected: Liquidity added successfully
- [ ] Add liquidity to WTURA/TT2 pool
  - Ratio: 1:100
  - Fee: 0.3%
  - Amount WTURA: 1 TURA
  - Amount TT2: 100 TT2
  - Expected: Liquidity added successfully
- [ ] Add liquidity to TT1/TT2 pool
  - Ratio: 1:1
  - Fee: 0.05%
  - Amount TT1: 100 TT1
  - Amount TT2: 100 TT2
  - Expected: Liquidity added successfully
