// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

// can be used only fully merkle proof leafs
//            ABCD
//         /      \
//      AB        CD
//    /  \      /  \
//  A    B    C    D
contract MerkleProofWithExample {
    bytes32[] public hashes;

    function generateWithString(string[] memory _transactions) public {
        uint256 n = _transactions.length;

        for (uint256 i; i < n; ++i) {
            hashes.push(keccak256(abi.encodePacked(_transactions[i])));
        }

        uint256 offset = 0;

        while (n > 0) {
            for (uint256 i = 0; i < n - 1; i += 2) {
                hashes.push(
                    keccak256(
                        abi.encodePacked(
                            hashes[offset + i],
                            hashes[offset + i + 1]
                        )
                    )
                );
            }
            offset += n;
            n = n / 2;
        }
    }

    function generateWithBytes32(bytes32[] memory _transactions) public {
        uint256 n = _transactions.length;

        for (uint256 i; i < n; ++i) {
            hashes.push(_transactions[i]);
        }

        uint256 offset = 0;

        while (n > 0) {
            for (uint256 i = 0; i < n - 1; i += 2) {
                hashes.push(
                    keccak256(
                        abi.encodePacked(
                            hashes[offset + i],
                            hashes[offset + i + 1]
                        )
                    )
                );
            }
            offset += n;
            n = n / 2;
        }
    }

    function getRoot() public view returns (bytes32) {
        return hashes[hashes.length - 1];
    }

    function verify(
        bytes32[] memory _proof,
        bytes32 _root,
        bytes32 _leaf,
        uint256 _index
    ) public pure returns (bool) {
        bytes32 hash = _leaf;

        for (uint256 i = 0; i < _proof.length; ++i) {
            bytes32 proofElement = _proof[i];

            if (_index % 2 == 0) {
                hash = keccak256(abi.encodePacked(hash, proofElement));
            } else {
                hash = keccak256(abi.encodePacked(proofElement, hash));
            }

            _index = _index / 2;
        }

        return hash == _root;
    }
}
