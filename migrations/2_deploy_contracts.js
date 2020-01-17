const AKAP = artifacts.require("AKAP");
const URLShortener = artifacts.require("URLShortener");

const DOMAIN = "redir.eth";

module.exports = function(deployer) {
  deployer.then(async () => {
      let akap = await deployer.deploy(AKAP);
      // Claim parent node for URL Shortener contract
      let domainHex = web3.utils.fromAscii(DOMAIN);
      let parentNodeId = await akap.hashOf(0x0, domainHex);
      await deployer.deploy(URLShortener, AKAP.address, parentNodeId);
      await akap.claim(0x0, domainHex);
      await akap.setTokenURI(parentNodeId, "http://" + DOMAIN);
      await akap.approve(URLShortener.address, parentNodeId);
      console.log("Deployed URLShortener and assigned nodeId " + await akap.ownerOf(parentNodeId) +
      " id owner of " + domainHex);
   });
};

