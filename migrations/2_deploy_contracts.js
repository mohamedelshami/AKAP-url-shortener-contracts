const AKAP = artifacts.require("AKAP");
const URLShortener = artifacts.require("URLShortener");

const DOMAIN = "redir.eth";
const TOKEN_URI = "https://" + DOMAIN;
const domainHex = web3.utils.fromAscii(DOMAIN);

const AKAP_ADDRESS = "0xaacCAAB0E85b1EfCEcdBA88F4399fa6CAb402349";

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
      if (network == "test") {
          await deployer.deploy(AKAP);
          let instance = await deployer.deploy(URLShortener, AKAP.address, domainHex, TOKEN_URI);
      } else {
          let instance = await deployer.deploy(URLShortener, AKAP_ADDRESS, domainHex, TOKEN_URI);
      }
   });
};

