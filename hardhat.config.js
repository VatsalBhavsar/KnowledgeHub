/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: process.env.NETWORK_ENDPOINT_ID, // Use INFURA_PROJECT_ID
      accounts: [process.env.METAMASK_PRIVATE_KEY],
    },
  },
};
