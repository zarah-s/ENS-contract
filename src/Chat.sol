// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;
import "./interfaces/IENS.sol";

contract Chat {
    IENS ens;
    address immutable relayer;
    mapping(address => uint) public msgCount;

    struct Message {
        address from;
        address to;
        string message;
    }

    Message[] messages;

    constructor(address _ensAddress, address _relayer) {
        ens = IENS(_ensAddress);
        relayer = _relayer;
    }

    function sendMessage(
        address _from,
        address _to,
        string calldata _msg
    ) external {
        require(msg.sender == relayer, "THREAT_DETECTED");
        msgCount[_from] += 1;
        msgCount[_to] += 1;
        messages.push(Message({from: _from, to: _to, message: _msg}));
    }

    function getUserMessages() external view returns (Message[] memory) {
        Message[] memory l = new Message[](msgCount[msg.sender]);
        uint _count = 0;
        for (uint i = 0; i < messages.length; i++) {
            if (
                messages[i].from == msg.sender || messages[i].to == msg.sender
            ) {
                l[_count] = messages[i];
                _count++;
            }
        }
        return l;
    }
}
