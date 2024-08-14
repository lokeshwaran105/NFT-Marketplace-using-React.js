// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./library/Counter.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {

    address payable owner;
    uint public listingPrice = 1 ether;
    
    using Counters for Counters.Counter;
    Counters.Counter public _itemId;
    Counters.Counter public _itemsSold;
    Counters.Counter public _itemsDel;

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint tokenId;
        address payable owner;
        address payable seller;
        uint price;
        bool sold;
        bool IsDeleted;
    }

    mapping (uint256 => MarketItem) private individualItem;

    event createItem(
        uint indexed itemId,
        address indexed nftContract,
        uint indexed tokenId,
        address owner,
        address seller,
        uint price,
        bool sold,
        bool IsDeleted
    );

    event buyItem(
        uint indexed itemId,
        address indexed nftContract,
        uint indexed tokenId,
        address owner,
        address seller,
        uint price,
        bool sold,
        bool IsDeleted
    );

    event DeleteNFT(
        uint indexed tokenId
    );
    
    constructor() {
        owner = payable (msg.sender);
    }

    function CreateItem(uint price, address nftContract, uint tokenid) public payable nonReentrant returns (MarketItem memory){
        require(price > 0, "Price Should be atleast 1 wei");
        require(msg.value >= listingPrice, "Pay the required listing fees");

        _itemId.increment();
        uint currentItemId = _itemId.current();

        individualItem[currentItemId] = MarketItem(
            currentItemId,
            nftContract,
            tokenid,
            payable (address(0)),
            payable (msg.sender),
            price,
            false,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenid);

        emit createItem(
            currentItemId,
            nftContract, 
            tokenid, 
            address(0), 
            msg.sender, 
            price, 
            false,
            false
        );

        return(individualItem[currentItemId]);
    }

    function DeleteItem(uint itemid) public nonReentrant returns (MarketItem memory){

        MarketItem storage item = individualItem[itemid];

        require(!item.sold, "Could not delete sold NFT's");

        individualItem[itemid].IsDeleted = true;

        emit DeleteNFT(itemid);

        _itemsDel.increment();

        return item;

    }

    function saleNFT(uint itemid, address nftContract) public payable nonReentrant {
        uint price = individualItem[itemid].price;
        uint tokenid = individualItem[itemid].tokenId;

        require(!individualItem[itemid].IsDeleted, "NFT not available");
        require(price <= msg.value, "Pay the required price to buy this order");

        individualItem[itemid].seller.transfer(msg.value);

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenid);

        emit buyItem(itemid,
                     nftContract,
                     tokenid,
                     msg.sender, 
                     individualItem[itemid].seller, 
                     price, 
                     true,
                     false
                    );

        individualItem[itemid].owner = payable (msg.sender);

        individualItem[itemid].sold = true;

        _itemsSold.increment();
    }

    function fetchItems() public view returns (MarketItem[] memory) {

        uint itemCount = _itemId.current();
        uint filtered_items = (_itemId.current() - _itemsSold.current()) - _itemsDel.current();
        
        MarketItem[] memory item = new MarketItem[](filtered_items);
        uint currentIndex = 0;


        for (uint i=0; i<itemCount; i++) 
        {
            if(individualItem[i+1].owner == address(0) && individualItem[i+1].IsDeleted == false){
                uint currentItemId = individualItem[i+1].itemId;
                MarketItem storage currentItem = individualItem[currentItemId];

                item[currentIndex++] = currentItem;
            } 
        }

        return item;
    }

    function fetchMyItems() public view returns (MarketItem[] memory) {
        
        uint totalItems = _itemId.current();
        uint itemsCount = 0;
        uint currentIndex = 0;

        for (uint i=0; i<totalItems; i++) 
        {
            if(individualItem[i+1].owner == msg.sender && individualItem[i+1].IsDeleted == false){
                itemsCount++;
            }
        }

        MarketItem[] memory item = new MarketItem[](itemsCount);

        for (uint i=0; i<itemsCount; i++) 
        {
            if(individualItem[i+1].owner == msg.sender){
                uint currentItemId = individualItem[i+1].itemId;
                MarketItem storage currentItem = individualItem[currentItemId];

                item[currentIndex++] = currentItem;
            }
        }

        return item;

    }

    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        
        uint totalItems = _itemId.current();
        uint itemsCount = 0;
        uint currentIndex = 0;

        for (uint i=0; i<totalItems; i++) 
        {
            if(individualItem[i+1].seller == msg.sender){
                itemsCount++;
            }
        }

        MarketItem[] memory item = new MarketItem[](itemsCount);

        for (uint i=0; i<itemsCount; i++) 
        {
            if(individualItem[i+1].seller == msg.sender){
                uint currentItemId = individualItem[i+1].itemId;
                MarketItem storage currentItem = individualItem[currentItemId];

                item[currentIndex++] = currentItem;
            }
        }

        return item;

    }

    function getUnsoldCount() public view returns (Counters.Counter memory, Counters.Counter memory, Counters.Counter memory) {
        return (_itemsSold, _itemId, _itemsDel);
    }
     
}