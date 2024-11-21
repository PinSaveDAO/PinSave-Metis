// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PinSave is ERC721 {
    bool internal locked;
    address public owner;
    uint public mintingFee;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    struct Post {
      string cid;
      address author;
    }

    Post latestPost;
    uint256 public totalSupply;
    mapping(uint256 => Post) public postByTokenId;

    constructor(
        string memory _name,
        string memory _symbol,
        address _owner
    ) ERC721(_name, _symbol)  {
      owner = _owner;
    }

    function setOwner(address _owner) external {
        require(msg.sender == owner, 'FORBIDDEN');
        owner = _owner;
    }

    function changeFee(uint newFee) external {
        require(msg.sender == owner, 'FORBIDDEN');
        mintingFee = newFee;
    }

    function withdrawFees() external {
        require(msg.sender == owner, "Only admin can withdraw fees");
        uint amount = address(this).balance;
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Failed to send fees");
    }

    function createPost(address receiver, string memory _cid) payable public noReentrant {
        require(msg.value >= mintingFee, "Insufficient fee");
        latestPost.cid = _cid;
        latestPost.author = msg.sender;
        postByTokenId[totalSupply] = latestPost;

        _mint(receiver, ++totalSupply);
    }

    function createBatchPosts(
        address to,
        string[] memory _cid
    ) public {
        uint256 len = _cid.length;
        for (uint256 i; i != len;) {
          createPost(to, _cid[i]);
          unchecked{++i;}
        }
    }

    function getPostOwner(uint id) external view returns(address){
      return ownerOf(id);
    }

    function getPostCid(uint id) external view returns(string memory){
      return postByTokenId[id-1].cid;
    }

    function getPostAuthor(uint id) public view returns(address){
      return postByTokenId[id-1].author;
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

}