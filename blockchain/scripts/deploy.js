const hre = require("hardhat");

async function main() {
  console.log("Deploying CybercrimeReport contract...");

  const CybercrimeReport = await hre.ethers.getContractFactory("CybercrimeReport");
  const cybercrimeReport = await CybercrimeReport.deploy();

  await cybercrimeReport.waitForDeployment();

  const address = await cybercrimeReport.getAddress();
  console.log("CybercrimeReport deployed to:", address);

  // Wait for a few block confirmations before verifying
  console.log("Waiting for block confirmations...");
  await cybercrimeReport.deploymentTransaction()?.wait(5);

  // Verify contract on Polygonscan
  if (hre.network.name === "polygonMumbai") {
    console.log("Verifying contract on Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  console.log("\n=== Deployment Summary ===");
  console.log("Contract Address:", address);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", await hre.ethers.provider.getSigner().getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

