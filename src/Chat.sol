// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;
import "./interfaces/IENS.sol";

contract Chat {
    IENS ens;

    struct Profile {
        string avatar;
        string name;
    }

    struct Message {
        address from;
        address to;
        string message;
        uint timestamp;
        Profile userProfile;
    }

    mapping(address => Message[]) messages;

    constructor(address _ensAddress) {
        ens = IENS(_ensAddress);
    }

    function sendMessage(string calldata _msg, address _to) external {
        IENS.Info memory receipient = ens.getInfo(_to);
        IENS.Info memory sender = ens.getInfo(msg.sender);
        messages[_to].push(
            Message({
                from: msg.sender,
                to: _to,
                message: _msg,
                timestamp: block.timestamp,
                userProfile: Profile({
                    name: receipient.name,
                    avatar: receipient.avatar
                })
            })
        );

        messages[msg.sender].push(
            Message({
                from: msg.sender,
                to: _to,
                message: _msg,
                timestamp: block.timestamp,
                userProfile: Profile({name: sender.name, avatar: sender.avatar})
            })
        );
    }

    function getUserMessages() external view returns (Message[] memory) {
        return messages[msg.sender];
    }
}
