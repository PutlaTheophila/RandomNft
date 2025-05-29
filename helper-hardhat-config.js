const {ethers} = require("hardhat");

const networkConfig = {
    11155111: {
      name: "sepolia",
      VRFConsumerBaseV2Plusaddress: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
      keyHash: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
      subscriptionId : "43852619907888437924998710464537703569832687462981514791370309263181931267537",
      requestConfirmations : 3,
      numWords : 1,
      callbackGasLimit : 500000,
      dogTokenUris: ["13456" , "12345" , "123456"],
      mintFee : ethers.parseEther("0.001"),
    },
    31337: {
      name: "hardhat",
      entranceFee: "100000000000000000", // 0.1 ETH in wei
      interval: "30",
    },
  };
  
  const devChains = ["hardhat", "localhost"];
  
  module.exports = {
    networkConfig,
    devChains,
  };
  