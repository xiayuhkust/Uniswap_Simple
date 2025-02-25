const { ethers } = require('ethers');
const FACTORY_ABI = [
  "event PoolCreated(address token0, address token1, uint24 fee, int24 tickSpacing, address pool)",
  "function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool)"
];

async function main() {
  // Use the private key from the environment
  const privateKey = 'ad6fb1ceb0b9dc598641ac1cef545a7882b52f5a12d7204d6074762d96a8a474';
  const provider = new ethers.providers.JsonRpcProvider('https://rpc-beta1.turablockchain.com');
  const wallet = new ethers.Wallet(privateKey, provider);
  
  const factoryAddress = '0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70';
  const TT1 = '0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9';
  const TT2 = '0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122';
  const WTURA = '0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be';
  
  const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, wallet);
  
  try {
    // Create TT1/WTURA pool
    console.log('Creating TT1/WTURA pool...');
    const tx1 = await factory.createPool(TT1, WTURA, 3000);
    await tx1.wait();
    console.log('TT1/WTURA pool created');

    // Create TT2/WTURA pool
    console.log('Creating TT2/WTURA pool...');
    const tx2 = await factory.createPool(TT2, WTURA, 3000);
    await tx2.wait();
    console.log('TT2/WTURA pool created');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
