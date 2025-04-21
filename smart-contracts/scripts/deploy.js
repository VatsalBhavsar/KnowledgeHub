const hre = require("hardhat");

async function main() {
    // 1. Get the contract factory
    const ArticleManager = await hre.ethers.getContractFactory("ArticleManager");

    // 2. Deploy the contract
    const articleManager = await ArticleManager.deploy();

    // 3. Wait for deployment to complete
    await articleManager.waitForDeployment();

    // 4. Log the deployment transaction hash
    const deployTx = articleManager.deploymentTransaction();
    console.log("📦 Deployment transaction hash:", deployTx.hash);

    // 5. Get the deployed contract address
    const contractAddress = await articleManager.getAddress();
    console.log("✅ ArticleManager deployed at:", contractAddress);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});
