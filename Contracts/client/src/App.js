import marriage_abi from "./abi/Marriage.json";
import shopRental_abi from "./abi/ShopRental.json";
import patent_abi from "./abi/PatentOwnershipTransfer.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import Marriage from "./components/Marriage";
import { ShopRental } from "./components/ShopRental";
import Patent from "./components/Patent";

function App() {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [account, setAccount] = useState(null);
  const [marriageId, setMarriageId] = useState(0);
  const [patentId, setPatentId] = useState(0);
  const [shopRentalId, setShopRentalId] = useState(0);

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
      Making Legal Contracts Smart using Blockchain!!!
      {isMetamaskInstalled ? (
        account ? (
          <span className="connected-txt">
            Connected to Metamask with Address:<b>{account}</b>
          </span>
        ) : (
          <button className="connect-btn" onClick={connectWallet}>
            connectWallet
          </button>
        )
      ) : (
        "Please Install Metamask!"
      )}
      {account ? (
        <div style={{ width: "60%" }}>
          <div style={{ marginBottom: "5px" }}>
            <Marriage state={state} id={marriageId} />
          </div>
          <div style={{ marginBottom: "5px" }}>
            <Patent state={state} id={patentId} />
          </div>
          <div style={{ marginBottom: "5px" }}>
            <ShopRental state={state} id={shopRentalId} />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
