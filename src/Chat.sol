// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;
import "./interfaces/IENS.sol";

contract Chat {
    IENS ens;

    mapping(address => uint) public msgCount;

    struct Message {
        address from;
        address to;
        string message;
    }

    Message[] messages;

    constructor(address _ensAddress) {
        ens = IENS(_ensAddress);
    }

    function sendMessage(string calldata _msg, address _to) external {
        msgCount[msg.sender] += 1;
        msgCount[_to] += 1;
        messages.push(Message({from: msg.sender, to: _to, message: _msg}));
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
