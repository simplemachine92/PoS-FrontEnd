pragma solidity >=0.8.0 <0.9.0;

//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GreenPill_Pages is ERC721, Ownable {
    /*///////////////////////////////////////////////////////////////
                              EVENTS
    //////////////////////////////////////////////////////////////*/

    // Don't forget, bub.

    /*///////////////////////////////////////////////////////////////
                           EIP-712 STORAGE
    //////////////////////////////////////////////////////////////*/

    /* address public constant morpheus =
        0xb010ca9Be09C382A9f31b79493bb232bCC319f01; */

    address oneder = 0xb010ca9Be09C382A9f31b79493bb232bCC319f01;

    /* bytes32 internal immutable EIP712DOMAIN; */

    // Prevent replay
    mapping(uint256 => bool) private usedNonces;

    /*///////////////////////////////////////////////////////////////
                              STRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() ERC721("GreenPill Pages", "GP") {
        transferOwnership(0xb010ca9Be09C382A9f31b79493bb232bCC319f01);

        /* EIP712DOMAIN = computeDomain(); */
    }

    /*///////////////////////////////////////////////////////////////
                               LOGIC
    //////////////////////////////////////////////////////////////*/

    //prettier-ignore
    function executeSetIfSignatureMatch(
        bytes memory _signature,
        address sender,
        uint256 sigNumber,
        uint256 timestamp
    ) external view returns (bool) {
        /* require(!usedNonces[_nonce]);
        usedNonces[_nonce] = true; */

        (uint8 v, bytes32 r, bytes32 s) = splitSignature(_signature);

        bytes32 eip712DomainHash = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("GreenPill_Pages")),
                keccak256(bytes("0")),
                block.chainid,
                address(this)
            )
        );

        // msg.sender isn't working here... address literals are fine
        bytes32 hashStruct = keccak256(
            abi.encode(
                keccak256("signature(address sender,address recipient,uint sig_number,uint timestamp)"),
                sender,
                oneder,
                sigNumber,
                timestamp
            )
        );

        bytes32 hash = keccak256(
            abi.encodePacked("\x19\x01", eip712DomainHash, hashStruct)
        );
        address signer = ecrecover(hash, v, r, s);
        require(signer == sender, "MyFunction: invalid signature");
        require(signer != address(0), "ECDSA: invalid signature");

        return (true);
    }

    /*///////////////////////////////////////////////////////////////
                             SIG LOGIC
    //////////////////////////////////////////////////////////////*/

    /* function computeDomain() internal view virtual returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    keccak256(
                        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                    ),
                    keccak256(bytes("GreenPill Pages")),
                    keccak256(bytes("0")),
                    block.chainid,
                    address(this)
                )
            );
    } */

    function splitSignature(bytes memory sig)
        private
        pure
        returns (
            uint8 v,
            bytes32 r,
            bytes32 s
        )
    {
        require(sig.length == 65);

        assembly {
            // first 32 bytes, after the length prefix.
            r := mload(add(sig, 32))
            // second 32 bytes.
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes).
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }
}
