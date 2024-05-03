// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

contract Stock {
    mapping(string name => uint256 value) public stocks;

    uint256 public limitStock;
    address public owner;

    event SetStock(string name, uint256 value);

    error ExcessLimitStock(string name, uint256 value);

    constructor(uint256 _limitStock) {
        limitStock = _limitStock;
        owner = msg.sender;
    }

    function setStock(string memory _name, uint256 _value) external {
        require(msg.sender == owner, "You aren't the owner");

        if (_value > limitStock) {
            revert ExcessLimitStock(_name, _value);
        }

        stocks[_name] = _value;

        emit SetStock(_name, _value);
    }
}
