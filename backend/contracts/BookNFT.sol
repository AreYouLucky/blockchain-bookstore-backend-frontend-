// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenID;

    struct BookSale {
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => BookSale) public bookSales;

    event BookMinted(uint256 indexed tokenID, address indexed author, string metaData);
    event BookListed(uint256 indexed tokenID, uint256 price);
    event BookSold(uint256 indexed tokenID, address indexed buyer, uint256 price);

    constructor() ERC721("BookNFT", "BOOK") Ownable(msg.sender) {}

    function mintBook(address author, string memory metaDataURI) external onlyOwner {
        uint256 tokenID = nextTokenID;
        _safeMint(author, tokenID);
        _setTokenURI(tokenID, metaDataURI);

        emit BookMinted(tokenID, author, metaDataURI);
        nextTokenID++;
    }

    function listBookForSale(uint256 tokenID, uint256 price) external {
        require(ownerOf(tokenID) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");

        bookSales[tokenID] = BookSale(price, true);
        emit BookListed(tokenID, price);
    }

    function buyBook(uint256 tokenID) external payable {
        BookSale memory sale = bookSales[tokenID];
        address seller = ownerOf(tokenID);

        require(sale.forSale, "Not for sale");
        require(msg.value == sale.price, "Incorrect ETH amount");
        require(seller != msg.sender, "Cannot buy your own book");

        bookSales[tokenID].forSale = false;

        _transfer(seller, msg.sender, tokenID);

        (bool success, ) = payable(seller).call{value: msg.value}("");
        require(success, "ETH transfer failed");

        emit BookSold(tokenID, msg.sender, msg.value);
    }

    function getBooksForSale() external view returns (uint256[] memory) {
        uint256 count;
        for (uint256 i = 0; i < nextTokenID; i++) {
            if (bookSales[i].forSale) count++;
        }

        uint256[] memory result = new uint256[](count);
        uint256 index;

        for (uint256 i = 0; i < nextTokenID; i++) {
            if (bookSales[i].forSale) {
                result[index++] = i;
            }
        }
        return result;
    }

    function getBooksOwnedBy(address bookOwner) public view returns (uint256[] memory) {
        uint256 bal = balanceOf(bookOwner);
        uint256[] memory result = new uint256[](bal);

        uint256 index;
        for (uint256 tokenId = 0; tokenId < nextTokenID; tokenId++) {
            if (_ownerOf(tokenId) == bookOwner) {
                result[index++] = tokenId;
                if (index == bal) break; 
            }
        }
        return result;
    }

    function getMyBooks() external view returns (uint256[] memory) {
        return getBooksOwnedBy(msg.sender);
    }

    function getBooksOwnedByContractOwner() external view returns (uint256[] memory) {
        return getBooksOwnedBy(owner());
    }
}
