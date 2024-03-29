// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract SimpleStorage {
    uint256 public favouriteNumber;
    People public person = People({favouriteNumber: 23, name: "javis"});
    mapping(string => mapping(string => string)) public nestedMap;
    struct People {
        uint256 favouriteNumber;
        string name;
    }

    struct Post {
        string id;
        string post;
        uint256 timestamp;
    }

    Post[] public posts;
    People[] public people;
    mapping(string => Post) public nameToFavouriteNumber;

    function addPerson(string memory _name, uint256 _favouriteNumber) public {
        people.push(People({favouriteNumber: _favouriteNumber, name: _name}));
    }

    function addPost(
        string memory _id,
        string memory _post,
        uint256 _timestamp
    ) public {
        Post memory newPost = Post({
            id: _id,
            post: _post,
            timestamp: _timestamp
        });

        posts.push(newPost);
        nameToFavouriteNumber[_id] = newPost;
    }

    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory newPosts = posts;
        return newPosts;
    }

    function addToNestedMapping() external {
        nestedMap["users"]["id"] = "uuid";
    }

    function storeNumber(uint256 _favouriteNumber) public virtual {
        favouriteNumber = _favouriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favouriteNumber;
    }
}
