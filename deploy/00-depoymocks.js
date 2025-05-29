// const { network , ethers } = require("hardhat");
// const { devChains } = require("../helper-hardhat-config");

// const BASE_FEE = ethers.parseEther("0.25");
// const GAS_PRICE_LINK = 1e9;
// const WEI_PER_UNIT_LINK = ethers.utils.parseEther("0.01");

// module.exports = async function ({ getNamedAccounts, deployments }) {
//   const { deploy, log } = deployments;
//   const { deployer } = await getNamedAccounts();

//   if (devChains.includes(network.name)) {
//     log("Local network detected! Deploying mocks...");

//     await deploy("VRFCoordinatorV2_5Mock", {
//       from: deployer,
//       args: [BASE_FEE, GAS_PRICE_LINK, WEI_PER_UNIT_LINK],
//       log: true,
//       waitConfirmations: 1,
//     });

//     log("Mocks Deployed!");
//     log("--------------------------------------");
//   }
// };

// module.exports.tags = ["all", "mocks"];