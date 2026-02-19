import { default as hreLib } from "hardhat";

const hre = hreLib as any;

async function main() {
  console.log("\n🚀 Deploying BNOU.dev\n");
  
  if (!hre.ethers) {
    console.log("Using hardhat-toolbox-viem. Deploying via Ignition module...\n");
    
    // Use ignition as fallback
    const BNOUTokenModule = await hre.ignition.deploy(
      await import("../ignition/modules/BNOUTokenModule"), 
      { network: "localhost" }
    );
    
    const tokenAddr = BNOUTokenModule.bnou.address;
    console.log(`✅ BNOU deployed at: ${tokenAddr}\n`);
    return;
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📍 Network: localhost (Chain ID: 31337)`);
  console.log(`💳 Deployer: ${deployer.address}`);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH\n`);

  console.log("📦 Deploying BNOUDev...");
  const Factory = await hre.ethers.getContractFactory("BNOUDev");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  
  const addr = await contract.getAddress();
  console.log(`✅ BNOU.dev at: ${addr}\n`);

  console.log("📊 Token Details:");
  console.log(`   Name: ${await contract.name()}`);
  console.log(`   Symbol: ${await contract.symbol()}`);
  console.log(`   Decimals: ${await contract.decimals()}`);
  console.log(`   Supply: ${hre.ethers.formatUnits(await contract.totalSupply(), await contract.decimals())} tokens\n`);

  const pair = await contract.uniswapV2Pair();
  console.log(`📝 Pair: ${pair}`);
  if (pair === "0x0000000000000000000000000000000000000000") {
    console.log(`   Skipped (local network)\n`);
  } else {
    console.log(`   Created\n`);
  }
  
  console.log("✅ Ready!\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
