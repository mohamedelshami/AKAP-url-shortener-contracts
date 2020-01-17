pragma solidity ^0.5.0;

import "../../AKAP/contracts/AKAP.sol";

contract URLShortener {

    uint private _parentNodeId;
    address private _akapAddress;

    constructor(address akapAddress, uint parentNodeId) public {
        _akapAddress = akapAddress;
        _parentNodeId = parentNodeId;
    }

    /**
    * @dev claims a child node and sets the node body. See 'AKAP.claim' and 'AKAP.setNodeBody'.
    *
    * The new child node will transferred to the sender
    *
    * returns 1 if completed successfully otherwise 0
    */
    function claimAndSetNodeBody(bytes calldata label, bytes calldata body) external returns (uint success) {
        AKAP akap = AKAP(_akapAddress);
        uint status = akap.claim(parentNodeId(), label);

        if (status != 0) {
            uint nodeId = akap.hashOf(parentNodeId(), label);
            akap.setNodeBody(nodeId, body);
            akap.transferFrom(akap.ownerOf(nodeId), msg.sender, nodeId);
            return 1;
        }

        return (0);
    }

    function parentNodeId() public view returns (uint) {
        return _parentNodeId;
    }

}