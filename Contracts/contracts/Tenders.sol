//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

contract Tenders {
    uint public totalTenders = 0;
    uint tenderToken = 0;
    uint bidderToken = 0;

    struct TenderDetails {
        uint tenderId;
        string organizationChain;
        string tenderTitle;
        string workDescription;
        string tenderCategory;
        string preQualification;
        string location;
        uint tenderBudget;
        uint bidValidity;
        uint periodOfWork;
        bool tendorClosed;
        address wonBidderId;
        //add winning bid
    }

    struct BidderDetails {
        uint tenderId;
        uint bidderId;
        address applicant;
        string companyLicenseName;
        string companyRegistrationNumber;
        string registeredAddress;
        uint pin;
        string legalStatus;
        uint proposedBudget;
        string scopeandapproach;
        string prevprojandqualification;
        uint256 wonTenderId;
    }

    mapping(uint256 => TenderDetails) public tenderDetails;
    mapping(uint256 => BidderDetails[]) public bidderDetails;
    event ApplicationSubmitted(uint256 indexed token);
    event winningBid(uint applicant);

    function tendorData(
        string memory _organizationChain,
        string memory _tenderTitle,
        string memory _workDescription,
        string memory _tenderCategory,
        string memory _preQualification,
        string memory _location,
        uint _tenderBudget,
        uint _bidValidity,
        uint _periodOfWork
    ) public returns (uint256) {
        tenderToken++;
        tenderDetails[tenderToken] = TenderDetails(
            tenderToken,
            _organizationChain,
            _tenderTitle,
            _workDescription,
            _tenderCategory,
            _preQualification,
            _location,
            _tenderBudget,
            _bidValidity,
            _periodOfWork,
            false,
            0x0000000000000000000000000000000000000000
        );
        totalTenders++;
        emit ApplicationSubmitted(tenderToken);
        return tenderToken;
    }

    function bidderData(
        uint _tenderId,
        address _applicant,
        string memory _companyLicenseName,
        string memory _companyRegistrationNumber,
        string memory _registeredAddress,
        uint _pin,
        string memory _legalStatus,
        uint _proposedBudget,
        string memory _scopeandapproach,
        string memory _stringprevprojandqualification
    ) public {
        require(msg.sender != address(0), "The Address should not be empty.");
        require(
            msg.sender == _applicant,
            "The Contract should be called by the Applicant address!"
        );
        require(
            _applicant != address(0),
            "The metamask address can't be empty!"
        );
        require(_tenderId != 0, "Please enter the tender id.");
        require(
            tenderDetails[_tenderId].tendorClosed == false,
            "Tender closed"
        );

        bidderToken++;
        BidderDetails memory newBid = BidderDetails(
            _tenderId,
            bidderToken,
            _applicant,
            _companyLicenseName,
            _companyRegistrationNumber,
            _registeredAddress,
            _pin,
            _legalStatus,
            _proposedBudget,
            _scopeandapproach,
            _stringprevprojandqualification,
            0
        );
        // bidderDetails[bidderToken] = BidderDetails(_tenderId,bidderToken,_applicant,_companyLicenseName,_companyRegistrationNumber,_registeredAddress,_pin,_legalStatus,_proposedBudget,_scopeandapproach,_stringprevprojandqualification,true);
        bidderDetails[_tenderId].push(newBid);
    }

    function closeTender(uint256 _tenderId) public {
        // require(tenderDetails[_tenderId].tenderOwner == msg.sender, "Only tender owner can close the tender");
        require(
            tenderDetails[_tenderId].tendorClosed == false,
            "Tender already closed"
        );
        require(bidderDetails[_tenderId].length > 0, "No bids submitted");
        tenderDetails[_tenderId].tendorClosed = true;
    }

    // function getWinningBid(uint256 _tenderId) public returns (uint256) {
    //     require(
    //         tenderDetails[_tenderId].tendorClosed == true,
    //         "Tender not closed"
    //     );
    //     require(bidderDetails[_tenderId].length > 0, "No bids submitted");
    //     uint256 winningBidAmount = 0;
    //     uint256 _applicant;
    //     for (uint256 i = 0; i < bidderDetails[_tenderId].length; i++) {
    //         if (bidderDetails[_tenderId][i].proposedBudget > winningBidAmount) {
    //             winningBidAmount = bidderDetails[_tenderId][i].proposedBudget;
    //             _applicant = bidderDetails[_tenderId][i].bidderId;
    //         }
    //     }
    //     emit winningBid(_applicant);
    //     return (_applicant);
    // }

    function totalBidders(uint _tenderid) public view returns (uint) {
        return bidderDetails[_tenderid].length;
    }

    function assignTender(
        uint _tenderId,
        uint _bidderId,
        address _wonBidder
    ) public {
        require(
            tenderDetails[_tenderId].tendorClosed == true,
            "Tender not closed"
        );
        require(bidderDetails[_tenderId].length > 0, "No bids submitted");
        for (uint256 i = 0; i < bidderDetails[_tenderId].length; i++) {
            if (bidderDetails[_tenderId][i].bidderId == _bidderId) {
                bidderDetails[_tenderId][i].wonTenderId = _tenderId;
                tenderDetails[_tenderId].wonBidderId = _wonBidder;
                break;
            }
        }
    }
}
