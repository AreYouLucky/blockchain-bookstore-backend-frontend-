// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenID;

    struct Book {
        uint256 tokenId;
        address owner;
        uint256 price;
        bool forSale;
        string tokenURI;
    }

    mapping(uint256 => uint256) public bookPrices;
    mapping(uint256 => bool) public isForSale;

    event BookMinted(
        uint256 indexed tokenID,
        address indexed author,
        string metaData
    );
    event BookListed(uint256 indexed tokenID, uint256 price);
    event BookSold(
        uint256 indexed tokenID,
        address indexed buyer,
        uint256 price
    );

    constructor() ERC721("BookNFT", "BOOK") Ownable(msg.sender) {}

    function mintBook(
        address author,
        string memory metaDataURI
    ) external onlyOwner {
        uint256 tokenID = nextTokenID;

        _safeMint(author, tokenID);
        _setTokenURI(tokenID, metaDataURI);
        isForSale[tokenID] = false;

        emit BookMinted(tokenID, author, metaDataURI);
        nextTokenID++;
    }

    function unlistBook(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(isForSale[tokenId], "Book not listed");

        isForSale[tokenId] = false;
        bookPrices[tokenId] = 0;
    }

    function sellBook(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");

        bookPrices[tokenId] = price;
        isForSale[tokenId] = true;

        emit BookListed(tokenId, price);
    }

    function buyBook(uint256 tokenId) external payable {
        require(isForSale[tokenId], "Book not for sale");

        uint256 price = bookPrices[tokenId];
        address seller = ownerOf(tokenId);

        require(msg.value == price, "Incorrect ETH sent");
        require(seller != msg.sender, "Cannot buy your own book");

        (bool success, ) = payable(seller).call{value: msg.value}("");
        require(success, "ETH transfer failed");
        _transfer(seller, msg.sender, tokenId);
        isForSale[tokenId] = false;
        bookPrices[tokenId] = 0;

        emit BookSold(tokenId, msg.sender, price);
    }

    function getAllBooks() external view returns (Book[] memory) {
        Book[] memory books = new Book[](nextTokenID);

        for (uint256 i = 0; i < nextTokenID; i++) {
            books[i] = Book({
                tokenId: i,
                owner: ownerOf(i),
                price: bookPrices[i],
                forSale: isForSale[i],
                tokenURI: tokenURI(i)
            });
        }

        return books;
    }

    function getOwnedBooks(address user) external view returns (Book[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < nextTokenID; i++) {
            if (ownerOf(i) == user) {
                count++;
            }
        }

        Book[] memory books = new Book[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < nextTokenID; i++) {
            if (ownerOf(i) == user) {
                books[index] = Book({
                    tokenId: i,
                    owner: user,
                    price: bookPrices[i],
                    forSale: isForSale[i],
                    tokenURI: tokenURI(i)
                });
                index++;
            }
        }

        return books;
    }

    function getBooksForSale() external view returns (Book[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < nextTokenID; i++) {
            if (isForSale[i]) {
                count++;
            }
        }

        Book[] memory books = new Book[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < nextTokenID; i++) {
            if (isForSale[i]) {
                books[index] = Book({
                    tokenId: i,
                    owner: ownerOf(i),
                    price: bookPrices[i],
                    forSale: true,
                    tokenURI: tokenURI(i)
                });
                index++;
            }
        }

        return books;
    }
}
