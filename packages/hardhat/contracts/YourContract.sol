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
        uint160 receiver;
        string sigNum;
        string stamp;
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
            "signature(address sender,address recipient,uint sig_number,uint timestamp,string msg)"
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
        uint256 sigNumber,
        uint256 timestamp,
        string memory message
    ) external {
        require(balanceOf(msg.sender) < 1, "One per Address");

        /* require(!usedNonces[_nonce]);
        usedNonces[_nonce] = true; */

        uint160 cAddress = uint160(msg.sender);

        //string memory sAddress = toAsciiString(msg.sender);

        (uint8 v, bytes32 r, bytes32 s) = splitSignature(_signature);

        bytes32 hashStruct = keccak256(
            abi.encode(
                AUTOGRAPH_TYPEHASH,
                // Will be wockis address in live v
                oneder,
                // Signature will be invalid if it isn't to caller
                // EIP712: "Addresses are encoded as uint160"
                cAddress,
                sigNumber,
                timestamp,
                // EIP712: "values bytes and string are encoded as a keccak256 hash"
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
                receiver: cAddress,
                sigNum: sigNumber.toString(),
                stamp: timestamp.toString(),
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
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 750" class="eUO0AJ6Hus" xmlns:xlink="http://www.w3.org/1999/xlink">',
                '<foreignObject x="0" y="0" width="750" height="750">',
                '<div xmlns="http://www.w3.org/1999/xhtml">',
                '<style>svg.eUO0AJ6Hus,svg.eUO0AJ6Hus *{box-sizing:border-box;margin:0;padding:0;border:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-wrap:break-word;overflow:hidden}</style>',
                '<div style="background-image:url(https://ipfs.io/ipfs/QmbNJsPMxvdq8UDFDPRsUsqg7sPRG636GtuDJCe7Loin1r);position:absolute;top:0px;right:0px;width:100%;height:100%;"/>',
                '<div style="position:absolute;top:20px;left:10px;width:100%;height:100%;font-size:20px;line-height:38px;padding:80px;font-family:&#39;Abel&#39;,sans-serif;white-space:pre-wrap">',
                '{',
                '"name": GreenPill_Pages,',
                '"signer": 0x00de4b13153673bcae2616b67bf822500d325fc3,',
                '"recipient": ',
                tokens[id].receiver,
                ',',
                '"timestamp": ',
                tokens[id].stamp,
                ',',
                '"version": 0,',
                '"msg": ',
                tokens[id].writtenMsg,
                ',',
                '</div><div style="position:absolute;background:rgba(0,0,0,.3);bottom:0;width:100%;height:100px;z-index:1;color:#fff;padding:0 35px;font-size:26px;line-height:1;font-weight:700;display:flex;align-items:center;justify-content:space-between;font-family:Helvetica,Arial,sans-serif"><span>SIG# 1</span><div style="display:flex;flex-direction:column;font-weight:lighter;text-align:right;flex-shrink:0;font-size:14px;gap:1px;height:100%;justify-content:center"><span>Minted at: 2022-01-13 01:01:04 AM UTC</span><span>By: 0xc2172a6315c1d7f6855768f843c420ebb36eda97</span></div></div></div></foreignObject></svg>'
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
                                tokens[cID].receiver,
                                '", "signature_num":"',
                                tokens[cID].sigNum,
                                '", "sig_timestamp":"',
                                tokens[cID].stamp,
                                '", "message":"',
                                tokens[cID].writtenMsg,
                                '", "image": "',
                                "data:image/svg+xml;base64,",
                                pageSVG,
                                '"}'

                                /* uint256 sigNum;
                                uint256 stamp;
                                string writtenMsg; */
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
