import shopRental_abi from "./abi/ShopRental.json";
import patent_abi from "./abi/PatentOwnershipTransfer.json";
import newPatent_abi from "./abi/NewPatent.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import { ShopRental } from "./components/ShopRental";
import Patent from "./components/Patent";
import ViewPatent from "./components/ViewPatent";
import ViewShopRental from "./components/ViewShopRental";
import Admin from "./components/Admin/Admin";
import Storage from "./components/Storage";
import { connect } from "./components/ipfs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import homeback from "./homebackground.png";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

function App() {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [account, setAccount] = useState(null);
  const [patentId, setPatentId] = useState(0);
  const [shopRentalId, setShopRentalId] = useState(0);
  const [newPatentId, setNewPatentId] = useState(0);
  // const [active, setActive] = useState("Create");
  const [whichContract, setWhichContract] = useState("Patent");
  const [viewwhichContract, setViewWhichContract] = useState("Patent");

  // const [spouseData, setSpouseData] = useState([]);
  //this a object
  const [state, setState] = useState({
    provider: null,
    signer: null,
    shopRental_contract: null,
    patent_contract: null,
  });
  // const [provider, setProvider] = useState();
  // const [signer, setSigner] = useState();
  // const [m_c, setM_C] = useState();
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      setIsMetamaskInstalled(true);
      connect();
    }
  }, []);

  useEffect(() => {
    const connectWallet = async () => {
      const shopRental_contract_address =
        "0x562d73a8AAc246Ad71963dE000A1CeA3Bd611bC7";
      const sr_abi = shopRental_abi.abi;
      const patent_contract_address =
        "0x5Fcc682BB64F51e44314A701877d506Cf4B4aF12";
      const p_abi = patent_abi.abi;
      const newpatent_contract_address =
        "0x0B52694515cae0e0C1E7b7864d9Aee6016BcaDb0";
      const np_abi = newPatent_abi.abi;

      try {
        const { ethereum } = window;
        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(account[0]);
          console.log(account);
        }
        const provider = new ethers.providers.Web3Provider(ethereum);
        //setProvider(pro);
        const signer = provider.getSigner();
        //setSigner(sig);

        const shopRental_contract = new ethers.Contract(
          shopRental_contract_address,
          sr_abi,
          signer
        );
        shopRental_contract.on("token", (id) => {
          console.log(ethers.BigNumber.from(id).toNumber());
          setShopRentalId(ethers.BigNumber.from(id).toNumber());
        });

        const patent_contract = new ethers.Contract(
          patent_contract_address,
          p_abi,
          signer
        );
        patent_contract.on("token", (id) => {
          console.log(ethers.BigNumber.from(id).toNumber());
          setPatentId(ethers.BigNumber.from(id).toNumber());
        });

        const new_patent_contract = new ethers.Contract(
          newpatent_contract_address,
          np_abi,
          signer
        );
        new_patent_contract.on("token", (id) => {
          console.log(ethers.BigNumber.from(id).toNumber());
          setNewPatentId(ethers.BigNumber.from(id).toNumber());
        });

        setState({
          provider,
          signer,
          shopRental_contract,
          patent_contract,
          new_patent_contract,
        });
      } catch (error) {
        alert(error.message);
      }
    };
    connectWallet();
  }, [account]);
  // console.log(state);
  // console.log(account);

  return (
    <div className="App">
      {isMetamaskInstalled ? (
        account === "0x7420acb34b61cc9df2ef02da6728073a89199133" ? (
          <>
            <div className="Admin">
              <Admin />
            </div>
          </>
        ) : // <div className="cont">
        account && account !== "0x7420acb34b61cc9df2ef02da6728073a89199133" ? (
          <>
            <div className="menu">
              <div style={{ width: "1%", cursor: "pointer" }}>
                <span>
                  <b className="logo">SML</b>
                  <br />
                  SmartLegalContracts
                </span>
              </div>
              <div className="menu-btn-cont">
                <a className="menu-btn" href="#home">
                  Home
                </a>
                <a className="menu-btn" href="#create">
                  Create
                </a>
                <a className="menu-btn" href="#view">
                  View
                </a>
                <a className="menu-btn" href="#storage">
                  Store
                </a>
              </div>
              <div>
                <a className="menu-btn" href="#about">
                  About
                </a>
              </div>
            </div>

            {/* Home Page */}
            <div className="home" id="home">
              <span className="connected-txt" style={{ color: "#8DD8E8" }}>
                Connected to Metamask with Address:<b>{account}</b>
              </span>
              <span
                style={{
                  color: "#8DD8E8",
                  fontSize: "40px",
                  marginTop: "10px",
                }}
              >
                SmartLegalContracts
              </span>
              <p style={{ color: "#8DD8E8" }}>
                Create Smart Contracts with the Security and Immutability of
                Blockchain Technology!
              </p>
              <img
                src={homeback}
                alt="Background"
                style={{
                  width: "500px",
                  height: "300px",
                  // borderRadius: "10px",
                  // backgroundColor: "whitesmoke",
                }}
              />
              <a className="start-btn" href="#create">
                Get Started
                <IoIosArrowDroprightCircle
                  size={22}
                  style={{ marginLeft: "5px" }}
                />
              </a>

              {/* </div> */}
            </div>
            {/* </div> */}

            {/* Create contract */}
            <div className="create" id="create">
              <h1 style={{ color: "#8DD8E8" }}>Create New Contract</h1>
              <div>
                <ToggleButtonGroup
                  color="info"
                  sx={{
                    backgroundColor: "#0F2557",
                  }}
                  value={whichContract}
                  exclusive
                  onChange={(e, w) => {
                    e.preventDefault();
                    if (w !== null) {
                      setWhichContract(w);
                    }
                  }}
                  aria-label="Platform"
                >
                  <ToggleButton value="Patent">Patent</ToggleButton>
                  <ToggleButton value="ShopRental">ShopRental</ToggleButton>
                  {/* <ToggleButton value="ios">iOS</ToggleButton> */}
                </ToggleButtonGroup>
              </div>
              <div className="create-sec">
                <div
                  style={{
                    width: "50%",
                    maxWidth: "50%",
                    marginLeft: "50px",
                    marginTop: "10px",
                    backgroundColor: "#0F2557",
                    padding: "20px",
                    borderRadius: "17px",
                  }}
                >
                  <span style={{ color: "#8DD8E8" }}>Guidelines:</span>

                  <ul style={{ color: "#8DD8E8" }}>
                    <li>
                      Firstly please check if you are connected to your metamask
                      account.
                    </li>
                    <li>
                      Fill all the information in the initial screen i.e. the
                      metamask public Id of people involved, the patent number,
                      amount and state.
                    </li>
                    <li>
                      Submit the form and confirm the transaction from the
                      Licensors metamask.
                    </li>
                    <li>
                      The next screen will need some more information of the
                      people involved in the contract like their Name, Aadhar
                      Id, Address, etc.
                    </li>
                    <li>
                      Please Submit the personal data filled with your
                      particular metamask account and confirm the transaction
                      from the same metamask account.
                    </li>
                    <li>
                      Once all people involved have signed the contract the
                      contract will go for Verification, Once Verification is
                      done You can view your contract details in View Contract.
                    </li>
                  </ul>
                </div>
                <div className="create-contracts">
                  {whichContract === "Patent" && (
                    <div>
                      <ToastContainer />
                      <Patent
                        state={state}
                        id={patentId}
                        newId={newPatentId}
                        // currentAccount={account}
                      />
                    </div>
                  )}
                  {whichContract === "ShopRental" && (
                    <div>
                      <ToastContainer />
                      <ShopRental
                        state={state}
                        id={shopRentalId}
                        // currentAccount={account}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* View Contract */}
            <div className="view" id="view">
              <h1 style={{ color: "#8DD8E8" }}>View your Contract</h1>
              <div>
                <ToggleButtonGroup
                  color="info"
                  sx={{
                    backgroundColor: "#0F2557",
                  }}
                  value={viewwhichContract}
                  exclusive
                  onChange={(e, w) => {
                    e.preventDefault();
                    if (w !== null) {
                      setViewWhichContract(w);
                    }
                  }}
                  aria-label="Platform"
                >
                  <ToggleButton value="Patent">Patent</ToggleButton>
                  <ToggleButton value="ShopRental">ShopRental</ToggleButton>
                  {/* <ToggleButton value="ios">iOS</ToggleButton> */}
                </ToggleButtonGroup>
              </div>
              <div className="view-sec">
                <div
                  style={{
                    width: "90%",
                    // maxWidth: "50%",
                    // marginLeft: "50px",
                    // marginTop: "10px",
                    backgroundColor: "#0F2557",
                    padding: "20px",
                    borderRadius: "17px",
                  }}
                >
                  <span style={{ color: "#8DD8E8" }}>Guidelines:</span>

                  <ul style={{ color: "#8DD8E8" }}>
                    <li>
                      Firstly please check if you are connected to your metamask
                      account.
                    </li>
                    <li>
                      Fill all the information in the initial screen i.e. the
                      metamask public Id of people involved, the patent number,
                      amount and state.
                    </li>
                    <li>
                      Submit the form and confirm the transaction from the
                      Licensors metamask.
                    </li>
                    <li>
                      The next screen will need some more information of the
                      people involved in the contract like their Name, Aadhar
                      Id, Address, etc.
                    </li>
                    <li>
                      Please Submit the personal data filled with your
                      particular metamask account and confirm the transaction
                      from the same metamask account.
                    </li>
                    <li>
                      Once all people involved have signed the contract the
                      contract will go for Verification, Once Verification is
                      done You can view your contract details in View Contract.
                    </li>
                  </ul>
                </div>
                <div className="contracts">
                  {viewwhichContract === "Patent" && (
                    <div>
                      <ToastContainer />
                      <ViewPatent state={state} currentAccount={account} />
                    </div>
                  )}
                  {viewwhichContract === "ShopRental" && (
                    <div>
                      <ToastContainer />
                      <ViewShopRental state={state} currentAccount={account} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Storage section */}
            <div className="storage" id="storage">
              <ToastContainer />
              <Storage account={account} />
            </div>

            {/* About */}
            <div className="about" id="about">
              <h1>The About Section of the Application goes here!!!</h1>
            </div>
          </>
        ) : (
          <div className="connect-cont">
            <span style={{ color: "black", textAlign: "center" }}>
              <h1>SML SmartLegalContracts</h1>
              <h2>Making Legal Contracts Smart using Blockchain!!!</h2>
              <h3>Please connect your wallet.</h3>
            </span>
            {/* <button className="connect-btn" onClick={connectWallet}>
              connectWallet
            </button> */}
          </div>
        )
      ) : (
        "Please Install Metamask!"
      )}

      {/* {account ? <></> : ""} */}
    </div>
  );
}

export default App;

// const marriage_contract_address = "0x4acc78Ed2459107c69Fb4006B9625943D35805Cf";
// const patent_contract_address = "0x0BD4F34e8A6A792154617eF389627E550CE26F2f";
// const shopRental_contract_address ="0x6290d22A195Da1832e8bd210b6512b9c1d4146af";
