const AKAP = artifacts.require("AKAP");
const URLShortener = artifacts.require("URLShortener");

contract("When testing AKAP URLShortener, it:", async accounts => {

  it("deploy correctly and assigns a parent node via AKAP", async () => {
       // This tests AKAP is injected at deployment time and a parent node is assigned
       const akap = await AKAP.deployed();
       const shortener = await URLShortener.deployed();

       let parentNodeId = await shortener.parentNodeId();

       assert.equal(shortener.address, await akap.ownerOf(parentNodeId));
       assert.equal(accounts[0], await akap.getApproved(parentNodeId));
       assert.equal("http://redir.eth", await akap.tokenURI(parentNodeId));
   });

   it("should claim a child node with a given label and node body content ", async () => {
       // This tests URL Shortener can claim a child node and assign the provided node label to the nodeId
       const akap = await AKAP.deployed();
       const shortener = await URLShortener.deployed();

       let parentNodeId = await shortener.parentNodeId();
       let nodeId       = await akap.hashOf(parentNodeId, [0x1]);

       await shortener.claimAndSetNodeBody([0x1], [0x1, 0x2], {from: accounts[1]});
       let nodeBody = await akap.nodeBody(nodeId);
       assert.equal(accounts[1], await akap.ownerOf(nodeId));
       assert.equal(0x102, await akap.nodeBody(nodeId));
    });

    it("shouldn't transfer an existing node to another owner ", async () => {
        // This tests URL Shortener won't transfer a pre-owned node. This
        // can be done directly in AKAP if needed.
        const akap = await AKAP.deployed();
        const shortener = await URLShortener.deployed();

        let parentNodeId = await shortener.parentNodeId();
        let nodeId       = await akap.hashOf(parentNodeId, [0x1]);

        await shortener.claimAndSetNodeBody([0x1], [0x1, 0x2], {from: accounts[1]});
        await shortener.claimAndSetNodeBody([0x1], [0x1, 0x4], {from: accounts[2]});

        assert.equal(accounts[1], await akap.ownerOf(nodeId));
        assert.equal(0x102, await akap.nodeBody(nodeId));
     });

});


