async function main() {
  const hre = require('hardhat'); // Import Hardhat runtime environment
  const [deployer] = await hre.ethers.getSigners(); // Use hre.ethers

  console.log('Deploying contracts with the account:', deployer.address);

  const KnowledgeHub = await hre.ethers.getContractFactory('KnowledgeHub'); // Use hre.ethers
  const contract = await KnowledgeHub.deploy(); // Deploy the contract
  var result = await contract.waitForDeployment(); // Wait for deployment to complete

  console.log('Contract deployed to:', result.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
