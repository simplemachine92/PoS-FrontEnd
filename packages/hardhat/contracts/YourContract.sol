pragma solidity >=0.8.0 <0.9.0;

//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {Base64} from "base64-sol/base64.sol";

contract GreenPill_Pages is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    /*///////////////////////////////////////////////////////////////
                            TOKEN STORAGE
    //////////////////////////////////////////////////////////////*/

    Counters.Counter private _tokenIds;

    struct Token {
        string recipient;
        string sigNum;
        string timestamp;
        string writtenMsg;
    }

    Token[] private tokens;

    /*///////////////////////////////////////////////////////////////
                               EVENTS
    //////////////////////////////////////////////////////////////*/

    // Don't forget, bub.

    /*///////////////////////////////////////////////////////////////
                           EIP-712 STORAGE
    //////////////////////////////////////////////////////////////*/

    address oneder = 0xb010ca9Be09C382A9f31b79493bb232bCC319f01;

    uint256 internal immutable INITIAL_CHAIN_ID;

    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;

    bytes32 public constant AUTOGRAPH_TYPEHASH =
        keccak256(
            "signature(address sender,address recipient,string sig_number,string timestamp,string msg)"
        );

    // Prevent replay
    mapping(uint256 => bool) private usedNonces;

    /*///////////////////////////////////////////////////////////////
                              STRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() ERC721("GreenPill Pages", "GP") {
        transferOwnership(0xb010ca9Be09C382A9f31b79493bb232bCC319f01);

        INITIAL_CHAIN_ID = block.chainid;
        INITIAL_DOMAIN_SEPARATOR = computeDomainSeparator();
    }

    /*///////////////////////////////////////////////////////////////
                             MINT LOGIC
    //////////////////////////////////////////////////////////////*/

    //prettier-ignore
    function mintIfSigned(
        bytes memory _signature, 
        string memory sigNumber,
        string memory _timestamp,
        string memory message
    ) external {
        require(balanceOf(msg.sender) < 1, "One per Address");

        /* require(!usedNonces[_nonce]);
        usedNonces[_nonce] = true; */

        (uint8 v, bytes32 r, bytes32 s) = splitSignature(_signature);

        bytes32 hashStruct = keccak256(
            abi.encode(
                AUTOGRAPH_TYPEHASH,
                // Will be wockis address in live v
                oneder,
                // Signature will be invalid if it isn't to caller
                // EIP712: "Addresses are encoded as uint160"
                uint160(msg.sender),
                // EIP712: "values bytes and string are encoded as a keccak256 hash"
                keccak256(bytes(sigNumber)),
                keccak256(bytes(_timestamp)),
                keccak256(bytes(message))
            )
        );

        bytes32 hash = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR(), hashStruct)
        );
        address signer = ecrecover(hash, v, r, s);

        // Will be wockis address in live v
        require(signer == oneder, "MyFunction: invalid signature");
        require(signer != address(0), "ECDSA: invalid signature");

        _tokenIds.increment();
        uint256 id = _tokenIds.current();

        tokens.push(
            Token({
                recipient: toAsciiString(msg.sender),
                sigNum: sigNumber,
                timestamp: _timestamp,
                writtenMsg: message
            })
        );

            _mint(msg.sender, id);
    }

    /*///////////////////////////////////////////////////////////////
                             TOKEN URI
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Generate SVG using tParams by index
     */
    function generateSVG(uint256 id) private view returns (string memory) {
        // prettier-ignore

        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 750" class="eUO0AJ6Hus" xmlns:xlink="http://www.w3.org/1999/xlink"><foreignObject x="0" y="0" width="750" height="750"><div xmlns="http://www.w3.org/1999/xhtml"><style>svg.eUO0AJ6Hus,svg.eUO0AJ6Hus *{box-sizing:border-box;margin:0;padding:0;border:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-wrap:break-word;overflow:hidden}</style>',
                '<div style="position:absolute;top:20px;left:10px;width:100%;height:100%;font-size:20px;line-height:38px;padding:80px;font-family:&#39;Abel&#39;,sans-serif;white-space:pre-wrap">',
                '<svg xmlns="http://www.w3.org/2000/svg" width="199.96" height="199.96" viewBox="0 0 199.96 199.96"><circle cx="99.98" cy="99.98" r="99.48" fill="#f6cf46" stroke="#000" stroke-miterlimit="10"/><g><path d="M247,629.4c.2,19.13,17.69,31.13,33.65,27.52,7.41-1.68,13-5.68,17.65-11.5,6.86-8.63,13.79-17.2,20.68-25.8q11.69-14.6,23.35-29.2c4.8-6,7.36-12.8,6.57-20.45-1.26-12.3-7.75-20.74-19.65-24.62-11-3.59-22.5-.09-30.22,9.09-3.18,3.79-6.21,7.71-9.31,11.57C277.8,580.84,266,595.7,254,610.49,249.53,616,246.9,622.2,247,629.4Z" transform="translate(-200.02 -499.78)" fill="#fff"/><path d="M247,629.4c-.08-7.2,2.55-13.36,7-18.91C266,595.7,277.8,580.84,289.7,566c3.1-3.86,6.13-7.78,9.31-11.57,7.72-9.18,19.21-12.68,30.22-9.09,11.9,3.88,18.39,12.32,19.65,24.62.79,7.65-1.77,14.46-6.57,20.45Q330.61,605,319,619.62c-6.89,8.6-13.82,17.17-20.68,25.8-4.61,5.82-10.24,9.82-17.65,11.5C264.67,660.53,247.18,648.53,247,629.4Zm30.71-42.21c-8.09,10.35-16.3,19.95-23.43,30.29-5,7.21-4.35,15.44-.38,23.3a11,11,0,0,0,7.62,6c10.15,2.43,18.7-.29,25.35-8.3s13.22-16.42,19.81-24.66a25.9,25.9,0,0,0,1.41-2.28ZM311.15,608c7.89-10,15.69-19.12,22.6-28.86,5.31-7.49,5.08-15.89.93-24.12a10.43,10.43,0,0,0-7.17-5.81c-10.15-2.51-18.68.1-25.4,8.09-4.83,5.74-9.42,11.69-14.11,17.56-2.27,2.84-4.52,5.71-7.06,8.92Zm-37.9,44.66c8.86.25,15.8-3.19,21.19-10.05,6-7.64,12.13-15.21,18.19-22.83a25.27,25.27,0,0,0,1.44-2.23c-1.63-2.58-2.91-1.67-4.21-.06-5,6.23-10.15,12.32-14.93,18.7-5.59,7.46-11.94,13.7-21.39,15.87C273.45,652.11,273.4,652.35,273.25,652.69ZM343,565.76c0,8.66-3.87,15.59-9.24,22-5,6-9.83,12.18-14.71,18.3-1.17,1.47-2.25,3-3.25,4.36.78,1.87,1.74,2.43,3.09,1.3a17.74,17.74,0,0,0,2.25-2.48c5.41-6.71,10.83-13.41,16.18-20.17a43,43,0,0,0,4.07-5.9A21.32,21.32,0,0,0,343,565.76Z" transform="translate(-200.02 -499.78)"/><path d="M277.69,587.19l30.38,24.36a25.9,25.9,0,0,1-1.41,2.28c-6.59,8.24-13.08,16.55-19.81,24.66s-15.2,10.73-25.35,8.3a11,11,0,0,1-7.62-6c-4-7.86-4.6-16.09.38-23.3C261.39,607.14,269.6,597.54,277.69,587.19Z" transform="translate(-200.02 -499.78)" fill="#01e2ac"/><path d="M311.15,608l-30.21-24.22c2.54-3.21,4.79-6.08,7.06-8.92,4.69-5.87,9.28-11.82,14.11-17.56,6.72-8,15.25-10.6,25.4-8.09a10.43,10.43,0,0,1,7.17,5.81c4.15,8.23,4.38,16.63-.93,24.12C326.84,588.91,319,598,311.15,608Z" transform="translate(-200.02 -499.78)" fill="#5bf1cd"/><path d="M273.25,652.69c.15-.34.2-.58.29-.6,9.45-2.17,15.8-8.41,21.39-15.87,4.78-6.38,9.95-12.47,14.93-18.7,1.3-1.61,2.58-2.52,4.21.06a25.27,25.27,0,0,1-1.44,2.23c-6.06,7.62-12.17,15.19-18.19,22.83C289.05,649.5,282.11,652.94,273.25,652.69Z" transform="translate(-200.02 -499.78)" fill="#12c094"/><path d="M343,565.76a21.32,21.32,0,0,1-1.61,17.39,43,43,0,0,1-4.07,5.9c-5.35,6.76-10.77,13.46-16.18,20.17a17.74,17.74,0,0,1-2.25,2.48c-1.35,1.13-2.31.57-3.09-1.3,1-1.35,2.08-2.89,3.25-4.36,4.88-6.12,9.67-12.31,14.71-18.3C339.13,581.35,343,574.42,343,565.76Z" transform="translate(-200.02 -499.78)" fill="#12c094"/></g></svg>',
                '<br /><br />{ <br />"signer": 0x00de4b13153673bcae2616b67bf822500d325fc3, <br />',
                '"time": ',
                tokens[id].timestamp,
                ', <br />"recipient": ',
                tokens[id].recipient,
                ', <br />',
                '"version": 0, <br />',
                '"msg": ',
                tokens[id].writtenMsg,
                ', <br />}',
                '</div></div></foreignObject></svg>'
            )
        );
    }

    /**
     * @notice Generate SVG, b64 encode it, construct an ERC721 token URI.
     */
    function constructTokenURI(uint256 id)
        private
        view
        returns (string memory)
    {
        // prettier-ignore

        uint256 cID = id - 1;

        string memory pageSVG = Base64.encode(bytes(generateSVG(cID)));

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"signed_to":"',
                                tokens[cID].recipient,
                                '", "timestamp":"',
                                tokens[cID].timestamp,
                                '", "signature_num":"',
                                tokens[cID].sigNum,
                                '", "message":"',
                                tokens[cID].writtenMsg,
                                '", "image": "',
                                "data:image/svg+xml;base64,",
                                pageSVG,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    /**
     * @notice Receives json from constructTokenURI
     */
    // prettier-ignore
    function tokenURI(uint256 id)
        public
        view
        override
        returns (string memory)
    {
        //require(id <= limit, "non-existant");
        require(_exists(id), "not exist");
        return constructTokenURI(id);
    }

    /*///////////////////////////////////////////////////////////////
                             SIG LOGIC
    //////////////////////////////////////////////////////////////*/

    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
        return
            block.chainid == INITIAL_CHAIN_ID
                ? INITIAL_DOMAIN_SEPARATOR
                : computeDomainSeparator();
    }

    function computeDomainSeparator() internal view virtual returns (bytes32) {
        return
            keccak256(
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
    }

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

    /*///////////////////////////////////////////////////////////////
                             TYPE LOGIC
    //////////////////////////////////////////////////////////////*/

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint256(uint160(x)) / (2**(8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}
