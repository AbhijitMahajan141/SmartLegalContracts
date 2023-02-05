//SPDX-License-Identifier:UNLICENSED

pragma solidity ^0.8.8;

contract Marriage {
    uint256 agreement_id = 0;

    address husbandAddress;
    address wifeAddress;

    enum State {
        Created,
        Signed,
        Divorced
    }
    State state;

    struct AgreementInfo {
        uint256 agreement_id;
        address husband;
        address wife;
        uint256 timestamp;
        State state;
    }
    struct HusbandInfo {
        uint256 agreement_id;
        address husband;
        uint256 aadhar;
        string name;
        string dob;
        string occupation;
        string addr;
        bool signed;
        bool divorce;
    }
    struct WifeInfo {
        uint256 agreement_id;
        address wife;
        uint256 aadhar;
        string name;
        string dob;
        string occupation;
        string addr;
        bool signed;
        bool divorce;
    }

    mapping(uint256 => AgreementInfo) public agreement_info;
    mapping(uint256 => HusbandInfo) public husband_info;
    mapping(uint256 => WifeInfo) public wife_info;

    event token(uint256 id);

    function setSpouse(address _husbandAddress, address _wifeAddress) public {
        require(
            _husbandAddress != address(0) || _wifeAddress != address(0),
            "Husband or wife address must not be Empty!"
        );
        require(
            _husbandAddress != _wifeAddress,
            "Husband address must not equal wife address!"
        );
        require(
            msg.sender == _husbandAddress || msg.sender == _wifeAddress,
            "The addresses are not correct!"
        );

        agreement_id++;
        agreement_info[agreement_id] = AgreementInfo(
            agreement_id,
            _husbandAddress,
            _wifeAddress,
            block.timestamp,
            State.Created
        );
        emit token(agreement_id);
    }

    function signHusband(
        uint256 _index,
        uint256 _aadhar_no,
        string memory _name,
        string memory _dob,
        string memory _occupation,
        string memory _addr
    ) public {
        require(msg.sender != address(0));
        require(
            msg.sender == agreement_info[_index].husband,
            "Can be signed only by Husband"
        );

        address husb = agreement_info[_index].husband;
        husband_info[_index] = HusbandInfo(
            _index,
            husb,
            _aadhar_no,
            _name,
            _dob,
            _occupation,
            _addr,
            true,
            false
        );
        if (
            husband_info[_index].signed == true &&
            wife_info[_index].signed == true
        ) {
            agreement_info[_index].state = State.Signed;
        }
    }

    function signWife(
        uint256 _index,
        uint256 _aadhar_no,
        string memory _name,
        string memory _dob,
        string memory _occupation,
        string memory _addr
    ) public {
        require(msg.sender != address(0));
        require(
            msg.sender == agreement_info[_index].wife,
            "Can be signed only by Wife"
        );

        address wife = agreement_info[_index].wife;
        wife_info[_index] = WifeInfo(
            _index,
            wife,
            _aadhar_no,
            _name,
            _dob,
            _occupation,
            _addr,
            true,
            false
        );
        if (
            husband_info[_index].signed == true &&
            wife_info[_index].signed == true
        ) {
            agreement_info[_index].state = State.Signed;
        }
    }

    function issueDivorce(uint256 _index) public {
        require(
            msg.sender == agreement_info[_index].husband ||
                msg.sender == agreement_info[_index].wife,
            "one of u is a fraud!"
        );
        // require(husband_info[_index].divorce == false, "Husband has already approved to divorce!");
        // require(wife_info[_index].divorce == false, "Wife has already approved to divorce!");
        if (msg.sender == agreement_info[_index].husband) {
            husband_info[_index].divorce = true;
        }
        if (msg.sender == agreement_info[_index].wife) {
            wife_info[_index].divorce = true;
        }
        if (
            husband_info[_index].divorce == true &&
            wife_info[_index].divorce == true
        ) {
            agreement_info[_index].state = State.Divorced;
        }
    }

    function getSigned(uint256 _index) public view returns (bool) {
        if (
            husband_info[_index].signed == true &&
            wife_info[_index].signed == true
        ) {
            return true;
        } else {
            return false;
        }
    }

    function getDivorced(uint256 _index) public view returns (bool) {
        if (agreement_info[_index].state == State.Divorced) {
            return true;
        } else {
            return false;
        }
    }
}

// pragma solidity ^0.8.8;

// contract Marriage {
//     // event WrittenContractProposed(uint timestamp, address husband, address wife);
//     event Signed(uint256 timestamp, address wallet);
//     event ContractSigned(uint256 timestamp);
//     event DivorceApproved(uint256 timestamp, address wallet);
//     event Divorced(uint256 timestamp);

//     bool public signed = false;
//     bool public divorced = false;

//     mapping(address => bool) private hasSigned;
//     mapping(address => bool) private hasDivorced;
//     // mapping () private ;

//     address public husbandAddress;
//     address public wifeAddress;
//     // uint aadhar;
//     // string name;
//     // string dob;
//     // string occupation;
//     // string addr;

//     event spouse_Info(
//         uint256 aadhar_no,
//         string name,
//         string dob,
//         string occupation,
//         string dwelling_addr
//     );

//     /**
//      * @dev Modifier that only allows spouse execution.
//      */
//     modifier onlySpouse() {
//         require(
//             msg.sender == husbandAddress || msg.sender == wifeAddress,
//             "Sender is not a spouse or Spouse address not set yet!"
//         );
//         _;
//     }

//     /**
//      * @dev Modifier that checks if the contract has been signed by both spouses.
//      */
//     modifier isSigned() {
//         require(
//             signed == true,
//             "Contract has not been signed by both spouses yet!"
//         );
//         _;
//     }

//     /**
//      * @dev Modifier that only allows execution if the spouses have not been divorced.
//      */
//     modifier isNotDivorced() {
//         require(
//             divorced == false,
//             "Can not be called after spouses agreed to divorce!"
//         );
//         _;
//     }

//     /**
//      * @dev Private helper function to check if a string is not equal to another.
//      */
//     function isNotSameString(string memory string1, string memory string2)
//         private
//         pure
//         returns (bool)
//     {
//         return
//             keccak256(abi.encodePacked(string1)) !=
//             keccak256(abi.encodePacked(string2));
//     }

//     function setSpouse(address _husbandAddress, address _wifeAddress) public {
//         require(
//             _husbandAddress != address(0),
//             "Husband address must not be zero!"
//         );
//         require(_wifeAddress != address(0), "Wife address must not be zero!");
//         require(
//             _husbandAddress != _wifeAddress,
//             "Husband address must not equal wife address!"
//         );

//         husbandAddress = _husbandAddress;
//         wifeAddress = _wifeAddress;

//         // emit WrittenContractProposed(block.timestamp, husbandAddress,wifeAddress);
//     }

//     /**
//      * @dev Default function to enable the contract to receive funds.
//      */
//     // receive() external payable isSigned isNotDivorced {
//     //   //emit FundsReceived(block.timestamp, msg.sender, msg.value);
//     // }

//     /**
//      * @dev Sign the contract.
//      */
//     function signContract(
//         uint256 _aadhar_no,
//         string memory _name,
//         string memory _dob,
//         string memory _occupation,
//         string memory _addr
//     ) public onlySpouse {
//         // require(husbandAddress == address(0) || wifeAddress == address(0), "Enter Spouse Address first!");
//         // require(_aadhar_no,"Please Enter correct Aadhar number!");
//         require(isNotSameString(_name, ""), "Please Enter your Name!");
//         require(isNotSameString(_dob, ""), "Please Enter your Date of Birth!");
//         require(
//             isNotSameString(_occupation, ""),
//             "Please Enter your Occupation!"
//         );
//         require(isNotSameString(_addr, ""), "Please enter your Address!");
//         require(
//             hasSigned[msg.sender] == false,
//             "Spouse has already signed the contract!"
//         );

//         // aadhar = _aadhar_no;
//         // name = _name;
//         // dob = _dob;
//         // occupation = _occupation;
//         // addr = _addr;

//         emit spouse_Info(_aadhar_no, _name, _dob, _occupation, _addr);

//         // Sender signed
//         hasSigned[msg.sender] = true;

//         emit Signed(block.timestamp, msg.sender);

//         // Check if both spouses have signed
//         if (hasSigned[husbandAddress] && hasSigned[wifeAddress]) {
//             signed = true;
//             emit ContractSigned(block.timestamp);
//         }
//     }

//     function getSigned(address _husb, address _wife)
//         public
//         view
//         returns (bool)
//     {
//         if (hasSigned[_husb] && hasSigned[_wife]) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     /**
//      * @dev Request to divorce. The other spouse needs to approve this action.
//      */
//     function divorce() external onlySpouse isSigned isNotDivorced {
//         require(
//             hasDivorced[msg.sender] == false,
//             "Sender has already approved to divorce!"
//         );

//         // Sender approved
//         hasDivorced[msg.sender] = true;

//         emit DivorceApproved(block.timestamp, msg.sender);

//         // Check if both spouses have approved to divorce
//         if (hasDivorced[husbandAddress] && hasDivorced[wifeAddress]) {
//             divorced = true;
//             emit Divorced(block.timestamp);
//         }
//     }

//     function getDivorced(address _husb, address _wife)
//         public
//         view
//         returns (bool)
//     {
//         if (hasDivorced[_husb] && hasDivorced[_wife]) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     // function getData() public view returns(uint,string memory,string memory,string memory,string memory){
//     //   return (aadhar,name,dob,occupation,addr);
//     // }
// }

// pragma solidity ^0.8.8;

// contract Marriage {
//     event WrittenContractProposed(
//         uint256 timestamp,
//         address husband,
//         address wife
//     );
//     event Signed(uint256 timestamp, address wallet);
//     event ContractSigned(uint256 timestamp);
//     event DivorceApproved(uint256 timestamp, address wallet);
//     event Divorced(uint256 timestamp);

//     bool public signed = false;
//     bool public divorced = false;

//     mapping(address => bool) private hasSigned;
//     mapping(address => bool) private hasDivorced;

//     address payable public husbandAddress;
//     address payable public wifeAddress;
//     string marriage_type;

//     event spouse_Info(
//         uint256 aadhar_no,
//         string name,
//         string dob,
//         string occupation,
//         string dwelling_addr
//     );

//     /**
//      * @dev Modifier that only allows spouse execution.
//      */
//     modifier onlySpouse() {
//         require(
//             msg.sender == husbandAddress || msg.sender == wifeAddress,
//             "Sender is not a spouse!"
//         );
//         _;
//     }

//     /**
//      * @dev Modifier that checks if the contract has been signed by both spouses.
//      */
//     modifier isSigned() {
//         require(
//             signed == true,
//             "Contract has not been signed by both spouses yet!"
//         );
//         _;
//     }

//     /**
//      * @dev Modifier that only allows execution if the spouses have not been divorced.
//      */
//     modifier isNotDivorced() {
//         require(
//             divorced == false,
//             "Can not be called after spouses agreed to divorce!"
//         );
//         _;
//     }

//     /**
//      * @dev Private helper function to check if a string is not equal to another.
//      */
//     function isNotSameString(string memory string1, string memory string2)
//         private
//         pure
//         returns (bool)
//     {
//         return
//             keccak256(abi.encodePacked(string1)) !=
//             keccak256(abi.encodePacked(string2));
//     }

//     /**
//      * @dev Constructor: Set the wallet addresses of both spouses.
//      * @param _husbandAddress Wallet address of the husband.
//      * @param _wifeAddress Wallet address of the wife.
//      */
//     constructor(address payable _husbandAddress, address payable _wifeAddress) {
//         require(
//             _husbandAddress != address(0),
//             "Husband address must not be zero!"
//         );
//         require(_wifeAddress != address(0), "Wife address must not be zero!");
//         require(
//             _husbandAddress != _wifeAddress,
//             "Husband address must not equal wife address!"
//         );

//         husbandAddress = _husbandAddress;
//         wifeAddress = _wifeAddress;

//         emit WrittenContractProposed(
//             block.timestamp,
//             husbandAddress,wifeAddress
//         );
//     }

//     /**
//      * @dev Default function to enable the contract to receive funds.
//      */
//     receive() external payable isSigned isNotDivorced {
//         //emit FundsReceived(block.timestamp, msg.sender, msg.value);
//     }

//     /**
//      * @dev Sign the contract.
//      */
//     function signContract(
//         uint256 _aadhar_no,
//         string memory _name,
//         string memory _dob,
//         string memory _occupation,
//         string memory _addr
//     ) public onlySpouse {
//         require(
//             isNotSameString(marriage_type, ""),
//             "contract Marriage type has not been proposed yet!"
//         );
//         // require(_aadhar_no <=11 || _aadhar_no >=12,"Please Enter correct Aadhar number!");
//         require(isNotSameString(_name, ""), "Please Enter your Name!");
//         require(isNotSameString(_dob, ""), "Please Enter your Date of Birth!");
//         require(
//             isNotSameString(_occupation, ""),
//             "Please Enter your Occupation!"
//         );
//         require(isNotSameString(_addr, ""), "Please enter your Address!");
//         require(
//             hasSigned[msg.sender] == false,
//             "Spouse has already signed the contract!"
//         );

//         emit spouse_Info(_aadhar_no, _name, _dob, _occupation, _addr);

//         // Sender signed
//         hasSigned[msg.sender] = true;

//         emit Signed(block.timestamp, msg.sender);

//         // Check if both spouses have signed
//         if (hasSigned[husbandAddress] && hasSigned[wifeAddress]) {
//             signed = true;
//             emit ContractSigned(block.timestamp);
//         }
//     }

//     /**
//      * @dev Request to divorce. The other spouse needs to approve this action.
//      */
//     function divorce() external onlySpouse isSigned isNotDivorced {
//         require(
//             hasDivorced[msg.sender] == false,
//             "Sender has already approved to divorce!"
//         );

//         // Sender approved
//         hasDivorced[msg.sender] = true;

//         emit DivorceApproved(block.timestamp, msg.sender);

//         // Check if both spouses have approved to divorce
//         if (hasDivorced[husbandAddress] && hasDivorced[wifeAddress]) {
//             divorced = true;
//             emit Divorced(block.timestamp);
//         }
//     }
// }
