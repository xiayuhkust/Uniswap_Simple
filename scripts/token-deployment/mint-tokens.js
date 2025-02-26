// Script to mint tokens to the owner address
const { ethers } = require("hardhat");

async function main() {
  console.log("Minting tokens to owner address...");

  // Token addresses
  const tokenAddresses = {
    TT3: "0x8Ba1cD55391a3FC2B4A76aC0D99058D0572aF608",
    TT4: "0x74DfD646cA939e0aBfbd37dA9F5fb7F885cE44Cb",
    TT5: "0xe26Cc979Fee6213160ee903474D3E39CA8486A8a",
    TT6: "0xD6F72636B35A065eAAe03522800AfEFfB91416fF",
    TT7: "0xFd04a3b44A875DCa7d6751acDe7F578d34e35B75",
    TT8: "0xdE1E1D1730587Cbcf06995FADbF06DEAedA9869D"
  };

  // Get the owner account
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // ERC20 ABI for mint function
  const erc20Abi = [
    "function mint(address to, uint256 amount)",
    "function balanceOf(address owner) view returns (uint256)",
    "function name() view returns (string)",
    "function symbol() view returns (string)"
  ];

  // Mint 1,000,000 tokens to owner for each token
  for (const [symbol, address] of Object.entries(tokenAddresses)) {
    console.log(`\nProcessing ${symbol} at ${address}...`);
    
    try {
      // Connect to the token contract
      const tokenContract = new ethers.Contract(address, erc20Abi, owner);
      
      // Get token name and symbol
      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      console.log(`Token: ${name} (${symbol})`);
      
      // Check current balance
      const currentBalance = await tokenContract.balanceOf(owner.address);
      console.log(`Current balance: ${ethers.utils.formatUnits(currentBalance, 18)} ${symbol}`);
      
      // If balance is less than 1,000,000, mint additional tokens
      if (currentBalance.lt(ethers.utils.parseUnits("1000000", 18))) {
        const amountToMint = ethers.utils.parseUnits("1000000", 18).sub(currentBalance);
        console.log(`Minting ${ethers.utils.formatUnits(amountToMint, 18)} ${symbol} to ${owner.address}...`);
        
        // Mint tokens
        const tx = await tokenContract.mint(owner.address, amountToMint);
        await tx.wait();
        
        // Verify new balance
        const newBalance = await tokenContract.balanceOf(owner.address);
        console.log(`New balance: ${ethers.utils.formatUnits(newBalance, 18)} ${symbol}`);
      } else {
        console.log(`Balance already at or above 1,000,000 ${symbol}, no minting needed.`);
      }
    } catch (error) {
      console.error(`Error processing ${symbol}:`, error.message);
    }
  }

  console.log("\nToken minting process completed.");
}

// Execute the minting process
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Minting failed:", error);
    process.exit(1);
  });
