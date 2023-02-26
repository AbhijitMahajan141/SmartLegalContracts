import marriage_abi from "./abi/Marriage.json";
import shopRental_abi from "./abi/ShopRental.json";
import patent_abi from "./abi/PatentOwnershipTransfer.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import Marriage from "./components/Marriage";
import { ShopRental } from "./components/ShopRental";
import Patent from "./components/Patent";
import ViewMarriage from "./components/ViewMarriage";
import ViewPatent from "./components/ViewPatent";
import ViewShopRental from "./components/ViewShopRental";

function App() {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [account, setAccount] = useState(null);
  const [marriageId, setMarriageId] = useState(0);
  const [patentId, setPatentId] = useState(0);
  const [shopRentalId, setShopRentalId] = useState(0);
  // const [active, setActive] = useState("Create");
  const [whichContract, setWhichContract] = useState("Marriage");
  const [viewwhichContract, setViewWhichContract] = useState("Marriage");

  // const [spouseData, setSpouseData] = useState([]);
  //this a object
  const [state, setState] = useState({
    provider: null,
    signer: null,
    marriage_contract: null,
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
    }
  }, []);
  //useEffect(() => {
  const connectWallet = async () => {
    const marriage_contract_address =
      "0x6566B01BBAb5C05B60f6555fa32091f2cE1AFB1A";
    const m_abi = marriage_abi.abi;
    const shopRental_contract_address =
      "0x562d73a8AAc246Ad71963dE000A1CeA3Bd611bC7";
    const sr_abi = shopRental_abi.abi;
    const patent_contract_address =
      "0x5Fcc682BB64F51e44314A701877d506Cf4B4aF12";
    const p_abi = patent_abi.abi;

    try {
      const { ethereum } = window;
      if (ethereum) {
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(account);
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      //setProvider(pro);
      const signer = provider.getSigner();
      //setSigner(sig);
      const marriage_contract = new ethers.Contract(
        marriage_contract_address,
        m_abi,
        signer
      );
      marriage_contract.on("token", (id) => {
        console.log(ethers.BigNumber.from(id).toNumber());
        setMarriageId(ethers.BigNumber.from(id).toNumber());
      });

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

      setState({
        provider,
        signer,
        marriage_contract,
        shopRental_contract,
        patent_contract,
      });
    } catch (error) {
      alert(error.message);
    }
  };
  //connectWallet();
  //}, []);
  // console.log(state);
  return (
    <div className="App">
      {isMetamaskInstalled ? (
        account ? (
          // <div className="cont">
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
                Create Contract
              </a>
              <a className="menu-btn" href="#view">
                View Contract
              </a>
            </div>
            <div>
              <a className="menu-btn" href="#about">
                About
              </a>
            </div>
          </div>
        ) : (
          // {/* <span className="connected-txt">
          //   Connected to Metamask with Address:<b>{account}</b>
          // </span> */}
          // {/* </div> */}
          <div className="connect-cont">
            Making Legal Contracts Smart using Blockchain!!!
            <button className="connect-btn" onClick={connectWallet}>
              connectWallet
            </button>
          </div>
        )
      ) : (
        "Please Install Metamask!"
      )}

      {account ? (
        <>
          {/* Home Page */}
          {/* <div className="home-cont" id="home"> */}
          <div className="home" id="home">
            <h1>SmartLegalContracts</h1>
            <p>
              Create Smart Contracts with the Security and Immutability of
              Blockchain Technology!
            </p>
            <a className="menu-btn" href="#create">
              Get Started
            </a>
          </div>
          {/* </div> */}

          {/* Create contract */}
          <div className="create" id="create">
            <div className="create-sec">
              <h1>Create New Contract</h1>
              <div>
                <button
                  className="contract-btn"
                  onClick={() => {
                    setWhichContract("Marriage");
                  }}
                >
                  Marriage
                </button>
                <button
                  className="contract-btn"
                  onClick={() => {
                    setWhichContract("Patent");
                  }}
                >
                  Patent
                </button>
                <button
                  className="contract-btn"
                  onClick={() => {
                    setWhichContract("ShopRental");
                  }}
                >
                  ShopRental
                </button>
              </div>
            </div>

            <div className="contracts">
              {whichContract === "Marriage" && (
                <div>
                  <Marriage state={state} id={marriageId} />
                </div>
              )}
              {whichContract === "Patent" && (
                <div>
                  <Patent state={state} id={patentId} />
                </div>
              )}
              {whichContract === "ShopRental" && (
                <div>
                  <ShopRental state={state} id={shopRentalId} />
                </div>
              )}
            </div>
          </div>

          {/* View Contract */}
          <div className="view" id="view">
            <div className="view-sec">
              <h1>View your Contract</h1>
              <div>
                <button
                  className="contract-btn"
                  onClick={() => {
                    setViewWhichContract("Marriage");
                  }}
                >
                  Marriage
                </button>
                <button
                  className="contract-btn"
                  onClick={() => {
                    setViewWhichContract("Patent");
                  }}
                >
                  Patent
                </button>
                <button
                  className="contract-btn"
                  onClick={() => {
                    setViewWhichContract("ShopRental");
                  }}
                >
                  ShopRental
                </button>
              </div>
            </div>

            <div className="contracts">
              {viewwhichContract === "Marriage" && (
                <div>
                  <ViewMarriage state={state} />
                </div>
              )}
              {viewwhichContract === "Patent" && (
                <div>
                  <ViewPatent state={state} />
                </div>
              )}
              {viewwhichContract === "ShopRental" && (
                <div>
                  <ViewShopRental state={state} />
                </div>
              )}
            </div>
          </div>

          {/* About */}
          <div className="about" id="about">
            <h1>The About Section of the Application goes here!!!</h1>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;

// const marriage_contract_address = "0x4acc78Ed2459107c69Fb4006B9625943D35805Cf";
// const patent_contract_address = "0x0BD4F34e8A6A792154617eF389627E550CE26F2f";
// const shopRental_contract_address ="0x6290d22A195Da1832e8bd210b6512b9c1d4146af";
