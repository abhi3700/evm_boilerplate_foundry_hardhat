// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Box is Initializable {
    uint256 public len;

    function initialize() external initializer {
        len = 10;
    }

    function update(uint256 _l) external {
        len = _l;
    } 
}