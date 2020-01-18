const AKAP = artifacts.require("AKAP");
const URLShortener = artifacts.require("URLShortener");

const DOMAIN = "redir.eth";

module.exports = function(deployer) {
  deployer.then(async () => {
      let akap = await deployer.deploy(AKAP);
      // Claim parent node for URL Shortener contract
      let domainHex = web3.utils.fromAscii(DOMAIN);
      await deployer.deploy(URLShortener, AKAP.address, domainHex, "http://" + DOMAIN);
   });
};

