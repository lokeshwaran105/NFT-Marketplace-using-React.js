// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.6;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./library/Counter.sol";

contract NFT is ERC721URIStorage{
    using Counters for Counters.Counter;

    Counters.Counter public _tokenId;
    address contractAddress;

    constructor(address marketPlaceAddress) ERC721("LOKI", "LKT") {
        contractAddress = marketPlaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        
        _tokenId.increment();
        uint currentTokenId = _tokenId.current();
        _mint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return currentTokenId;
    }
}