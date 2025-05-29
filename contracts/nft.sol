// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

error NeedMoreETHSent();
error Transfer_Failed();

contract nft is ERC721URIStorage, VRFConsumerBaseV2Plus {
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);
    event NFTMinted(address indexed minter, uint256 indexed tokenId, string tokenURI);
    event randomWordsRequested(address indexed sender , uint256 indexed requestId);


    enum Breed {
        PUG1,
        PUG2,
        PUG3
    }

    uint256 private s_tokenCounter;
    string[3] private s_dogTokenUris;
    uint256 private immutable i_mintFee;
    uint256 private immutable i_subscriptionId;
    bytes32 private immutable i_keyHash;
    uint16 private immutable i_requestConfirmations;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;
    address payable i_owner;

    mapping(uint256 => address) public s_requestIdToSender;

    constructor(
        string[3] memory dogTokenUris,
        uint256 mintFee,
        uint256 subscriptionId,
        bytes32 keyHash,
        uint16 requestConfirmations,
        uint32 callbackGasLimit,
        address vfrV2Consumer
    )
        ERC721("Theophila", "THEO")
        VRFConsumerBaseV2Plus(vfrV2Consumer)
    {
        s_tokenCounter = 0;
        i_subscriptionId = subscriptionId;
        i_keyHash = keyHash;
        i_requestConfirmations = requestConfirmations;
        i_callbackGasLimit = callbackGasLimit;
        s_dogTokenUris = dogTokenUris;
        i_mintFee = mintFee;
        i_owner = payable(msg.sender);
    }

    function mintNft() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) {
            revert NeedMoreETHSent();
        }

        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_keyHash,
                subId: i_subscriptionId,
                requestConfirmations: i_requestConfirmations,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        emit randomWordsRequested(msg.sender , requestId);

        s_requestIdToSender[requestId] = msg.sender;
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] calldata _randomWords) internal override {
        emit RequestFulfilled(_requestId, _randomWords);

        address dogOwner = s_requestIdToSender[_requestId];
        uint256 newTokenId = ++s_tokenCounter;

        uint256 moddedRng = _randomWords[0] % 100;
        uint256 breedIndex = getBreedFromRng(moddedRng, getChanceArray());
        string memory finalTokenURI = s_dogTokenUris[breedIndex];

        _safeMint(dogOwner, newTokenId);
        _setTokenURI(newTokenId, finalTokenURI);

        emit NFTMinted(dogOwner, newTokenId, finalTokenURI);
    }

    function getBreedFromRng(uint256 moddedRng, uint256[3] memory chanceArray) internal pure returns (uint256) {
        uint256 cumulativeSum = 0;
        for (uint256 i = 0; i < chanceArray.length; i++) {
            cumulativeSum += chanceArray[i];
            if (moddedRng < cumulativeSum) {
                return i;
            }
        }
        return chanceArray.length - 1;
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [uint256(10), 30, 60]; // Corrected type
    }

    function withdraw() public {
        require(msg.sender == i_owner, "Not the owner");
        uint256 balance = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        if (!success) {
            revert Transfer_Failed();
        }
    }

    receive() external payable {}
    fallback() external payable {}
}