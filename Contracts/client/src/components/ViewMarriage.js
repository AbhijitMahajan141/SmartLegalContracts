import "./ViewMarriage.css";
import { useState } from "react";
import { ethers } from "ethers";

const ViewMarriage = ({ state }) => {
  const [contractId, setContractId] = useState();
  const [husband, setHusband] = useState("");
  const [wife, setWife] = useState("");
  const [timestamp, setTimestamp] = useState();
  const [husbandName, setHusbandName] = useState("");
  const [wifeName, setWifeName] = useState("");
  const [husbandDob, setHusbandDob] = useState("");
  const [wifeDob, setWifeDob] = useState("");
  const [husbandOccupation, setHusbandOccupation] = useState("");
  const [wifeOccupation, setWifeOccupation] = useState("");
  //   const [husbandAddress, setHusbandAddress] = useState("");
  //   const [wifeAddress, setwifeAddress] = useState("");
  const [husbandAadhar, setHusbandAadhar] = useState("");
  const [wifeAadhar, setwifeAadhar] = useState("");
  const [divorced, setDivorced] = useState(false);

  const getContract = async (e) => {
    e.preventDefault();
    try {
      const token = document.querySelector("#contractToken").value;

      const agreement = await state.marriage_contract.agreement_info(token);
      const husband = await state.marriage_contract.husband_info(token);
      const wife = await state.marriage_contract.wife_info(token);
      const divo = await state.marriage_contract.getDivorced(token);

      if (
        ethers.BigNumber.from(agreement.agreement_id).toNumber() !== 0 &&
        husband.name !== "" &&
        wife.name !== ""
      ) {
        setContractId(ethers.BigNumber.from(agreement.agreement_id).toNumber());
        setHusband(agreement.husband);
        setWife(agreement.wife);
        setTimestamp(ethers.BigNumber.from(agreement.timestamp).toNumber());
        setHusbandName(husband.name);
        setWifeName(wife.name);
        setHusbandDob(husband.dob);
        setWifeDob(wife.dob);
        setHusbandOccupation(husband.occupation);
        setWifeOccupation(wife.occupation);
        // setHusbandAddress(husband.addr);
        // setwifeAddress(wife.addr);
        setHusbandAadhar(ethers.BigNumber.from(husband.aadhar).toNumber());
        setwifeAadhar(ethers.BigNumber.from(wife.aadhar).toNumber());
        setDivorced(divo);
      } else {
        alert("The Contract token does not exist!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const divorce = async (e) => {
    e.preventDefault();
    try {
      const transact = await state.marriage_contract.issueDivorce(contractId);
      await transact.wait();
      isDivorced();
    } catch (error) {
      alert(error.message);
    }
  };

  const isDivorced = async () => {
    try {
      const divo = await state.marriage_contract.getDivorced(contractId);
      setDivorced(divo);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="viewmarriage-container">
      <h1 style={{ color: "whitesmoke" }}>Your Marriage Contract</h1>
      {!contractId && !husband && !wife ? (
        <div>
          <form className="form" onSubmit={getContract}>
            <label htmlFor="index" className="label">
              Enter Your Contract Token:
            </label>
            <input
              type="number"
              step="any"
              className="inputz"
              id="contractToken"
            />
            <button type="submit" className="btn">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <>
          {!divorced ? (
            <div className="view-contract">
              <span className="txt">Agreement Id: {contractId}</span>
              <span className="txt">Husband: {husband}</span>
              <span className="txt">Wife: {wife}</span>
              <p
                align="justify"
                style={{ color: "whitesmoke", margin: "10px 70px" }}
              >
                The Marriage Contract has been formed between Mr.{" "}
                <b>{husbandName}</b> with Aadhar ID <b>{husbandAadhar}</b> and
                DOB <b>{husbandDob}</b> with Occupation as{" "}
                <b>{husbandOccupation}</b> and Mrs. <b>{wifeName}</b> with
                Aadhar ID <b>{wifeAadhar}</b> and DOB <b>{wifeDob}</b> with
                Occupation as <b>{wifeOccupation}</b> on{" "}
                <b>{new Date(timestamp * 1000).toLocaleString()}</b>. Both the
                parties have Signed the Contract and the information is securely
                stored on Blockchain.
              </p>
              <span className="note">
                Note: To Issue a divorce both the spouses have to click the
                "Issue Divorce" button from their respective wallets!
              </span>
              <button onClick={divorce} className="divorce-btn">
                Issue Divorce
              </button>
            </div>
          ) : (
            <div className="after-sign">
              <span className="label">
                Divorce has been issued by both Husband and Wife:
                <br />
                <b>{divorced.toString()}</b>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewMarriage;
