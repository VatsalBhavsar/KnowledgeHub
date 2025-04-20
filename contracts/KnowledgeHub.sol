// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KnowledgeHub {
    struct Article {
        string title;
        string ipfsCid;
        address author;
        uint256 timestamp;
    }

    mapping(uint256 => Article) public articles;
    uint256 public articleCount;

    event ArticlePublished(uint256 id, string title, string ipfsCid, address author);

    function publishArticle(string memory _title, string memory _ipfsCid) public {
        articles[articleCount] = Article(_title, _ipfsCid, msg.sender, block.timestamp);
        emit ArticlePublished(articleCount, _title, _ipfsCid, msg.sender);
        articleCount++;
    }
}