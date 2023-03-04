import "./Patent.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const Patent = ({ state, id }) => {
  const [licensor, setLicensor] = useState();
  const [licensee, setLicensee] = useState();
  const [signed, setSigned] = useState(false);
  const [amount, setAmount] = useState();
  const [licensorSign, setLicensorSign] = useState(false);
  const [licenseeSign, setLicenseeSign] = useState(false);

  const setParam = async (e) => {
    e.preventDefault();
    try {
      const _licensor = document.querySelector("#licensor").value;
      const _licensee = document.querySelector("#licensee").value;
      const _patent_no = document.querySelector("#patent_no").value;
      const _amount = document.querySelector("#amount").value;
      const _state = document.querySelector("#state").value;

      const transaction = await state.patent_contract.setAgreement(
        _licensor,
        _licensee,
        _patent_no,
        ethers.utils.parseUnits(_amount, 18),
        _state
      );
      await transaction.wait();
      setLicensor(_licensor);
      setLicensee(_licensee);
      setAmount(_amount);
      // console.log(amount);
    } catch (error) {
      alert(error.error.message);
    }
  };

  const signLicensor = async (e) => {
    e.preventDefault();
    try {
      const lr_aadr = document.querySelector("#lr_aadhar").value;
      const lr_name = document.querySelector("#lr_name").value;
      const lr_addr = document.querySelector("#lr_addr").value;
      const transact = await state.patent_contract.signLicensor(
        id,
        lr_aadr,
        lr_name,
        lr_addr
      );
      await transact.wait();

      const licensor = await state.patent_contract.licensor_info(id);
      if (licensor.signed === true) {
        setLicensorSign(licensor.signed);
      }

      isSigned();
    } catch (error) {
      alert(error.error.message);
    }
  };

  const signLicensee = async (e) => {
    e.preventDefault();
    try {
      const le_aadr = document.querySelector("#le_aadhar").value;
      const le_name = document.querySelector("#le_name").value;
      const le_addr = document.querySelector("#le_address").value;
      const value = { value: ethers.utils.parseEther(`${amount}`) };
      const transact = await state.patent_contract.signLicensee(
        id,
        le_aadr,
        le_name,
        le_addr,
        value
      );
      await transact.wait();

      const licensee = await state.patent_contract.licensee_info(id);
      if (licensee.signed === true) {
        setLicenseeSign(licensee.signed);
      }
      isSigned();
    } catch (error) {
      alert(error.error.message);
    }
  };

  //Problem in isSigned **********
  const isSigned = async () => {
    const sign = await state.patent_contract.getSigned(id);
    // console.log(sign);
    setSigned(sign);
  };
  // ***************
  useEffect(() => {
    //uncaught error due to this...........
    isSigned();

    // console.log(signed, divorced);
  });

  return (
    <div className="patent-container">
      <h2 style={{ color: "whitesmoke" }}>Patent Ownership</h2>
      {!licensor && !licensee ? (
        <form onSubmit={setParam} className="form">
          <label htmlFor="licensor" className="label">
            Enter Licensor Address:
          </label>
          <input type="text" className="inputs" id="licensor" />
          <label htmlFor="licensee" className="label">
            Enter Licensee Address:
          </label>
          <input type="text" className="inputs" id="licensee" />
          <label htmlFor="patent_no" className="label">
            Enter Patent No.:
          </label>
          <input type="text" className="inputs" id="patent_no" />
          <label htmlFor="amount" className="label">
            Enter Amount:
          </label>
          <input type="number" step="any" className="inputs" id="amount" />
          <label htmlFor="state" className="label">
            Enter State:
          </label>
          <input type="text" className="inputs" id="state" />
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
      ) : (
        <>
          {!signed ? (
            <>
              <span className="txt">Licensor: {licensor}</span>
              <span className="txt">Licensee: {licensee}</span>
              <span className="txt">Please Remember your Token: {id}</span>
              <span className="txt">
                NOTE: Submit the Licensor data with Licensor's metamask and
                Licensee data with Licensee metamask!
              </span>

              <div className="patent-data">
                <div className="sps">
                  Licensor Information
                  {!licensorSign === true ? (
                    <form onSubmit={signLicensor} className="form">
                      <label htmlFor="aadhar" className="label">
                        Enter Licensor Aadhar_No:
                      </label>
                      <input type="number" className="inputs" id="lr_aadhar" />
                      <label htmlFor="name" className="label">
                        Enter Licensor Name:
                      </label>
                      <input type="text" className="inputs" id="lr_name" />
                      <label htmlFor="address" className="label">
                        Enter Licensor Address:
                      </label>
                      <input type="text" className="inputs" id="lr_addr" />
                      <button type="submit" className="btn">
                        Submit
                      </button>
                    </form>
                  ) : (
                    <div>
                      <span className="txt">
                        Licensor has signed the contract!
                      </span>
                    </div>
                  )}
                </div>
                <div className="sps">
                  Licensee Information
                  {!licenseeSign === true ? (
                    <form onSubmit={signLicensee} className="form">
                      <label htmlFor="aadhar" className="label">
                        Enter Licensee Aadhar_No:
                      </label>
                      <input type="number" className="inputs" id="le_aadhar" />
                      <label htmlFor="name" className="label">
                        Enter Licensee Name:
                      </label>
                      <input type="text" className="inputs" id="le_name" />
                      <label htmlFor="address" className="label">
                        Enter Licensee Address:
                      </label>
                      <input type="text" className="inputs" id="le_address" />
                      <button type="submit" className="btn">
                        Submit
                      </button>
                    </form>
                  ) : (
                    <div>
                      <span className="txt">
                        Licensee has signed the contract!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="after-signed">
              <span className="label">
                The contract has been signed:<b>{signed.toString()}</b>
              </span>
              <span className="success">
                The ownership has been transfered from <b>{licensor}</b> to{" "}
                <b>{licensee}</b> and the information is successfully stored on
                Bockchain
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Patent;
