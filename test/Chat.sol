// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Test, console} from "forge-std/Test.sol";
import {ENS} from "../src/ENS.sol";
import {Chat} from "../src/Chat.sol";

contract ChatTest is Test {
    ENS ens;
    Chat chat;
    address A = address(0xa);
    address B = address(0xb);

    function setUp() public {
        ens = new ENS();
        A = mkaddr("address a");
        B = mkaddr("address b");
        chat = new Chat(address(ens), A);
    }

    function testStateChage() public {
        switchSigner(A);
        chat.sendMessage(A, B, "Hey man");
        Chat.Message[] memory _messages = chat.getUserMessages();
        assertEq(_messages.length, 1);
        assertEq(_messages[0].message, "Hey man");
        // assertEq(_messages[0].timestamp, 1);
        assertEq(_messages[0].to, B);
        switchSigner(B);
        Chat.Message[] memory receipient_messages = chat.getUserMessages();
        assertEq(receipient_messages.length, 1);
        assertEq(receipient_messages[0].message, "Hey man");
        // assertEq(receipient_messages[0].timestamp, 1);
        assertEq(receipient_messages[0].from, A);
    }

    function mkaddr(string memory name) public returns (address) {
        address addr = address(
            uint160(uint256(keccak256(abi.encodePacked(name))))
        );
        vm.label(addr, name);
        return addr;
    }

    function switchSigner(address _newSigner) public {
        address foundrySigner = 0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38;
        if (msg.sender == foundrySigner) {
            vm.startPrank(_newSigner);
        } else {
            vm.stopPrank();
            vm.startPrank(_newSigner);
        }
    }
}
