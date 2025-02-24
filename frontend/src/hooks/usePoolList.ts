const { ethers } = require('ethers');
const FACTORY_ABI = [
  "event PoolCreated(address token0, address token1, uint24 fee, int24 tickSpacing, address pool)",
  "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)"
];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider('https://rpc-beta1.turablockchain.com');
  const factoryAddress = '0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70';
  const TT1 = '0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9';
  const TT2 = '0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122';
  const WTURA = '0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be';
  
  const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, provider);
  
  try {
    // Check all pairs
    const pairs = [
      { tokens: [TT1, TT2], name: 'TT1/TT2' },
      { tokens: [TT1, WTURA], name: 'TT1/WTURA' },
      { tokens: [TT2, WTURA], name: 'TT2/WTURA' }
    ];

    for (const pair of pairs) {
      const pool = await factory.getPool(pair.tokens[0], pair.tokens[1], 3000); // 0.3% fee tier
      console.log(`Pool address for ${pair.name}:`, pool);
      if (pool === '0x0000000000000000000000000000000000000000') {
        console.log(`No pool found for ${pair.name}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();