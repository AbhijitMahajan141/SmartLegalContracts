//SPDX-License-Identifier:UNLICENSED

pragma solidity ^0.8.17;

contract PatentOwnershipTransfer {
    enum State {
        Created,
        Completed
    }
    State se;

    address payable licensor;
    address payable licensee;

    uint256 no_of_agreement = 0;

    struct AgreementInfo {
        uint256 agreement_id;
        address payable licensor;
        address payable licensee;
        string patent_number;
        uint256 amount;
        string state;
        uint256 createdTimestamp;
        State se;
    }
    struct LicensorInfo {
        uint256 agreement_id;
        address payable licensor;
        uint256 _aadhar_no;
        string _name;
        string _addr;
        bool signed;
    }
    struct LicenseeInfo {
        uint256 agreement_id;
        address payable licensee;
        uint256 _aadhar_no;
        string _name;
        string _addr;
        bool signed;
    }

    mapping(uint256 => AgreementInfo) public agreement_info;
    mapping(uint256 => LicensorInfo) public licensor_info;
    mapping(uint256 => LicenseeInfo) public licensee_info;

    event token(uint256 id);

    function setAgreement(
        address payable _licensor,
        address payable _licensee,
        string memory _patent_number,
        uint256 _amount,
        string memory _state
    ) public {
        require(msg.sender != address(0));
        require(
            msg.sender == _licensor,
            "The Contract should be called by Licensor!"
        );
        require(
            _licensor != address(0) || _licensee != address(0),
            "The addresses can't be empty!"
        );
        require(
            _licensor != _licensee,
            "The Licensor and Licensee address can't be same!"
        );

        no_of_agreement++;
        agreement_info[no_of_agreement] = AgreementInfo(
            no_of_agreement,
            _licensor,
            _licensee,
            _patent_number,
            _amount,
            _state,
            block.timestamp,
            State.Created
        );
        emit token(no_of_agreement);
    }

    function signLicensor(
        uint256 _index,
        uint256 _aadhar_no,
        string memory _name,
        string memory _addr
    ) public {
        require(msg.sender != address(0));
        require(
            msg.sender == agreement_info[_index].licensor,
            "Can be signed only by licensor"
        );
        address ld = agreement_info[_index].licensor;
        licensor_info[_index] = LicensorInfo(
            _index,
            payable(ld),
            _aadhar_no,
            _name,
            _addr,
            true
        );
        if (
            licensor_info[_index].signed == true &&
            licensee_info[_index].signed == true
        ) {
            agreement_info[_index].se = State.Completed;
            // agreement_info[_index].licensor.transfer(agreement_info[_index].amount);
        }
    }

    function signLicensee(
        uint256 _index,
        uint256 _aadhar_no,
        string memory _name,
        string memory _addr
    ) public payable {
        require(msg.sender != address(0));
        require(
            msg.sender == agreement_info[_index].licensee,
            "Can be signed only by licensee"
        );
        require(
            licensor_info[_index].signed == true,
            "Licensor has not signed yet!"
        );
        require(
            msg.value == agreement_info[_index].amount,
            "Please pay the decided amount!"
        );
        address ld = agreement_info[_index].licensee;
        licensee_info[_index] = LicenseeInfo(
            _index,
            payable(ld),
            _aadhar_no,
            _name,
            _addr,
            true
        );
        if (
            licensor_info[_index].signed == true &&
            licensee_info[_index].signed == true
        ) {
            agreement_info[_index].se = State.Completed;
            agreement_info[_index].licensor.transfer(
                agreement_info[_index].amount
            );
        }
    }

    function getSigned(uint256 _index) public view returns (bool) {
        if (
            licensor_info[_index].signed == true &&
            licensee_info[_index].signed == true
        ) {
            return true;
        } else {
            return false;
        }
    }

    function getCompleted(uint256 _index) public view returns (bool) {
        if (agreement_info[_index].se == State.Completed) {
            return true;
        } else {
            return false;
        }
    }
}

// pragma solidity ^0.8.17;

// contract PatentOwnershipTransfer {
//     //date patent number licensor - name address number licensee - name address number
//     //state and amount decided

//     address payable public licensor;
//     address payable public licensee;
//     string patent_number;
//     uint256 createdTimestamp;
//     uint256 amount;
//     string state;

//     event licensorInfo(
//         address wallet,
//         uint256 aadhar,
//         string name,
//         string addr,
//         uint256 signedTime
//     );
//     event licenseeInfo(
//         address wallet,
//         uint256 aadhar,
//         string name,
//         string addr,
//         uint256 signedTime
//     );
//     //event Signed(uint timestamp, address wallet);
//     event ContractSigned(
//         address licensor,
//         address licensee,
//         string patent_number,
//         string state,
//         uint256 amount,
//         uint256 timestamp
//     );

//     bool signed = false;
//     mapping(address => bool) private hasSigned;

//     function isNotSameString(string memory string1, string memory string2)
//         private
//         pure
//         returns (bool)
//     {
//         return
//             keccak256(abi.encodePacked(string1)) !=
//             keccak256(abi.encodePacked(string2));
//     }

//     modifier validateData(string memory _name, string memory _addr) {
//         require(isNotSameString(_name, ""), "Please Enter your Name!");
//         require(isNotSameString(_addr, ""), "Please enter your Address!");
//         _;
//     }

//     function setParams(
//         address payable _licensor,
//         address payable _licensee,
//         string memory _patent_number,
//         uint256 _amount,
//         string memory _state
//     ) public {
//         require(
//             _licensee != address(0),
//             "The Licensee address cannot be Empty!"
//         );
//         require(
//             _licensor != address(0),
//             "The Licensor address cannot be Empty!"
//         );
//         require(
//             _licensee != _licensor,
//             "The licensor's and licensee's address should not be same!"
//         );
//         licensor = _licensor;
//         licensee = _licensee;
//         patent_number = _patent_number;
//         amount = _amount;
//         createdTimestamp = block.timestamp;
//         state = _state;
//     }

//     receive() external payable {
//         // require(msg.sender == licensee && msg.value == amount,"Licensee must send decided amount!");
//     }

//     function signLicensor(
//         uint256 _aadhar_no,
//         string memory _name,
//         string memory _addr
//     ) public validateData(_name, _addr) {
//         require(licensor != address(0), "Enter the Address's first!S");
//         require(msg.sender == licensor, "Only Licensor can sign this!");
//         //require(isNotSameString(_name,""),"Please Enter your Name!");
//         //require(isNotSameString(_addr,""),"Please enter your Address!");
//         require(
//             hasSigned[msg.sender] == false,
//             "You have already signed the contract!"
//         );
//         emit licensorInfo(
//             msg.sender,
//             _aadhar_no,
//             _name,
//             _addr,
//             block.timestamp
//         );
//         // Sender signed
//         hasSigned[msg.sender] = true;
//         if (hasSigned[licensor] && hasSigned[licensee]) {
//             signed = true;
//             licensor.transfer(address(this).balance);
//             emit ContractSigned(
//                 licensor,
//                 licensee,
//                 patent_number,
//                 state,
//                 amount,
//                 block.timestamp
//             );
//         }
//     }

//     function signLicensee(
//         uint256 _aadhar_no,
//         string memory _name,
//         string memory _addr
//     ) public payable validateData(_name, _addr) {
//         require(licensee != address(0), "Enter the Address's first!S");
//         require(msg.value == amount, "Please pay decided Amount!");
//         require(msg.sender == licensee, "Only Licensee can sign this!");
//         // require(isNotSameString(_name,""),"Please Enter your Name!");
//         // require(isNotSameString(_addr,""),"Please enter your Address!");
//         require(
//             hasSigned[msg.sender] == false,
//             "You have already signed the contract!"
//         );
//         emit licenseeInfo(
//             msg.sender,
//             _aadhar_no,
//             _name,
//             _addr,
//             block.timestamp
//         );
//         // Sender signed
//         hasSigned[msg.sender] = true;
//         if (hasSigned[licensor] && hasSigned[licensee]) {
//             signed = true;
//             licensor.transfer(address(this).balance);
//             emit ContractSigned(
//                 licensor,
//                 licensee,
//                 patent_number,
//                 state,
//                 amount,
//                 block.timestamp
//             );
//         }
//     }

//     function getSigned(address _licensor, address _licensee)
//         public
//         view
//         returns (bool)
//     {
//         if (hasSigned[_licensor] && hasSigned[_licensee]) {
//             return true;
//         } else {
//             return false;
//         }
//     }
// }

// pragma solidity ^0.8.16;

// contract PatentOwnershipTransfer {
//     //date patent number licensor - name address number licensee - name address number
//     //state and amount decided

//     address payable public licensor;
//     address payable public licensee;
//     string public patent_number;
//     uint256 public createdTimestamp;
//     uint256 public amount;
//     string public state;

//     event licensorInfo(
//         address wallet,
//         uint256 aadhar,
//         string name,
//         string addr,
//         uint256 signedTime
//     );
//     event licenseeInfo(
//         address wallet,
//         uint256 aadhar,
//         string name,
//         string addr,
//         uint256 signedTime
//     );
//     //event Signed(uint timestamp, address wallet);
//     event ContractSigned(
//         address licensor,
//         address licensee,
//         string patent_number,
//         string state,
//         uint256 amount,
//         uint256 timestamp
//     );

//     bool public signed = false;
//     mapping(address => bool) private hasSigned;

//     function isNotSameString(string memory string1, string memory string2)
//         private
//         pure
//         returns (bool)
//     {
//         return
//             keccak256(abi.encodePacked(string1)) !=
//             keccak256(abi.encodePacked(string2));
//     }

//     modifier validateData(string memory _name, string memory _addr) {
//         require(isNotSameString(_name, ""), "Please Enter your Name!");
//         require(isNotSameString(_addr, ""), "Please enter your Address!");
//         _;
//     }

//     // modifier alreadySigned(){
//     //     require(hasSigned[msg.sender] == false, "You have already signed the contract!");
//     //     _;
//     // }

//     constructor(
//         address payable _licensor,
//         address payable _licensee,
//         string memory _patent_number,
//         uint256 _amount,
//         string memory _state
//     ) {
//         require(_licensee != address(0), "The Lessee address cannot be Empty!");
//         require(
//             _licensee != msg.sender,
//             "The licensor's and licensee's address should not be same!"
//         );
//         licensor = _licensor;
//         licensee = _licensee;
//         patent_number = _patent_number;
//         amount = _amount;
//         createdTimestamp = block.timestamp;
//         state = _state;
//     }

//     receive() external payable {
//         // require(msg.sender == licensee && msg.value == amount,"Licensee must send decided amount!");
//     }

//     function signLicensor(
//         uint256 _aadhar_no,
//         string memory _name,
//         string memory _addr
//     ) public validateData(_name, _addr) {
//         require(msg.sender == licensor, "Only Licensor can sign this!");
//         //require(isNotSameString(_name,""),"Please Enter your Name!");
//         //require(isNotSameString(_addr,""),"Please enter your Address!");
//         require(
//             hasSigned[msg.sender] == false,
//             "You have already signed the contract!"
//         );
//         emit licensorInfo(
//             msg.sender,
//             _aadhar_no,
//             _name,
//             _addr,
//             block.timestamp
//         );
//         // Sender signed
//         hasSigned[msg.sender] = true;
//         if (hasSigned[licensor] && hasSigned[licensee]) {
//             signed = true;
//             licensor.transfer(address(this).balance);
//             emit ContractSigned(
//                 licensor,
//                 licensee,
//                 patent_number,
//                 state,
//                 amount,
//                 block.timestamp
//             );
//         }

//     }

//     function signLicensee(
//         uint256 _aadhar_no,
//         string memory _name,
//         string memory _addr
//     ) public payable validateData(_name, _addr) {
//         require(msg.value == amount, "Please pay decided Amount!");
//         require(msg.sender == licensee, "Only Licensee can sign this!");
//         // require(isNotSameString(_name,""),"Please Enter your Name!");
//         // require(isNotSameString(_addr,""),"Please enter your Address!");
//         require(
//             hasSigned[msg.sender] == false,
//             "You have already signed the contract!"
//         );
//         emit licenseeInfo(
//             msg.sender,
//             _aadhar_no,
//             _name,
//             _addr,
//             block.timestamp
//         );
//         // Sender signed
//         hasSigned[msg.sender] = true;
//         if (hasSigned[licensor] && hasSigned[licensee]) {
//             signed = true;
//             licensor.transfer(address(this).balance);
//             emit ContractSigned(
//                 licensor,
//                 licensee,
//                 patent_number,
//                 state,
//                 amount,
//                 block.timestamp
//             );
//         }

//     }

// }

// // pragma solidity >=0.4.0 < 0.8.17;

// // contract PatentTransfer{
// //     //date patent number licensor - name address number licensee - name address number
// //     //state and amount decided

// //     address payable public licensor;
// //     address payable public licensee;
// //     string public patent_number;
// //     uint public createdTimestamp;
// //     uint public amount;
// //     string public state;

// //     event licensorInfo(uint aadhar, string name, string addr);
// //     event licenseeInfo(uint aadhar, string name, string addr);
// //     event Signed(uint timestamp, address wallet);
// //     event ContractSigned(address licensor, address licensee, string state,uint amount, uint timestamp);

// //     bool public signed = false;
// //     mapping (address => bool) private hasSigned;

// //     constructor(address payable _licensee, string memory _patent_number, uint _amount,string memory _state){
// //         require(_licensee != address(0),"The Lessee address cannot be Empty!");
// //         require(_licensee != msg.sender,"The landlord's and lessee's address should not be same!");
// //         licensor = payable(msg.sender);
// //         licensee = _licensee;
// //         patent_number = _patent_number;
// //         amount = _amount;
// //         createdTimestamp = block.timestamp;
// //         state = _state;
// //     }

// //     function isNotSameString(string memory string1, string memory string2) private pure returns (bool) {
// //         return keccak256(abi.encodePacked(string1)) != keccak256(abi.encodePacked(string2));
// //     }

// //     function signContract(uint256 _aadhar_no, string memory _name,string memory _addr) public  {
// //         require(msg.sender == licensor || msg.sender == licensee,"Wrong wallet address!");
// //         require(isNotSameString(_name,""),"Please Enter your Name!");
// //         require(isNotSameString(_addr,""),"Please enter your Address!");
// //         require(hasSigned[msg.sender] == false, "You have already signed the contract!");
// //         if(msg.sender == licensor){
// //             emit licensorInfo(_aadhar_no,_name,_addr);
// //         }else{
// //             emit licenseeInfo(_aadhar_no, _name, _addr);
// //         }
// //         // Sender signed
// //         hasSigned[msg.sender] = true;

// //         emit Signed(block.timestamp, msg.sender);

// //         // Check if both have signed
// //         if (hasSigned[licensor] && hasSigned[licensee]) {
// //             signed = true;
// //             emit ContractSigned(licensor,licensee,state,amount,block.timestamp);
// //         }
// //     }

// //     function payAmount() payable public {
// //         require(msg.sender == licensee,"Only Licensee can send amount!");
// //         require(hasSigned[licensor] && hasSigned[licensee],"Please Sign the contract first!");
// //         require(msg.value == amount,"The entered amount is not equal to decided amount!");
// //         licensor.transfer(msg.value);
// //     }

// // }
