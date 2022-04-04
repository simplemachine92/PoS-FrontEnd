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

    bool public pledgeOpen;

    uint256 internal constant price = 0.01337 ether;

    uint256 internal constant pledgeLimitPerUser = 1;

    uint256 internal constant publisherSplit = 10;

    mapping(address => uint256) public pledgeLimit;

    //prettier-ignore
    address internal immutable gitcoin = 0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6;

    //prettier-ignore
    address internal immutable sevenStories = 0xa62bA93BeFab6bb76B8fbc732c9135460bD23D25;

    string public contractAddressString = toAsciiString(address(this));

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

    //prettier-ignore
    address internal immutable vitalik = 0xb010ca9Be09C382A9f31b79493bb232bCC319f01;

    uint256 internal immutable INITIAL_CHAIN_ID;

    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;

    bytes32 public constant AUTOGRAPH_TYPEHASH =
        keccak256(
            "signature(address sender,address recipient,string pledge,string timestamp,string msg)"
        );

    /*///////////////////////////////////////////////////////////////
                              STRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address[] memory _donors, uint256[] memory _amounts)
        ERC721("Proof Of Stake Pages", "PoSp")
    {
        transferOwnership(0xb010ca9Be09C382A9f31b79493bb232bCC319f01);

        INITIAL_CHAIN_ID = block.chainid;
        INITIAL_DOMAIN_SEPARATOR = computeDomainSeparator();

        for (uint256 i = 0; i < _donors.length; ++i) {
            pledgeLimit[_donors[i]] = pledgeLimit[_donors[i]] + 1;

            _tokenIds.increment();
            uint256 id = _tokenIds.current();

            _mint(_donors[i], id);

            tokens.push(
                Token({
                    recipient: toAsciiString(_donors[i]),
                    sigValue: _amounts[i].toString(),
                    timestamp: block.timestamp.toString(),
                    writtenMsg: ""
                })
            );

            emit Pledge(_donors[i], _amounts[i]);
        }
    }

    /*///////////////////////////////////////////////////////////////
                             PLEDGE LOGIC
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Toggles Pledging On / Off
     */
    function togglePledging() public onlyOwner {
        pledgeOpen == false ? pledgeOpen = true : pledgeOpen = false;
    }

    /**
     * @notice Pledges ETH to GTC & "whitelists" pledger
     */
    //prettier-ignore
    function pledge() public payable {
        require(
            pledgeLimit[msg.sender] < pledgeLimitPerUser,
            "One pledge per address"
        );
        require(pledgeOpen == true, "Pledging is currently closed");
        require(msg.value >= price, "Min Pledge is 0.01337 ETH");

        uint sShare = (msg.value * publisherSplit) / 100;

        (bool success, ) = gitcoin.call{value: msg.value - sShare}("");
        require(success, "could not send");

        (bool success2, ) = sevenStories.call{value: sShare}("");
        require(success2, "could not send");

        pledgeLimit[msg.sender] = pledgeLimit[msg.sender] + 1;

        _tokenIds.increment();
        uint256 id = _tokenIds.current();

        _mint(msg.sender, id);

        tokens.push(Token({
                recipient: toAsciiString(msg.sender),
                sigValue: msg.value.toString(),
                timestamp: block.timestamp.toString(),
                writtenMsg: ""
            }));

        emit Pledge(msg.sender, msg.value);
    }

    /**
     * @notice Updates the user token if we have a valid msg from Vitalik
     */
    //prettier-ignore
    function updateIfSigned(
        bytes calldata _signature,
        string calldata _sigValue,
        string calldata _timestamp,
        string calldata _message
    ) external {
        //require(balanceOf(msg.sender) < 1, "UNIQUE: One per Address");

        (uint8 v, bytes32 r, bytes32 s) = splitSignature(_signature);

        bytes32 hashStruct = keccak256(
            abi.encode(
                AUTOGRAPH_TYPEHASH,
                // Will be wockis address in live v
                vitalik,
                // Signature will be invalid if it isn't to caller &&
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

        require(signer == vitalik, "MyFunction: invalid signature");
        require(signer != address(0), "ECDSA: invalid signature");

        uint256 tokenid = tokenOfOwnerByIndex(msg.sender, 0) - 1;

        tokens[tokenid].writtenMsg = _message;
    }

    /*///////////////////////////////////////////////////////////////
                            TOKEN LOGIC
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice SOULBOUND: Block transfers.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Enumerable) {
        require(
            from == address(0) || to == address(0),
            "SOULBOUND: Non-Transferable"
        );
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @notice SOULBOUND: Block approvals.
     */
    function setApprovalForAll(address operator, bool _approved)
        public
        virtual
        override(ERC721)
    {
        revert("SOULBOUND: Non-Approvable");
    }

    /**
     * @notice SOULBOUND: Block approvals.
     */
    function approve(address to, uint256 tokenId)
        public
        virtual
        override(ERC721)
    {
        revert("SOULBOUND: Non-Approvable");
    }

    /**
     * @notice Generate SVG using tParams by index
     */
    function generateSVG(uint256 id) private view returns (bytes memory) {
        return
            bytes.concat(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="606.2" height="819.4" viewBox="0 0 606.2 819.4"><defs><style>.a{fill:#fff;}.b{fill:none;stroke:#d9c8db;stroke-miterlimit:10;stroke-width:2px;}.c,.d,.e,.f,.g,.h,.i,.j,.k,.l,.m,.n,.o{isolation:isolate;}.c,.d,.e,.f,.g,.i,.j,.k{font-size:55px;}.c,.e{fill:#e96b5d;}.c,.d,.e,.f,.g,.k{font-family:LustDisplay-Didone, Lust Didone;}.d,.f{fill:#9b4a8d;}.e{letter-spacing:0.02em;}.f{letter-spacing:0.02em;}.g{fill:#9b4a8c;}.h{font-size:45px;fill:#0cb6ea;font-family:Lust-Italic, Lust;font-style:italic;}.i,.k{fill:#50ae58;}.i,.j{font-family:Lust-Regular, Lust;letter-spacing:0.05em;}.j{fill:#ef8916;}.l,.m{font-size:29.99px;}.l,.n{font-family:Arial-BoldMT, Arial;font-weight:700;}.m,.o{font-family:ArialMT, Arial; margin-left: auto; margin-right: auto; width: 40%;}.n{font-size:20px;}.o{font-size:18px;}</style></defs><rect class="a" width="606.2" height="819.4"/><text class="n"><tspan class="n" text-anchor="middle" x="50%" y="42%">0x',
                    tokens[id].recipient,
                    '</tspan></text><text transform="translate(75 352.85)" font-size="18" font-family="ArialMT, Arial"><tspan text-anchor="middle" x="37.5%" y="200">',
                    tokens[id].timestamp,
                    "</tspan>",
                    '<tspan text-anchor="middle" x="37.5%" y="260">',
                    tokens[id].sigValue,
                    "</tspan>"
                ),
                abi.encodePacked(
                    '<tspan text-anchor="middle" x="37.5%" y="320">0x',
                    contractAddressString,
                    "</tspan>",
                    '<tspan text-anchor="middle" x="37.5%" y="120">',
                    tokens[id].writtenMsg,
                    "</tspan>",
                    '<tspan text-anchor="middle" x="37.5%" y="220">mint timestamp</tspan>',
                    '<tspan text-anchor="middle" x="37.5%" y="340">contract</tspan>',
                    '<tspan text-anchor="middle" x="37.5%" y="280">value (wei)</tspan></text>',
                    '<rect class="b" x="21.9" y="169.5" width="562.4" height="562.4"/><g style="isolation:isolate"><path d="M46.66,98.93v-.28h4.89V60.71H46.66v-.28H65.91c12,0,18.42,3.19,18.42,11.17,0,9.4-11.77,11.27-19.85,11.27h-1.6V98.65h5.83v.28ZM62.88,82.6h1.6c5.83,0,7.75-3.47,7.75-11s-1.92-10.89-7.75-10.89h-1.6Z" style="fill:#e96b5d"/></g><g style="isolation:isolate"><path d="M135,91.84c0,5.16-2.26,7.53-9.21,7.53-6.74,0-9.43-2.28-11.55-8.63C113,87,112.44,79.52,107.52,79.52h-1.6V98.65h5.28v.28H89.7v-.28h4.89V60.71H89.7v-.28H109c5.66,0,18.47.22,18.47,9.46,0,7.54-10.77,9.27-17.32,9.54v.09c10.75,0,13.94,3.52,16.58,9.15,3.33,7.12,4.13,8.17,5.53,8.17,2.2,0,2.47-3.35,2.47-5Zm-29-12.6h1.6c5.44,0,7.81-2.86,7.81-9.35,0-5.11-1.82-9.18-7.79-9.18h-1.62Z" style="fill:#9b4a8d"/></g><g style="isolation:isolate"><path d="M178.65,79.68c0,12.54-8.85,19.69-19.71,19.69s-19.72-7.15-19.72-19.69S148.07,60,158.94,60,178.65,67.14,178.65,79.68Zm-11.8,0c0-8.41-.52-19.41-7.91-19.41S151,71.27,151,79.68s.52,19.41,7.92,19.41S166.85,88.1,166.85,79.68Z" style="fill:#e96b5d"/></g><g style="isolation:isolate"><path d="M226.68,79.68c0,12.54-8.9,19.69-19.83,19.69S187,92.22,187,79.68,195.92,60,206.85,60,226.68,67.14,226.68,79.68Zm-11.87,0c0-8.41-.52-19.41-8-19.41s-8,11-8,19.41.52,19.41,8,19.41S214.81,88.1,214.81,79.68Z" style="fill:#9b4a8d"/></g><g style="isolation:isolate"><path d="M236.69,98.93v-.28h4.89V60.71h-4.89v-.28h33.93L272,73.69h-.27l-.11-1c-.8-7.56-6.82-12-14.3-12h-4.4V79.13h.61c6.18,0,10.2-2.58,10.5-7.72l.05-1h.28l-.93,17.77h-.28l.05-1c.28-5.12-3.49-7.81-9.67-7.81h-.61V98.65h5.83v.28Z" style="fill:#9b4a8c"/></g><g style="isolation:isolate"><path d="M307.71,87.38c0,7.47-6.75,14.17-14.76,14.17-6.43,0-10.89-4.27-10.89-10.21,0-7.7,6.62-14.18,14.72-14.18C303.26,77.16,307.71,81.44,307.71,87.38Zm-8.23-4.64c0-2.65-.5-5.22-2.75-5.22-5,0-6.43,13.86-6.43,18.54,0,2.66.49,5.13,2.7,5.13C298,101.19,299.48,88.05,299.48,82.74Z" style="fill:#0cb6ea"/></g><g style="isolation:isolate"><path d="M300.13,105.46a4.61,4.61,0,0,1,4.68-4.77,3.93,3.93,0,0,1,4.09,4.18,3.26,3.26,0,0,0-2.7,3.29c0,1.08.45,1.93,1.71,1.93,2.12,0,4-2.34,4-5.76,0-2.07-.67-4.32-4-5.49l3.37-22H307.6l0-.36h3.65c.31-6.7,2.52-11.88,9.18-11.88,4.5,0,6.57,2.48,6.57,5.27a4.75,4.75,0,0,1-4.82,5c-2.2,0-4-1.44-4-4.27a3.09,3.09,0,0,0,2.88-3.2c0-1.35-.58-2.29-2.07-2.29-5.31,0-6.84,11.38,1.44,11.38h3.2l0,.36h-4.27L316,98.75c-.86,5.4-3.47,12-9.77,12C302.29,110.72,300.13,108.2,300.13,105.46Z" style="fill:#0cb6ea"/></g><g style="isolation:isolate"><path d="M345.85,98.1l-4.07,1.16-.88-16h.44c.88,6.44,4.45,15.62,14.35,15.62,5,0,9-1.76,9-5.83,0-9.24-24-8.41-24-21.72C340.68,64,347.77,60,356.57,60a39.37,39.37,0,0,1,8.75,1.26l4.18-1.16.71,13.53h-.44c-.88-6.21-4.34-13.19-13.2-13.19-4.4,0-7.42,2.08-7.42,5.66,0,8.41,24,7.09,24,20.79,0,7.75-8.13,12.48-17.43,12.48A41.65,41.65,0,0,1,345.85,98.1Z" style="fill:#50ae58"/><path d="M384.62,98.93v-.44c5.72,0,6.27-3,6.27-9.46V60.88c-8.91,0-12.87,5.33-13.8,13.63h-.44l1.48-14.07H415l1.48,14.07H416c-.93-8.3-4.89-13.63-13.8-13.63V89c0,6.44.55,9.46,6.27,9.46v.44Z" style="fill:#50ae58"/></g><g style="isolation:isolate"><path d="M455.54,88.43c3.46,7.2,5.11,10.06,9.07,10.06v.44H442.18v-.44c5.22,0,4.18-4.18,1.48-9.95l-1.39-3H429.18c-4,8.38-2.59,12.92,3.43,12.92v.44H417.1v-.44c4,0,7.42-4.67,11.71-13.36l12.71-25.79ZM429.45,85H442l-6.11-13.08Z" style="fill:#ef8916"/><path d="M504.71,87.66c4.29,9.51,5.5,10.39,8.14,10.11v.45a36.94,36.94,0,0,1-8.75,1.26c-6.76,0-9.4-2.58-11.43-8.74-1.76-5.34-3.25-11.44-6.77-11.44a4.07,4.07,0,0,0-1.81.46V89c0,6.44.49,9.46,4.56,9.46v.44H467.26v-.44c5.5,0,5.5-3,5.5-9.46V70.33c0-6.65,0-9.46-5.5-9.46v-.43h21.39v.43c-4.07,0-4.56,3-4.56,9.46V79.1l7-7.67c2.36-2.53,5.39-6.16,5.39-8.41,0-1.49-1-2.15-3.63-2.15v-.43h16.66v.43c-7,0-14.68,7.32-18,10.95l-6.48,7a18,18,0,0,1,8.24-2c5.56,0,8.19,3.3,11.44,10.84Z" style="fill:#ef8916"/></g><g style="isolation:isolate"><path d="M552.2,73.69h-.28l-.11-1c-.8-7.56-6.82-12-14.3-12H532V79.13h.61c6.18,0,10.2-2.58,10.5-7.72l.06-1h.27l-.93,17.77h-.28l.06-1c.27-5.12-3.5-7.81-9.68-7.81H532V92c0,5.33.61,6.7,4.4,6.7,9.87,0,16-6.15,17.35-15l.2-1.24h.27l-2.64,16.5h-35.8v-.28h4.89V60.71h-4.89v-.27h35Z" style="fill:#50ae58"/></g><text class="l" transform="translate(235.15 265)">vitalik.eth</text> <text class="m" transform="translate(263.48 295)">signer</text> <text class="m" transform="translate(245.64 373)">recipient</text><path class="a" d="M305.5,811.7H275.7V740.8h52.4v70.9H305.7a19.66,19.66,0,0,1,1.6-4c-1,.8-2.1.6-3.2.6a1.62,1.62,0,0,1-1.4-1.6c-.1-1.2.3-1.9,1.1-2.2h2.6V806h-1.9a.55.55,0,0,0-.5.3c-.1.3.2.3.5.4a2.31,2.31,0,0,0,2.2-.7,3.92,3.92,0,0,1,1-.8c1-.5,1-1.5,1.3-2.4h-6.2v-3.2h1.5v1.6h2.2v-1.5h1.4v1.5c1.3.2,1.3.2,1.7-1,0-.1.1-.3.1-.4.2-.7.5-1.5.8-2.3l-7.7.9v-1.6l6.5-.7-6.5-.6V794h.4l7.9.9c.1,0,.4,0,.4-.1.3-.7.5-1.4.8-2.2H303v-3.2h1.4v1.7h2.2v-1.5H308v1.5h3.1v-1.6h1.4v2.6h.1l9.6-27.4-9.7-3.1c0,.5-.4.5-.7.5-1,0-2,.1-3.1.1-.4,0-.7.1-.6.6h4.3v1.6h-8.2a.76.76,0,0,0-.5.2c-.3.7-.5,1.4-.8,2.1a2.1,2.1,0,0,1,1.4-.7h6.8a1.5,1.5,0,0,1,1.4,1,4.3,4.3,0,0,1,0,1.6,1.36,1.36,0,0,1-1.5,1.2h-6.8a1.51,1.51,0,0,1-1.5-1.2,5.28,5.28,0,0,1-.1-1.3l-14,38.2.6.2,12,4.4ZM280.1,759h43.5V744.8H280.1Zm27.6,9.2h3.2c.1,0,.3-.2.4-.3-.1-.1-.3-.2-.4-.3h-6.5a.22.22,0,0,0-.2.2.37.37,0,0,0,.1.3.75.75,0,0,0,.5.1Zm1.7-7.8-4-1.2-.4,1.3c.9,0,1.9-.2,2.4,1,.4-1.1,1.2-.9,2-1.1Zm-5.1,2.3h2.5c0-.4-.1-.6-.5-.6h-1.4c-.5,0-.7.1-.6.6Z"/> <path d="M305.5,811.7l-4.2-1.6-12-4.3-.6-.2,14-38.2a6.15,6.15,0,0,0,.1,1.3,1.42,1.42,0,0,0,1.5,1.2h6.8a1.42,1.42,0,0,0,1.5-1.2,4.3,4.3,0,0,0,0-1.6,1.5,1.5,0,0,0-1.4-1h-6.8a2.1,2.1,0,0,0-1.4.7,18,18,0,0,1,.8-2.1.76.76,0,0,1,.5-.2h8.2v-1.7h-4.3c0-.5.2-.6.6-.6,1,0,2,0,3.1-.1.3,0,.7,0,.7-.5l9.7,3.1c-3.2,9.2-6.4,18.3-9.6,27.4h-.1v-2.7h-1.4V791h-3.1v-1.6h-1.5V791h-2.2v-1.7H303v3.2h9.5c-.3.8-.5,1.5-.8,2.2,0,.1-.3.1-.4.1l-7.9-.9H303v1.6l6.5.6-6.5.7v1.6l7.7-.9c-.3.8-.5,1.6-.8,2.3,0,.1-.1.3-.1.4-.4,1.2-.4,1.2-1.7,1v-1.5h-1.4v1.6h-2.3v-1.6h-1.5v3.2h6.2c-.4.9-.4,1.9-1.3,2.4a3.92,3.92,0,0,0-1,.8,2.58,2.58,0,0,1-2.2.7c-.2,0-.5,0-.5-.4a.55.55,0,0,1,.5-.3h2v-1.5H304c-.8.2-1.2,1-1.1,2.1a1.53,1.53,0,0,0,1.3,1.6c1.1.1,2.3.3,3.2-.6a19.66,19.66,0,0,0-1.6,4Zm3.9-27.3-6.2.9a.76.76,0,0,0-.4.2v2.1h9.5v-1.3h-7c.4-.1.9-.1,1.3-.2,1.8-.2,3.6-.5,5.4-.7q.15,0,.3-.3v-2h-9.6v1.3Zm-3-8.9H304a1.19,1.19,0,0,0-1.2,1,4.84,4.84,0,0,0,0,1.7,1.16,1.16,0,0,0,1.1,1,4.14,4.14,0,0,0,3.7-.9c.2-.2.4-.3.6-.5a2.86,2.86,0,0,1,2.3-.8c.3,0,.7-.2.7.3s-.5.3-.7.3h-1.9v1.6a22.55,22.55,0,0,0,2.6,0,1.49,1.49,0,0,0,1.3-1.4,1.9,1.9,0,0,0-.9-2.2,1.27,1.27,0,0,0-.6-.1,4.44,4.44,0,0,0-4,1.2c-.1.1-.2.2-.3.2a2.6,2.6,0,0,1-2.4.7.85.85,0,0,1-.5-.3c-.1-.3.2-.3.5-.3h1.9Zm-3.4-4.7v4h1.4v-1.2h8.1V772h-8.1v-1.2Z"/> <path d="M280.1,759V744.8h43.5V759Zm26.4-11v-1.6h-2.1a1.45,1.45,0,0,0-1.5,1.4c-.2,1.2.2,2.2,1,2.3a4.24,4.24,0,0,0,3.6-.6l1.4-1.1a3.1,3.1,0,0,1,2.3-.4c.2,0,.3.2.2.4a.22.22,0,0,1-.2.2h-2.3v1.5a24.32,24.32,0,0,0,2.7,0c.9-.1,1.2-.8,1.2-1.9s-.4-1.7-1.2-1.8h-.2a4.73,4.73,0,0,0-4.1,1.2c-.1.1-.3.2-.4.3a2.69,2.69,0,0,1-2.3.7c-.2,0-.5,0-.5-.3,0-.1.3-.3.5-.3Zm4.6,5.2H308v-1.6h-1.5v1.6h-2.1v-1.7H303v3.2h9.5v-3.3h-1.4Zm1.4,3.3H303V758h9.5Z"/> <path d="M307.7,768.2h-3.1a.9.9,0,0,1-.5-.1.37.37,0,0,1-.1-.3.22.22,0,0,1,.2-.2h6.6c.1.1.3.2.4.3-.1.1-.3.3-.4.3Z"/> <path d="M309.4,760.4c-.8.1-1.6,0-2,1-.5-1.2-1.5-.9-2.4-1l.4-1.3Z"/> <path d="M304.3,762.7c0-.5.1-.6.6-.6h1.4c.5,0,.6.2.5.6Z"/> <path class="a" d="M309.4,784.4h-6.5v-1.3h9.6v2q0,.15-.3.3c-1.8.2-3.6.5-5.4.7a5.85,5.85,0,0,0-1.3.2h7v1.3H303v-2.1c0-.1.2-.2.4-.2Z"/> <path class="a" d="M306.5,775.5v1.6h-1.9c-.2,0-.5,0-.5.3,0,.1.3.3.5.3a2.6,2.6,0,0,0,2.4-.7c.1-.1.2-.2.3-.2a4.19,4.19,0,0,1,4-1.2,1.42,1.42,0,0,1,.6.2,2,2,0,0,1,.9,2.2,1.49,1.49,0,0,1-1.3,1.4,22.53,22.53,0,0,1-2.6,0v-1.5h1.9c.3,0,.7.2.7-.3s-.4-.3-.7-.3a2.74,2.74,0,0,0-2.3.8c-.2.2-.4.3-.6.5a4.14,4.14,0,0,1-3.7.9,1.09,1.09,0,0,1-1.1-1,4.84,4.84,0,0,1,0-1.7,1.19,1.19,0,0,1,1.2-1A5.11,5.11,0,0,1,306.5,775.5Z"/> <path class="a" d="M303,770.8h1.4V772h8.1v1.6h-8.1v1.2H303Z"/> <path class="a" d="M306.5,748h-1.9a.55.55,0,0,0-.5.3c-.1.3.2.3.5.3a2.49,2.49,0,0,0,2.3-.7c.1-.1.3-.2.4-.3a4.45,4.45,0,0,1,4.1-1.2h.2a1.61,1.61,0,0,1,1.2,1.8c0,1-.4,1.8-1.2,1.9a24.3,24.3,0,0,1-2.7,0v-1.5h2.3c.2,0,.3-.2.2-.4a.22.22,0,0,0-.2-.2,3.1,3.1,0,0,0-2.3.4l-1.4,1.1c-1.1,1-2.4.8-3.6.6-.8-.1-1.2-1.1-1-2.3a1.45,1.45,0,0,1,1.5-1.4h2.1Z"/> <path class="a" d="M311.1,753.2v-1.7h1.4v3.3H303v-3.2h1.4v1.7h2.2v-1.6H308v1.6Z"/> <path class="a" d="M312.5,756.5V758H303v-1.5Z"/></svg>'
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
