require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy"); // 👈 add this line at the top


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers:[{version:"0.8.8"},{version:"0.8.20"}],
  },
  defaultNetwork: "sepoliaTestNet",
  namedAccounts:{
    deployer:{
      default:0
    },
    player1:{
      default:1
    },
    player2:{
      default:2
    }
  },
  networks:{
    localhost:{
      url:"http://127.0.0.1:8989/",
      chainId:31337,
    },
    sepoliaTestNet : {
      // url:"https://linea-sepolia.g.alchemy.com/v2/ivB0N3UpPQYTxvfLEeyFq1rTHCCT-l2S",
      url : "https://eth-sepolia.g.alchemy.com/v2/ivB0N3UpPQYTxvfLEeyFq1rTHCCT-l2S",
      chainId : 11155111,
      accounts : ["91c2c79188585dad7b3868152c2197a2dd032b8e622f515c2a1f8c00da9a0e18"]
    }
  }
};
