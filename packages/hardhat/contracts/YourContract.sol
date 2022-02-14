pragma solidity >=0.8.0 <0.9.0;

//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {Base64} from "base64-sol/base64.sol";

contract ProofOfStake_Pages is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    /*///////////////////////////////////////////////////////////////
                            TOKEN STORAGE
    //////////////////////////////////////////////////////////////*/

    Counters.Counter private _tokenIds;

    uint256 public price = 0.0001337 ether;

    uint256 public constant pledgeLimitPerUser = 1;

    mapping(address => uint256) public pledgeLimit;

    address immutable gitcoin = 0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6;

    //address[] public pledgers;

    struct Token {
        string recipient;
        string sigValue;
        string timestamp;
        string writtenMsg;
    }

    Token[] private tokens;

    /*///////////////////////////////////////////////////////////////
                               EVENTS
    //////////////////////////////////////////////////////////////*/

    event Pledge(address indexed pledgee, uint256 indexed pledgeValue);

    /*///////////////////////////////////////////////////////////////
                           EIP-712 STORAGE
    //////////////////////////////////////////////////////////////*/

    address one = 0xb010ca9Be09C382A9f31b79493bb232bCC319f01;

    uint256 internal immutable INITIAL_CHAIN_ID;

    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;

    bytes32 public constant AUTOGRAPH_TYPEHASH =
        keccak256(
            "signature(address sender,address recipient,string pledge,string timestamp,string msg)"
        );

    // Prevent replay
    mapping(uint256 => bool) private usedNonces;

    /*///////////////////////////////////////////////////////////////
                              STRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() ERC721("Proof Of Stake Pages", "PoSp") {
        transferOwnership(0xb010ca9Be09C382A9f31b79493bb232bCC319f01);

        INITIAL_CHAIN_ID = block.chainid;
        INITIAL_DOMAIN_SEPARATOR = computeDomainSeparator();
    }

    /*///////////////////////////////////////////////////////////////
                             MINT LOGIC
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Pledges ETH to GTC & "whitelists" pledger
     */
    function pledge() public payable {
        require(
            pledgeLimit[msg.sender] < pledgeLimitPerUser,
            "One pledge per address"
        );
        require(msg.value >= price);

        (bool success, ) = gitcoin.call{value: msg.value}("");
        require(success, "could not send");

        pledgeLimit[msg.sender] = pledgeLimit[msg.sender] + 1;
        //pledgers.push(msg.sender);

        emit Pledge(msg.sender, msg.value);
    }

    /**
     * @notice Allows a single mint if msg.sender has a valid signed msg
     */
    //prettier-ignore
    function mintIfSigned(
        bytes calldata _signature,
        string calldata _sigValue,
        string calldata _timestamp,
        string calldata _message
    ) external {
        require(balanceOf(msg.sender) < 1, "One per Address");

        /* require(!usedNonces[_nonce]);
        usedNonces[_nonce] = true; */

        //test

        (uint8 v, bytes32 r, bytes32 s) = splitSignature(_signature);

        bytes32 hashStruct = keccak256(
            abi.encode(
                AUTOGRAPH_TYPEHASH,
                // Will be wockis address in live v
                one,
                // Signature will be invalid if it isn't to caller
                // EIP712: "Addresses are encoded as uint160"
                uint160(msg.sender),
                // EIP712: "values bytes and string are encoded as a keccak256 hash"
                keccak256(bytes(_sigValue)),
                keccak256(bytes(_timestamp)),
                keccak256(bytes(_message))
            )
        );

        bytes32 hash = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR(), hashStruct)
        );
        address signer = ecrecover(hash, v, r, s);

        // Will be wockis address in live v
        require(signer == one, "MyFunction: invalid signature");
        require(signer != address(0), "ECDSA: invalid signature");

        _tokenIds.increment();
        uint256 id = _tokenIds.current();

        tokens.push(
            Token({
                recipient: toAsciiString(msg.sender),
                sigValue: _sigValue,
                timestamp: _timestamp,
                writtenMsg: _message
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
                '<svg xmlns="http://www.w3.org/2000/svg" width="8.42in" height="11.38in" viewBox="0 0 606.27 819.53">',
                '<defs><style>.a{fill:none;stroke:#d9c8db;stroke-miterlimit:10;stroke-width:2px;}.b{font-size:60px;fill:#e96b5d;}.b,.q{font-family:BodoniSvtyTwoOSITCTT-Bold, "Bodoni 72 Oldstyle";font-weight:700;}.c,.e,.h,.j,.k,.s,.t{letter-spacing:0.02em;}.d,.l,.q{fill:#9b4a8d;}.d{letter-spacing:0.02em;}.e{fill:#9b4a8c;}.f,.g,.h,.o{fill:#0cb6ea;}.f,.g{font-size:55px;font-family:BodoniSvtyTwoOSITCTT-BookIt, "Bodoni 72 Oldstyle";font-weight:400;font-style:italic;}.f{letter-spacing:0.02em;}.i,.k{fill:#50ae58;}.i,.r,.u,.v{letter-spacing:0.02em;}.j,.m{fill:#f18a14;}.n,.r,.t{fill:#336d36;}.p{fill:#6d302c;}.q{font-size:30px;}.s,.u{fill:#000;}</style></defs><rect class="a" x="21.87" y="169.54" width="562.52" height="562.52"/><text class="b" transform="translate(74.59 50.94)"><tspan class="c">P</tspan><tspan class="d" x="35.04" y="0">R</tspan><tspan class="c" x="74.46" y="0">O</tspan><tspan class="d" x="118.26" y="0">O</tspan><tspan class="e" x="162.06" y="0">F </tspan><tspan class="f" x="207.24" y="0">o</tspan><tspan class="g" x="233.75" y="0">f</tspan><tspan class="h" x="248.54" y="0" xml:space="preserve"></tspan><tspan class="i" x="269.06" y="0">ST</tspan><tspan class="j" x="336.38" y="0">AK</tspan><tspan class="k" x="420.86" y="0">E</tspan></text><polygon class="l" points="302.87 85.41 301.8 89.02 301.8 193.94 302.87 195 351.57 166.21 302.87 85.41"/><polygon class="m" points="302.87 85.41 254.17 166.21 302.87 195 302.87 144.08 302.87 85.41"/><polygon class="n" points="302.87 204.22 302.27 204.95 302.27 242.32 302.87 244.07 351.6 175.45 302.87 204.22"/><polygon class="o" points="302.87 244.07 302.87 204.22 254.17 175.45 302.87 244.07"/><polygon class="p" points="302.87 195 351.56 166.21 302.87 144.08 302.87 195"/><polygon class="l" points="254.17 166.21 302.87 195 302.87 144.08 254.17 166.21"/><text class="q" transform="translate(184.82 767.07)">S<tspan class="j" x="14.88" y="0">e</tspan><tspan class="c" x="28.68" y="0">v</tspan><tspan class="r" x="41.64" y="0">en</tspan><tspan class="s" x="72.33" y="0"> </tspan><tspan class="c" x="77.46" y="0">S</tspan><tspan class="h" x="92.94" y="0">to</tspan><tspan class="j" x="118.86" y="0">ri</tspan><tspan class="t" x="140.76" y="0">es</tspan><tspan class="u" x="165.78" y="0"> </tspan><tspan class="c" x="170.91" y="0">P</tspan><tspan class="t" x="188.43" y="0">re</tspan><tspan class="j" x="214.79" y="0">s</tspan><tspan class="v" x="226.01" y="0">s</tspan></text>',
                '<text transform="translate(75 352.85)" font-size="16" font-family="ArialMT, Arial">{<tspan x="0" y="28.8">"signer": 0xDDF369C3bf18b1B12EA295d597B943b955eF4671,</tspan>',
                '<tspan x="0" y="57.6">"timestamp": ',
                tokens[id].timestamp,
                ',</tspan><tspan x="0" y="86.4" xml:space="preserve">"recipient": 0x',
                tokens[id].recipient,
                ',</tspan><tspan x="0" y="115.2">"pledge": ',
                tokens[id].sigValue,
                ' ETH,</tspan><tspan x="0" y="144">"version": 0,</tspan><tspan x="0" y="172.8">},</tspan><tspan x="0" y="230.4">"msg": ',
                tokens[id].writtenMsg,
                '</tspan></text></svg>'
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
                                '{"signed_to":"0x',
                                tokens[cID].recipient,
                                '", "timestamp":"',
                                tokens[cID].timestamp,
                                '", "pledge":"',
                                tokens[cID].sigValue,
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

    /**
     * @notice https://eips.ethereum.org/EIPS/eip-712
     */
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
                    keccak256(bytes("ProofOfStake_Pages")),
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
