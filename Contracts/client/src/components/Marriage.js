import "./Marriage.css";
import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";

const Marriage = ({ state, id }) => {
  const [husband, setHusband] = useState("");
  const [wife, setWife] = useState("");
  // const [token, setToken] = useState();
  const [signed, setSigned] = useState(false);
  const [divorced, setDivorced] = useState(false);

  const setSpouses = async (e) => {
    e.preventDefault();

    const husband_addr = document.querySelector("#husband").value;
    const wife_addr = document.querySelector("#wife").value;

    const transaction = await state.marriage_contract.setSpouse(
      husband_addr,
      wife_addr
    );
    await transaction.wait();
    // console.log(ethers.BigNumber.from(transaction.value).toNumber());
    // console.log(state.marriage_contract._runningEvents[0]);
    // const husband = await state.marriage_contract.husbandAddress();
    // const wife = await state.marriage_contract.wifeAddress();
    // console.log(husband);
    setHusband(husband_addr);
    setWife(wife_addr);

    // setToken(id);
    // console.log("token from marriage:", id);
  };
  const signHusband = async (e) => {
    e.preventDefault();
    // const index = token;
    const Haadhar = document.querySelector("#h_aadhar").value;
    const Hname = document.querySelector("#h_name").value;
    const Hdob = document.querySelector("#h_dob").value;
    const Hoccup = document.querySelector("#h_occupation").value;
    const Haddr = document.querySelector("#h_address").value;

    const transact = await state.marriage_contract.signHusband(
      id,
      Haadhar,
      Hname,
      Hdob,
      Hoccup,
      Haddr
    );
    await transact.wait();
    isSigned();
    // console.log(id);
    isDivorced();
  };
  const signWife = async (e) => {
    e.preventDefault();
    const Waadhar = document.querySelector("#w_aadhar").value;
    const Wname = document.querySelector("#w_name").value;
    const Wdob = document.querySelector("#w_dob").value;
    const Woccup = document.querySelector("#w_occupation").value;
    const Waddr = document.querySelector("#w_address").value;

    const transact = await state.marriage_contract.signWife(
      id,
      Waadhar,
      Wname,
      Wdob,
      Woccup,
      Waddr
    );
    await transact.wait();
    isSigned();
    // console.log(id);
    isDivorced();
  };

  const isSigned = async () => {
    const sign = await state.marriage_contract.getSigned(id);
    setSigned(sign);

    // console.log(sign);
  };

  const divorce = async () => {
    const transact = await state.marriage_contract.issueDivorce(id);
    await transact.wait();
    isDivorced();
  };

  const isDivorced = async () => {
    const divo = await state.marriage_contract.getDivorced(id);
    setDivorced(divo);
  };

  useEffect(() => {
    // uncaught error due to this..........
    isSigned();
    isDivorced();
    // console.log(signed, divorced);
  });

  return (
    <div className="marriage-container">
      <h2 style={{ color: "whitesmoke" }}>Marriage Contract</h2>
      {/* Conditional Rendering - if husband and wife addresses are NOT present in contract then display this...  */}
      {!husband && !wife ? (
        <form onSubmit={setSpouses} className="form">
          <label htmlFor="husband" className="label">
            Enter Husband Address:
          </label>
          <input type="text" className="inputs" id="husband" />
          <label htmlFor="wife" className="label">
            Enter Wife Address:
          </label>
          <input type="text" className="inputs" id="wife" />
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
      ) : (
        // Else Display This...
        <>
          {/* Conditional rendering - if signed(in contract) is NOT true then display form... */}
          {!signed ? (
            <>
              <span className="txt">Husband: {husband}</span>
              <span className="txt">Wife: {wife}</span>
              <span className="txt">Please Remember your Token: {id}</span>
              <span className="txt">
                NOTE: Submit the husband data with husband's metamask and wife
                data with wife metamask
              </span>

              <div className="spouses">
                <div className="sps">
                  Husband Information
                  <form onSubmit={signHusband} className="form">
                    <label htmlFor="aadhar" className="label">
                      Enter Husband Aadhar_No:
                    </label>
                    <input type="number" className="inputs" id="h_aadhar" />
                    <label htmlFor="name" className="label">
                      Enter Husband Name:
                    </label>
                    <input type="text" className="inputs" id="h_name" />
                    <label htmlFor="dob" className="label">
                      Enter Husband Date of Birth:
                    </label>
                    <input type="text" className="inputs" id="h_dob" />
                    <label htmlFor="occupation" className="label">
                      Enter Husband Occupation:
                    </label>
                    <input type="text" className="inputs" id="h_occupation" />
                    <label htmlFor="address" className="label">
                      Enter Husband Address:
                    </label>
                    <input type="text" className="inputs" id="h_address" />
                    <button type="submit" className="btn">
                      Submit
                    </button>
                  </form>
                </div>
                <div className="sps">
                  Wife Information
                  <form onSubmit={signWife} className="form">
                    <label htmlFor="aadhar" className="label">
                      Enter Wife Aadhar_No:
                    </label>
                    <input type="number" className="inputs" id="w_aadhar" />
                    <label htmlFor="name" className="label">
                      Enter Wife Name:
                    </label>
                    <input type="text" className="inputs" id="w_name" />
                    <label htmlFor="dob" className="label">
                      Enter Wife Date of Birth:
                    </label>
                    <input type="text" className="inputs" id="w_dob" />
                    <label htmlFor="occupation" className="label">
                      Enter Wife Occupation:
                    </label>
                    <input type="text" className="inputs" id="w_occupation" />
                    <label htmlFor="address" className="label">
                      Enter Wife Address:
                    </label>
                    <input type="text" className="inputs" id="w_address" />
                    <button type="submit" className="btn">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            // Else display this...
            <>
              {!divorced ? (
                <div className="after-sign">
                  <span className="label">
                    The Contract Has been Signed by both Husband and Wife:
                    <br />
                    <b>{signed.toString()}</b>
                    <br />
                    <span className="success">
                      The Marriage Contract Between <b>{husband}</b> and{" "}
                      <b>{wife}</b> has be formed successfully and data is
                      stored on Blockchain!!!
                    </span>
                  </span>
                  <span className="txt">
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
                    Divorced has been issued by both Husband and Wife:
                    <br />
                    <b>{divorced.toString()}</b>
                  </span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Marriage;
