// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

// https://cs.stackexchange.com/questions/128774/merkle-tree-sorting-leaves-and-pairs
contract MerkleProofWithZeppelin {
    using MerkleProof for bytes32[];

    bytes32 public root;

    event ReceiveReward(address indexed account, uint256 amount);

    error InvalidProof(address account, uint256 amount);

    constructor(bytes32 _root) {
        root = _root;
    }

    function receiveReward(
        bytes32[] calldata _proof,
        uint256 _amount
    ) external {
        // leaf can also use keccak256(abi.encodePacked(msg.sender, _amount)), it depends on the implementation
        // using bytes.concat for double-keccak256
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, _amount)))
        );

        if (!_proof.verifyCalldata(root, leaf)) {
            revert InvalidProof(msg.sender, _amount);
        }

        emit ReceiveReward(msg.sender, _amount);
    }
}
