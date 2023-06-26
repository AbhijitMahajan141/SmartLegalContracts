//SPDX-License-Identifier:UNLICENSED
//THE PATENTS ACT 1970 (39 of 1970) and THE PATENTS RULES, 2003
//types of patent utility,design,plant,complete
pragma solidity ^0.8.17;

contract NewPatent {
    enum State {
        Processing,
        Approved,
        Discarded
    }
    State se;

    address payable applicant;

    uint no_of_patent = 0;

    uint public total_patent = 0;

    struct PatentInfo {
        uint application_id;
        address payable applicant;
        string inventionTitle;
        string inventionType;
        string inventionDescription;
        // uint amount;
        uint createdTimestamp;
        State se;
    }
    struct ApplicantInfo {
        uint application_id;
        string applicantType;
        address payable applicant;
        uint256 _aadhar_no;
        string _Fname;
        string _Faddr;
        bool signed;
    }

    mapping(uint => PatentInfo) public patent_info;
    mapping(uint => ApplicantInfo) public applicant_info;

    event token(uint256 id);

    function setAgreement(
        address payable _applicant,
        string memory _applicantType,
        uint _aadharNo,
        string memory _fName,
        string memory _fAddr
    ) public {
        require(msg.sender != address(0));
        require(
            msg.sender == _applicant,
            "The Contract should be called by the Applicant address!"
        );
        require(_applicant != address(0), "The addresses can't be empty!");

        no_of_patent++;
        applicant_info[no_of_patent] = ApplicantInfo(
            no_of_patent,
            _applicantType,
            _applicant,
            _aadharNo,
            _fName,
            _fAddr,
            true
        );
        emit token(no_of_patent);
    }

    function patentData(
        uint _id,
        address payable _applicant,
        string memory _inventionTitle,
        string memory _inventionType,
        string memory _inventionDescription
    ) public {
        require(msg.sender != address(0));
        require(
            msg.sender == applicant_info[_id].applicant,
            "Can be signed only by licensor"
        );
        // address ld = agreement_info[_index].licensor;
        patent_info[_id] = PatentInfo(
            _id,
            payable(_applicant),
            _inventionTitle,
            _inventionType,
            _inventionDescription,
            block.timestamp,
            State.Processing
        );
        total_patent++;
        // if(applicant_info[_id].signed == true){
        // agreement_info[_index].se = State.Completed;
        // agreement_info[_index].licensor.transfer(agreement_info[_index].amount);
        // }
    }

    function approve(uint _id) public {
        patent_info[_id].se = State.Approved;
    }

    function reject(uint _id) public {
        patent_info[_id].se = State.Discarded;
    }

    function getApproved(uint256 _index) public view returns (bool) {
        if (patent_info[_index].se == State.Approved) {
            return true;
        } else {
            return false;
        }
    }

    function getRejected(uint256 _index) public view returns (bool) {
        if (patent_info[_index].se == State.Discarded) {
            return true;
        } else {
            return false;
        }
    }

    function getSigned(uint256 _index) public view returns (bool) {
        if (applicant_info[_index].signed == true) {
            return true;
        } else {
            return false;
        }
    }
}
