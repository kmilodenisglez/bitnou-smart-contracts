
import hre from "hardhat";

async function main() {
  console.log("HRE Keys:", Object.keys(hre));
  
  // Connect to network first
  const connection = await hre.network.connect();
  console.log("Connection:", connection);
  console.log("Connection Keys:", Object.keys(connection));
  console.log("Connection Viem:", (connection as any).viem);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
