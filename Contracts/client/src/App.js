import shopRental_abi from "./abi/ShopRental.json";
import patent_abi from "./abi/PatentOwnershipTransfer.json";
import newPatent_abi from "./abi/NewPatent.json";
import trademark_abi from "./abi/TrademarkApplication.json";
import tenders_abi from "./abi/Tenders.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import { ShopRental } from "./components/ShopRental";
import Patent from "./components/Patent";
import ViewPatent from "./components/ViewPatent";
import ViewShopRental from "./components/ViewShopRental";
import Admin from "./components/Admin/Admin";
import Storage from "./components/Storage";
import Trademark from "./components/Trademark";
import { connect } from "./components/ipfs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import homeback from "./homebackground.png";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  ViewNewPatentGuidelines,
  ViewShopRentalGuidelines,
  ViewTrademarkGuidelines,
} from "./components/Guidelines";
import ViewTrademark from "./components/ViewTrademark";
import AllTenders from "./components/AllTenders";

// import ViewNewPatent from "./components/ViewNewPatent";

function App() {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [account, setAccount] = useState(null);
  const [patentId, setPatentId] = useState(0);
  const [shopRentalId, setShopRentalId] = useState(0);
  const [newPatentId, setNewPatentId] = useState(0);
  const [trademarkId, setTrademarkId] = useState(0);
  // const [pancardId, setPancardId] = useState(0);
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
    new_patent_contract: null,
    trademark_contract: null,
    tenders_contract: null,
    // pancard_contract: null,
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
        "0x78E40EC3D11206b2446173DA1cBECd4a0cD934AB";
      const sr_abi = shopRental_abi.abi;

      const patent_contract_address =
        "0x9C86B1c26b559F38250F296a38FD6B42d73D05a8";
      const p_abi = patent_abi.abi;

      const newpatent_contract_address =
        "0xA21d0F49cFDaaFDD9C75093C93d2210D086bb732";
      // "0x9Aa900FEc76F1aD7d95Da4138e98d18A49dB1006";
      const np_abi = newPatent_abi.abi;

      const trademark_contract_address =
        "0x9987F6fDC61638CCD9654971494C4F468E0800DB";
      // "0x7a1Cd69b94bc2A3c0d44D4DeBEEd4Bf352657616";
      const tm_abi = trademark_abi.abi;

      const tenders_contract_address =
        "0xa0837CF477e24A56E9E0aAB97dB9948E737e11b0";
      const tender_abi = tenders_abi.abi;

      try {
        const { ethereum } = window;
        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(account[0]);
          // console.log(account);
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

        const trademark_contract = new ethers.Contract(
          trademark_contract_address,
          tm_abi,
          signer
        );
        trademark_contract.on("tkn", (id) => {
          console.log(ethers.BigNumber.from(id).toNumber());
          setTrademarkId(ethers.BigNumber.from(id).toNumber());
        });

        const tenders_contract = new ethers.Contract(
          tenders_contract_address,
          tender_abi,
          signer
        );
        // tenders_contract.on("ApplicationSubmitted", (id) => {
        //   console.log(ethers.BigNumber.from(id).toNumber());
        //   setPancardId(ethers.BigNumber.from(id).toNumber());
        // });

        setState({
          provider,
          signer,
          shopRental_contract,
          patent_contract,
          new_patent_contract,
          trademark_contract,
          tenders_contract,
          // pancard_contract,
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
    <>
      {isMetamaskInstalled ? (
        account === "0x06c57cbaa47a9bc856a061322eea9109b441c7d6" ? (
          <>
            <div className="Admin">
              <ToastContainer />
              <Admin state={state} currentAccount={account} />
            </div>
          </>
        ) : // <div className="cont">
        account && account !== "0x7420acb34b61cc9df2ef02da6728073a89199133" ? (
          <div className="App">
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
                <a className="menu-btn" href="#tenders">
                  Tenders
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
              <span
                style={{ color: "#8DD8E8", fontSize: "2em", margin: ".5rem" }}
              >
                Create New Contract
              </span>
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
                  <ToggleButton value="Patent">Patent Contracts</ToggleButton>
                  <ToggleButton value="ShopRental">
                    ShopRental Contract
                  </ToggleButton>
                  <ToggleButton value="Trademark">
                    Trademark Contract
                  </ToggleButton>
                  {/* <ToggleButton value="Pancard">Pancard Contract</ToggleButton> */}
                </ToggleButtonGroup>
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
                {whichContract === "Trademark" && (
                  <div>
                    <ToastContainer />
                    <Trademark state={state} id={trademarkId} />
                  </div>
                )}
                {/* {whichContract === "Pancard" && (
                  <div>
                    <ToastContainer />
                    <Pancard state={state} id={pancardId} />
                  </div>
                )} */}
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
                  <ToggleButton value="Trademark">TradeMark</ToggleButton>
                </ToggleButtonGroup>
              </div>
              <div className="view-sec">
                {viewwhichContract === "ShopRental" && (
                  <ViewShopRentalGuidelines />
                )}
                {viewwhichContract === "Patent" && <ViewNewPatentGuidelines />}
                {viewwhichContract === "Trademark" && (
                  <ViewTrademarkGuidelines />
                )}
                <div className="contracts">
                  {viewwhichContract === "Patent" && (
                    <div>
                      <ToastContainer />
                      <ViewPatent state={state} currentAccount={account} />
                      {/* <ViewNewPatent /> */}
                    </div>
                  )}
                  {viewwhichContract === "ShopRental" && (
                    <div>
                      <ToastContainer />
                      <ViewShopRental state={state} currentAccount={account} />
                    </div>
                  )}
                  {viewwhichContract === "Trademark" && (
                    <div>
                      <ToastContainer />
                      <ViewTrademark state={state} currentAccount={account} />
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

            {/* Tenders Section */}
            <div className="tenders" id="tenders">
              <ToastContainer />
              <AllTenders state={state} currentAccount={account} />
            </div>

            {/* About */}
            <div className="about" id="about">
              <h1>The About Section of the Application goes here!!!</h1>
            </div>
          </div>
        ) : (
          <div className="connect-cont">
            <span style={{ color: "#8DD8E8", textAlign: "center" }}>
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
    </>
  );
}

export default App;

// const marriage_contract_address = "0x4acc78Ed2459107c69Fb4006B9625943D35805Cf";
// const patent_contract_address = "0x5Fcc682BB64F51e44314A701877d506Cf4B4aF12";
// const shopRental_contract_address ="0x562d73a8AAc246Ad71963dE000A1CeA3Bd611bC7";
