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
  const [active, setActive] = useState("Create");

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
      "0x4acc78Ed2459107c69Fb4006B9625943D35805Cf";
    const m_abi = marriage_abi.abi;
    const shopRental_contract_address =
      "0x6290d22A195Da1832e8bd210b6512b9c1d4146af";
    const sr_abi = shopRental_abi.abi;
    const patent_contract_address =
      "0x0BD4F34e8A6A792154617eF389627E550CE26F2f";
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
          <div className="cont">
            <div className="menu">
              <div style={{ width: "1%", cursor: "pointer" }}>
                <h3 className="logo">SmartLegalContracts</h3>
              </div>
              <div className="menu-btn-cont">
                <button
                  className="menu-btn"
                  onClick={() => {
                    setActive("Create");
                  }}
                >
                  Create Contract
                </button>
                <button
                  className="menu-btn"
                  onClick={() => {
                    setActive("View");
                  }}
                >
                  View Contract
                </button>
              </div>
              <div>
                <button
                  className="menu-btn"
                  onClick={() => {
                    setActive("About");
                  }}
                >
                  About
                </button>
              </div>
            </div>
            <span className="connected-txt">
              Connected to Metamask with Address:<b>{account}</b>
            </span>
          </div>
        ) : (
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
          {active === "Create" && (
            <div className="contracts">
              <div>
                <Marriage state={state} id={marriageId} />
              </div>
              <div>
                <Patent state={state} id={patentId} />
              </div>
              <div>
                <ShopRental state={state} id={shopRentalId} />
              </div>
            </div>
          )}
          {active === "View" && (
            <div className="contracts">
              <div>
                <ViewMarriage state={state} />
              </div>
              <div>
                <ViewPatent state={state} />
              </div>
              <div>
                <ViewShopRental state={state} />
              </div>
            </div>
          )}
          {active === "About" && (
            <div>
              <h1>The About Section of the Application goes here!!!</h1>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
