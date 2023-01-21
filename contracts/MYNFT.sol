// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MYNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    IERC20 public tokenaddress;
    uint public price = 5 * 10**18;

    bool public sold;

    Counters.Counter private _tokenIdCounter;

    constructor(address _tokenaddress) ERC721("MYNFT", "MNFT") {
        tokenaddress = IERC20(_tokenaddress);
    }

    function purchase() public {
        tokenaddress.transferFrom(msg.sender, address(this), price);
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        sold = true;
    }

    function sell() public onlyOwner {
        tokenaddress.transfer(
            msg.sender,
            tokenaddress.balanceOf(address(this))
        );
        require(sold == true, "NFT has been sold");
        sold = false;
    }
}
