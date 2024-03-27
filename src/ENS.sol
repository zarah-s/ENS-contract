// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract ENS {
    event Registered(address indexed _address, string indexed name);
    struct Info {
        string avatar;
        string name;
    }
    mapping(address => Info) addressToInfo;
    mapping(string => address) nameToAddress;

    function register(string calldata avatar, string calldata name) external {
        require(nameToAddress[name] == address(0), "NOT_AVAILABLE");
        nameToAddress[name] = msg.sender;
        Info storage _newInfo = addressToInfo[msg.sender];
        _newInfo.avatar = avatar;
        _newInfo.name = name;
        emit Registered(msg.sender, name);
    }

    function getInfo(address _address) external view returns (Info memory) {
        return addressToInfo[_address];
    }

    function getEnsAddress(
        string calldata _name
    ) external view returns (address) {
        return nameToAddress[_name];
    }
}
