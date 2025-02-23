# Tura DEX Deployment Records

## Network Information
- Chain ID: 1337
- RPC URL: https://rpc-beta1.turablockchain.com
- Owner Address: 0x08Bb6eA809A2d6c13D57166Fa3ede48C0ae9a70e

## Core Contracts

### WETH (TuraWETH)
- Address: 0xc8F7d7989a409472945b00177396f4e9b8601DF3
- Symbol: WTURA
- Description: Wrapped Tura implementation
- Features:
  * ERC20 compliant
  * Deposit/Withdraw native Tura
  * 18 decimals
- Deployment Date: February 23, 2025

### Test Tokens
1. Test Token 1 (TT1)
   - Address: 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9
   - Symbol: TT1
   - Initial Supply: 1,000,000 tokens
   - Decimals: 18

2. Test Token 2 (TT2)
   - Address: 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122
   - Symbol: TT2
   - Initial Supply: 1,000,000 tokens
   - Decimals: 18

### UniswapV3Factory
- Address: 0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70
- Deployment Date: February 23, 2025
- Implementation: Official Uniswap V3
- Status: Active
- Owner: 0x08Bb6eA809A2d6c13D57166Fa3ede48C0ae9a70e
- Features:
  * Pool creation and management
  * Fee tier configuration
  * Owner management
  * NoDelegateCall protection (verified)
- Fee Tiers:
  * 0.05% (500) - Tick Spacing: 10
  * 0.3% (3000) - Tick Spacing: 60
  * 1.0% (10000) - Tick Spacing: 200
- Core Dependencies:
  * UniswapV3PoolDeployer (integrated)
  * NoDelegateCall (integrated)

## Peripheral Contracts

### UniswapV3Manager
- Address: 0xeA55332dDe678746aCC684D323e357Df05B6F767
- Deployment Date: February 23, 2025
- Features:
  * Position management
  * Liquidity provision
  * Swap execution
- Dependencies:
  * Factory: 0x38776e4492e63062255C96205038952E815ab56b
  * WETH: 0xc8F7d7989a409472945b00177396f4e9b8601DF3

## Test Pools
- WTURA/TT1 Pool (0.3%): 0x2044bDb84580aD2Edd74bbCF4106FE5C9D5b50cD
  * Token0: TT1 (0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9)
  * Token1: WTURA (0xc8F7d7989a409472945b00177396f4e9b8601DF3)
  * Created: February 23, 2025
  * Status: Active

- WTURA/TT2 Pool (0.3%): 0xE8f68FE64dc32A1a3636Ad303fC241154a952D50
  * Token0: TT2 (0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122)
  * Token1: WTURA (0xc8F7d7989a409472945b00177396f4e9b8601DF3)
  * Created: February 23, 2025
  * Status: Active

- TT1/TT2 Pool (0.3%): 0x279Ec96DEeDfb667C3280021196b2b0289F9BEa9
  * Token0: TT1 (0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9)
  * Token1: TT2 (0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122)
  * Created: February 23, 2025
  * Status: Active

## Frontend Deployments
### Wallet Connection Implementation
- **Date**: February 23, 2025
- **Status**: Active
- **Features**:
  * MetaMask integration with wagmi/viem hooks
  * Tura network configuration (Chain ID: 1337)
  * Connection state persistence with localStorage
  * Error handling with Chakra UI toasts
  * Auto-network switching to Tura
  * UI integration with existing components

## Deployment History
1. Math Libraries (2025-02-17)
   - Deployed core math libraries for price and position calculations
2. Factory Contract (2025-02-17)
   - Deployed TuraFactory with support for multiple fee tiers
3. Periphery Contracts (2025-02-17)
   - Deployed SwapRouter for token swaps
   - Deployed NonfungiblePositionManager for LP token management
4. Test Pool Creation (2025-02-17)
   - Created WETH/TestToken1 pool with 0.3% fee
   - Initialized with 1:1 price ratio
   - Added initial liquidity across multiple ranges
5. V3 Periphery Redeployment (2025-02-20)
   - Deployed NFTDescriptor library at 0x0297b528164dE6eeB0543DED5CBC8048eaf7c1D2
   - Deployed NonfungibleTokenPositionDescriptor at 0xF6F59FF948F589bcA48295Be1Df1fD202FE5EeD8
   - Deployed NonfungiblePositionManager at 0x90B834B3027Cd62c76FdAF1c22B21D1D8a2Cc965
   - Deployed SwapRouter at 0xAC15BD2b9CfC37AA3a2aC78CD41a7abF33476F19
   - Verified all contract deployments and dependencies

6. Architectural Decisions (2025-02-20)
   - Decided not to deploy V3Migrator contract as this is a fresh V3-only deployment
   - No V2 infrastructure required
   - Focus on direct V3 liquidity provision without migration path

7. Core Contract Redeployment (2025-02-23)
   - Deployed Factory at 0x38776e4492e63062255C96205038952E815ab56b
     * Features: Pool creation, 500/3000 fee tiers, 10/60 tick spacing
   - Deployed Manager at 0x3ab101888ebb8098b1E0D39861641134A3593B52
     * Features: Position management, liquidity provision, swaps
