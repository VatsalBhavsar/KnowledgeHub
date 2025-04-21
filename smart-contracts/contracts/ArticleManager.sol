// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArticleManager {
    struct Article {
        address author;
        string title;
        string ipfsHash;
        uint256 timestamp;
    }

    mapping(uint => Article) public articles;
    uint public articleCount;

    event ArticlePublished(
        uint indexed id,
        address indexed author,
        string title,
        string ipfsHash,
        uint256 timestamp
    );

    function publishArticle(string memory title, string memory ipfsHash) public {
        articles[articleCount] = Article(msg.sender, title, ipfsHash, block.timestamp);
        emit ArticlePublished(articleCount, msg.sender, title, ipfsHash, block.timestamp);
        articleCount++;
    }
}
