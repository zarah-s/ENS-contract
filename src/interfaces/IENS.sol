// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;

interface IENS {
    struct Info {
        string avatar;
        string name;
        bool valid;
        address address_;
    }

    function register(string calldata avatar, string calldata name) external;

    function getInfoFromAddress(
        address _address
    ) external view returns (Info memory);

    function getInfoFromName(
        string calldata _name
    ) external view returns (address);
}
