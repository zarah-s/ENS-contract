// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
// import "forge-std/Test.sol";
import {Test, console} from "forge-std/Test.sol";
import {ENS} from "../src/ENS.sol";

contract ENSTest is Test {
    ENS ens;
    address A = address(0xa);

    function setUp() public {
        ens = new ENS();
        A = mkaddr("address a");
    }

    function testRevertIfNameNotAvailable() public {
        ens.register("https://ipfs.io/sdfasdfasd", "zarah.eth");
        vm.expectRevert("NOT_AVAILABLE");
        ens.register("https://ipfs.io/sdfasdfasd", "zarah.eth");
    }

    function testStateChange() public {
        switchSigner(A);
        ens.register("https://ipfs.io/sdfasdfasd", "zarah.eth");
        ENS.Info memory _ensInfo = ens.getInfoFromAddress(A);
        // ENS.Info memory ensAddress = ens.getInfoFromName("zarah.eth");
        assertEq(_ensInfo.name, "zarah.eth");
        assertEq(_ensInfo.avatar, "https://ipfs.io/sdfasdfasd");
        // assertEq(ensAddress, A);
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
