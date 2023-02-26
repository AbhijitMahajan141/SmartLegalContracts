// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

contract ShopRental {
    enum State {
        Created,
        Started,
        Terminated
    }
    State state;
    address payable landlord;
    address payable lessee;

    uint256 no_of_agreement = 0;

    struct AgreementInfo {
        uint256 agreement_id;
        address payable landlord_address;
        address payable lessee_address;
        string shopAddress;
        uint256 term;
        uint256 rent;
        uint256 rentduedate;
        uint256 timestamp;
        State state;
    }

    struct LandlordInfo {
        uint256 agreement_id;
        address payable landlord_address;
        // address payable lessee_address;
        uint256 aadhar;
        string name;
        string fathers_name;
        string addr;
        bool signed;
    }

    struct LesseeInfo {
        uint256 agreement_id;
        // address payable landlord_address;
        address payable lessee_address;
        uint256 aadhar;
        string name;
        string fathers_name;
        string addr;
        bool signed;
    }

    mapping(uint256 => AgreementInfo) public agreement_info;
    mapping(uint256 => LandlordInfo) public landlord_info;
    mapping(uint256 => LesseeInfo) public lessee_info;

    struct PaidRent {
        // uint256 agreement_id;
        uint256 id;
        uint256 time;
        uint256 value;
    }

    mapping(uint256 => PaidRent) public paidrents;

    event token(uint256 id);

    modifier onlyLandlord(uint256 _index) {
        require(
            msg.sender == agreement_info[_index].landlord_address,
            "Only landlord can access this"
        );
        _;
    }

    modifier notLandLord(uint256 _index) {
        require(
            msg.sender != agreement_info[_index].landlord_address,
            "Only Lessee can access this"
        );
        _;
    }

    function setAgreement(
        address payable _landlord,
        address payable _lessee,
        uint256 _rent,
        string memory _shopAddress,
        uint256 _term,
        uint256 _rentduedate
    ) public {
        require(msg.sender != address(0));
        require(
            msg.sender == _landlord,
            "The Contract should be called by Landlord!"
        );
        require(
            _landlord != address(0) || _lessee != address(0),
            "The addresses cant be empty!"
        );
        require(
            _landlord != _lessee,
            "The Landlord and lessee address cant be same!"
        );
        no_of_agreement++;
        agreement_info[no_of_agreement] = AgreementInfo(
            no_of_agreement,
            _landlord,
            _lessee,
            _shopAddress,
            _term,
            _rent,
            _rentduedate,
            block.timestamp,
            State.Created
        );
        emit token(no_of_agreement);
    }

    function signLandlord(
        uint256 _index,
        uint256 _aadhar_no,
        string memory _name,
        string memory _fathers_name,
        string memory _addr
    ) public {
        require(msg.sender != address(0));
        require(
            msg.sender == agreement_info[_index].landlord_address,
            "Can be signed only by Landlord"
        );

        address ld = agreement_info[_index].landlord_address;
        landlord_info[_index] = LandlordInfo(
            _index,
            payable(ld),
            _aadhar_no,
            _name,
            _fathers_name,
            _addr,
            true
        );
        if (
            landlord_info[_index].signed == true &&
            lessee_info[_index].signed == true
        ) {
            agreement_info[_index].state = State.Started;
        }
    }

    function signLessee(
        uint256 _index,
        uint256 _aadhar_no,
        string memory _name,
        string memory _fathers_name,
        string memory _addr
    ) public {
        require(msg.sender != address(0));
        require(
            msg.sender == agreement_info[_index].lessee_address,
            "Can be signed only by Lessee"
        );

        address le = agreement_info[_index].lessee_address;
        lessee_info[_index] = LesseeInfo(
            _index,
            payable(le),
            _aadhar_no,
            _name,
            _fathers_name,
            _addr,
            true
        );
        if (
            landlord_info[_index].signed == true &&
            lessee_info[_index].signed == true
        ) {
            agreement_info[_index].state = State.Started;
        }
    }

    function agreementTerminated(uint256 _index) public {
        require(
            msg.sender == agreement_info[_index].landlord_address ||
                msg.sender == agreement_info[_index].lessee_address,
            "one of u is a fraud!"
        );
        require(
            msg.sender == agreement_info[_index].landlord_address,
            "Only landlord can Terminate contract!"
        );
        agreement_info[_index].state = State.Terminated;
    }

    function getSigned(uint256 _index) public view returns (bool) {
        if (
            landlord_info[_index].signed == true &&
            lessee_info[_index].signed == true
        ) {
            return true;
        } else {
            return false;
        }
    }

    function getTerminated(uint256 _index) public view returns (bool) {
        if (agreement_info[_index].state == State.Terminated) {
            return true;
        } else {
            return false;
        }
    }

    function payRent(uint256 _id) public payable {
        require(landlord_info[_id].signed == true, "Sign the Contract first!");
        require(
            msg.value == agreement_info[_id].rent,
            "The input amount is not the decided rent amount!"
        );
        require(
            msg.sender == agreement_info[_id].lessee_address,
            "Only lessee can pay rent!"
        );
        // landlord.transfer(_rent);
        (bool sent, ) = landlord.call{value: msg.value}("");
        require(sent, "Failed to send rent");
        paidrents[_id] = PaidRent(
            paidrents[_id].id + 1,
            block.timestamp,
            msg.value
        );
    }
}

// pragma solidity ^0.8.14;

// contract ShopRental {
//     // city, day-month-year, landlord's and their fathers name, landlords address, lessee's and their fathers name, lessee's address
//     //lease property address, lease area, lease term(duration in months), lease start date, lease end date, monthly payment due date
//     //1925763
//     enum State {
//         Created,
//         Started,
//         Terminated
//     }
//     State public state;
//     address payable public landlord;
//     address payable public lessee;
//     uint256 public createdTimestamp;
//     uint256 public rent;
//     uint256 public term;
//     string public shopAddress;
//     // uint deposit; The deposit functionality is remaining.....

//     event landlordInfo(
//         uint256 aadhar,
//         string name,
//         string fathers_name,
//         string addr
//     );
//     event lesseeInfo(
//         uint256 aadhar,
//         string name,
//         string fathers_name,
//         string addr
//     );
//     event Signed(uint256 timestamp, address wallet);
//     event ContractSigned(uint256 timestamp);
//     event contractTerminated(uint256 timestamp);

//     bool public signed = false;
//     mapping(address => bool) private hasSigned;

//     struct PaidRent {
//         uint256 id; /* The paid rent id*/
//         uint256 time;
//         uint256 value; /* The amount of rent that is paid*/
//     }

//     PaidRent[] public paidrents;

//     modifier onlyLandlord() {
//         require(msg.sender != landlord);
//         _;
//     }
//     // modifier onlyLessee(){
//     //     require(msg.sender != lessee);
//     //     _;
//     // }
//     modifier inState(State _state) {
//         if (state != _state) _;
//     }

//     receive() external payable {}

//     function setParams(
//         address payable _lessee,
//         uint256 _rent,
//         string memory _shopAddress,
//         uint256 _term
//     ) public {
//         require(_lessee != address(0), "The Lessee address cannot be Empty!");
//         require(
//             _lessee != msg.sender,
//             "The landlord's and lessee's address should not be same!"
//         );
//         landlord = payable(msg.sender);
//         lessee = _lessee;
//         createdTimestamp = block.timestamp;
//         rent = _rent;
//         shopAddress = _shopAddress;
//         term = _term;
//     }

//     function isNotSameString(string memory string1, string memory string2)
//         private
//         pure
//         returns (bool)
//     {
//         return
//             keccak256(abi.encodePacked(string1)) !=
//             keccak256(abi.encodePacked(string2));
//     }

//     function signContract(
//         uint256 _aadhar_no,
//         string memory _name,
//         string memory _fathers_name,
//         string memory _addr
//     ) public {
//         //require(landlord ==address(0) || lessee == address(0),"Set Initial Parameters first!");
//         require(
//             msg.sender == landlord || msg.sender == lessee,
//             "Wrong wallet address!"
//         );
//         require(isNotSameString(_name, ""), "Please Enter your Name!");
//         require(
//             isNotSameString(_fathers_name, ""),
//             "Please Enter your Father's name!"
//         );
//         require(isNotSameString(_addr, ""), "Please enter your Address!");
//         require(
//             hasSigned[msg.sender] == false,
//             "You have already signed the contract!"
//         );

//         if (msg.sender == landlord) {
//             emit landlordInfo(_aadhar_no, _name, _fathers_name, _addr);
//         } else {
//             emit lesseeInfo(_aadhar_no, _name, _fathers_name, _addr);
//         }
//         // Sender signed
//         hasSigned[msg.sender] = true;

//         emit Signed(block.timestamp, msg.sender);

//         // Check if both spouses have signed
//         if (hasSigned[landlord] && hasSigned[lessee]) {
//             signed = true;
//             emit ContractSigned(block.timestamp);
//         }
//     }

//     function payRent() public payable inState(State.Started) {
//         require(hasSigned[msg.sender] == true, "Sign the Contract first!");
//         require(
//             msg.value == rent,
//             "The input amount is not the decided rent amount!"
//         );
//         require(msg.sender == lessee, "Only lessee can pay rent!");
//         // landlord.transfer(_rent);
//         (bool sent, ) = landlord.call{value: msg.value}("");
//         require(sent, "Failed to send rent");
//         paidrents.push(
//             PaidRent({
//                 id: paidrents.length + 1,
//                 time: block.timestamp,
//                 value: msg.value
//             })
//         );
//     }

//     function terminateContract() public {
//         require(
//             hasSigned[landlord] && hasSigned[lessee],
//             "Contract can be terminated only after creation!"
//         );
//         require(
//             msg.sender == landlord,
//             "Only landlord can terminate contract!"
//         );
//         emit contractTerminated(block.timestamp);
//         state = State.Terminated;
//     }
// }

// pragma solidity ^0.8.16;

// contract ShopRental {
//     // city, day-month-year, landlord's and their fathers name, landlords address, lessee's and their fathers name, lessee's address
//     //lease property address, lease area, lease term(duration in months), lease start date, lease end date, monthly payment due date
//     enum State {
//         Created,
//         Started,
//         Terminated
//     }
//     State public state;
//     address payable public landlord;
//     address payable public lessee;
//     uint256 public createdTimestamp;
//     uint256 public rent;
//     uint256 public term;
//     string public shopAddress;
//     // uint deposit; The deposit functionality is remaining.....

//     event landlordInfo(
//         uint256 aadhar,
//         string name,
//         string fathers_name,
//         string addr
//     );
//     event lesseeInfo(
//         uint256 aadhar,
//         string name,
//         string fathers_name,
//         string addr
//     );
//     event Signed(uint256 timestamp, address wallet);
//     event ContractSigned(uint256 timestamp);
//     event contractTerminated(uint256 timestamp);

//     bool public signed = false;
//     mapping(address => bool) private hasSigned;

//     struct PaidRent {
//         uint256 id; /* The paid rent id*/
//         uint256 value; /* The amount of rent that is paid*/
//     }

//     PaidRent[] public paidrents;

//     modifier onlyLandlord() {
//         require(msg.sender != landlord);
//         _;
//     }
//     // modifier onlyLessee(){
//     //     require(msg.sender != lessee);
//     //     _;
//     // }
//     modifier inState(State _state) {
//         if (state != _state) _;
//     }

//     receive() external payable {}

//     constructor(
//         address payable _lessee,
//         uint256 _rent,
//         string memory _shopAddress,
//         uint256 _term
//     ) {
//         require(_lessee != address(0), "The Lessee address cannot be Empty!");
//         require(
//             _lessee != msg.sender,
//             "The landlord's and lessee's address should not be same!"
//         );
//         landlord = payable(msg.sender);
//         lessee = _lessee;
//         createdTimestamp = block.timestamp;
//         rent = _rent;
//         shopAddress = _shopAddress;
//         term = _term;
//         // deposit = _deposit;
//     }

//     function isNotSameString(string memory string1, string memory string2)
//         private
//         pure
//         returns (bool)
//     {
//         return
//             keccak256(abi.encodePacked(string1)) !=
//             keccak256(abi.encodePacked(string2));
//     }

//     function signContract(
//         uint256 _aadhar_no,
//         string memory _name,
//         string memory _fathers_name,
//         string memory _addr
//     ) public {
//         require(
//             msg.sender == landlord || msg.sender == lessee,
//             "Wrong wallet address!"
//         );
//         require(isNotSameString(_name, ""), "Please Enter your Name!");
//         require(
//             isNotSameString(_fathers_name, ""),
//             "Please Enter your Father's name!"
//         );
//         require(isNotSameString(_addr, ""), "Please enter your Address!");
//         require(
//             hasSigned[msg.sender] == false,
//             "You have already signed the contract!"
//         );

//         if (msg.sender == landlord) {
//             emit landlordInfo(_aadhar_no, _name, _fathers_name, _addr);
//         } else {
//             emit lesseeInfo(_aadhar_no, _name, _fathers_name, _addr);
//         }
//         // Sender signed
//         hasSigned[msg.sender] = true;

//         emit Signed(block.timestamp, msg.sender);

//         // Check if both spouses have signed
//         if (hasSigned[landlord] && hasSigned[lessee]) {
//             signed = true;
//             emit ContractSigned(block.timestamp);
//         }
//     }

//     function payRent() public payable inState(State.Started) {
//         require(hasSigned[msg.sender] == true, "Sign the Contract first!");
//         require(
//             msg.value == rent,
//             "The input amount is not the decided rent amount!"
//         );
//         require(msg.sender == lessee, "Only lessee can pay rent!");
//         // landlord.transfer(_rent);
//         (bool sent, ) = landlord.call{value: msg.value}("");
//         require(sent, "Failed to send rent");
//         paidrents.push(PaidRent({id: paidrents.length + 1, value: msg.value}));
//     }

//     function terminateContract() public {
//         require(
//             hasSigned[landlord] && hasSigned[lessee],
//             "Contract can be terminated only after creation!"
//         );
//         require(
//             msg.sender == landlord,
//             "Only landlord can terminate contract!"
//         );
//         emit contractTerminated(block.timestamp);
//         state = State.Terminated;
//     }
// }
