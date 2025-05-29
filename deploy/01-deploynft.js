const { network, ethers } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config.js");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();  // **await here!**
  const chainId = network.config.chainId;
  console.log("ChainId:", chainId);

  const args = [
    networkConfig[chainId]["dogTokenUris"],
    networkConfig[chainId]["mintFee"],
    networkConfig[chainId]["subscriptionId"],
    networkConfig[chainId]["keyHash"],
    networkConfig[chainId]["requestConfirmations"],
    networkConfig[chainId]["callbackGasLimit"],
    networkConfig[chainId]["VRFConsumerBaseV2Plusaddress"],
  ];

  console.log("Constructor args:", args);

  const nft = await deploy("RandomNft", {
    from: deployer,
    log: true,
    args:args
  });

  console.log(nft.address);
  const signer = ethers.getSigners().deployer;

  const vrfCoordinator = new ethers.Contract("0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B", ["function addConsumer(uint256 subId, address consumer) external"] , signer)
  const txnResponse = await vrfCoordinator.addConsumer();
  const txnReceipt = await txnResponse.wait(1);
  console.log(txnReceipt);
}

module.exports.tags = ["all", "main"];
