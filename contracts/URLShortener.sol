pragma solidity ^0.5.0;

import "../../AKAP/contracts/AKAP.sol";

contract URLShortener {

    uint private _parentNodeId;
    address private _akapAddress;
    bytes private _domain;

    constructor(address akapAddress, bytes memory domain, string memory tokenURI) public {
        _akapAddress = akapAddress;
        _domain      = domain;
        AKAP akap = AKAP(_akapAddress);

        _parentNodeId = akap.hashOf(0x0, _domain);

        akap.claim(0x0, domain);
        akap.setTokenURI(_parentNodeId, tokenURI);
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
            require(msg.sender == akap.ownerOf(nodeId));
            return 1;
        }

        return 0;
    }

    /**
    * @dev extends the claim on the parent re-issuing 'AKAP.claim' function
    *
    * See 'AKAP.claim' 'case 1'
    **/
    function reclaim() external returns (uint status){
       AKAP akap = AKAP(_akapAddress);
       return akap.claim(0x0, _domain);
    }

    /**
    * returns the parent / root Id which is the hash of 0x0 and 'bytes' value of domain
    **/
    function parentNodeId() public view returns (uint) {
        return _parentNodeId;
    }

}