//SPDX-License-Identifier:UNLICENSED

pragma solidity ^0.8.0;

contract TrademarkApplication {
    enum State {
        Processing,
        Approved,
        Discarded
    }
    State se;

    struct Applicant {
        uint256 token;
        address payable applicant;
        uint256 aadharNo;
        string name;
        string addr;
        string state;
        uint256 contact;
        bool signed;
        State se;
    }
    struct Trademark {
        uint256 token;
        address payable applicant;
        string trademarkName;
        string trademarkClass;
        string trademarkDescription;
        // string trademarkDesign;
        uint256 createdTime;
    }

    uint256 token = 0;
    uint256 public total_trademark = 0;
    mapping(uint256 => Applicant) public applicants;
    mapping(uint256 => Trademark) public trademarks;

    event tkn(uint256 id);

    function submitApplication(
        address _applicant,
        uint256 _aadharNo,
        string memory _name,
        string memory _address,
        string memory _state,
        uint256 _contact
    ) public payable {
        require(msg.sender != address(0));
        require(
            msg.sender == _applicant,
            "The Contract should be called by the Applicant address!"
        );
        require(_applicant != address(0), "The addresses can't be empty!");

        token++;

        applicants[token] = Applicant(
            token,
            payable(_applicant),
            _aadharNo,
            _name,
            _address,
            _state,
            _contact,
            true,
            State.Processing
        );

        emit tkn(token);
    }

    function trademarkApplication(
        uint256 _token,
        address payable _applicant,
        string memory _tName,
        string memory _tClass,
        string memory _tDesc
    ) public {
        require(msg.sender != address(0));
        require(msg.sender == _applicant, "Can be signed only by applicant");

        trademarks[_token] = Trademark(
            _token,
            payable(_applicant),
            _tName,
            _tClass,
            _tDesc,
            block.timestamp
        );

        total_trademark++;
    }

    function approve(uint256 _id) public {
        applicants[_id].se = State.Approved;
    }

    function reject(uint _id) public {
        applicants[_id].se = State.Discarded;
    }

    function getApproved(uint256 _index) public view returns (bool) {
        if (applicants[_index].se == State.Approved) {
            return true;
        } else {
            return false;
        }
    }

    function getRejected(uint256 _index) public view returns (bool) {
        if (applicants[_index].se == State.Discarded) {
            return true;
        } else {
            return false;
        }
    }

    function getSigned(uint256 _index) public view returns (bool) {
        if (applicants[_index].signed == true) {
            return true;
        } else {
            return false;
        }
    }
}
