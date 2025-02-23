# Uniswap Simple

A simplified implementation of Uniswap V3 for the Tura blockchain.

## Overview
This project implements core Uniswap V3 functionality with modularized contracts to meet chain size limits. It includes:
- Factory contract for pool creation
- Pool contract for swap and liquidity management
- Manager contract for position management
- Quoter contract for price calculations

## Development Setup
1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Install dependencies:
```bash
forge install
```

3. Build contracts:
```bash
forge build
```

4. Run tests:
```bash
forge test
```

## Contract Addresses (Tura Chain)
- WTURA: `0xc8F7d7989a409472945b00177396f4e9b8601DF3`
- Test Token 1 (TT1): `0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9`
- Test Token 2 (TT2): `0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122`

## Environment Setup
Create a `.env` file with:
```
ETH_RPC_URL=https://rpc-beta1.turablockchain.com
PRIVATE_KEY=your_private_key_here
```

## Documentation
- [Test Results](Notes/test.md)
- [Development Progress](Notes/progress.md)

## References
- [Uniswap V3 Book](https://uniswapv3book.com/)
- [Course Notes](https://github.com/xiayuhkust/UniswapV3_Core/blob/lesson1-introduction-to-markets/docs/LESSONS.md)
