import "./Patent.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import NewPatent from "./NewPatent";
import { PatentOwnershipGuidelines } from "./Guidelines";

const Patent = ({ state, id, newId }) => {
  const [licensor, setLicensor] = useState();
  const [licensee, setLicensee] = useState();
  const [signed, setSigned] = useState(false);
  const [amount, setAmount] = useState();
  const [licensorSign, setLicensorSign] = useState(false);
  const [licenseeSign, setLicenseeSign] = useState(false);
  const [loading, setLoading] = useState(false);

  const [select, setSelect] = useState("New");

  // const [pamt, setPamt] = useState();

  const setParam = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
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
      setLoading(false);
      toast.success("Contract Initiated!!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong:" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      // alert(error.error.message);
    }
  };

  const signLicensor = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
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

      setLoading(false);
      toast.success("Licensor Information Saved!!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong:" + error.error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      // alert(error.error.message);
    }
  };

  const signLicensee = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
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

      setLoading(false);
      toast.success("Licensee Information Saved!!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong:" + error.error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      // alert(error.error.message);
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
  });

  return (
    <div className="patent-container">
      <ToggleButtonGroup
        color="warning"
        sx={{
          backgroundColor: "#0F2557",
        }}
        value={select}
        exclusive
        onChange={(e, w) => {
          e.preventDefault();
          if (w !== null) {
            setSelect(w);
          }
        }}
        aria-label="Platform"
      >
        <ToggleButton value="New">New Patent Application</ToggleButton>
        <ToggleButton value="Transfer">Patent Ownership transfer</ToggleButton>
        {/* <ToggleButton value="ios">iOS</ToggleButton> */}
      </ToggleButtonGroup>
      {select === "New" && <NewPatent state={state} newId={newId} />}
      {select === "Transfer" && (
        <>
          <PatentOwnershipGuidelines />

          <h2 style={{ color: "#8DD8E8" }}>Patent Ownership Transfer</h2>
          {!licensor && !licensee ? (
            <form onSubmit={setParam} className="form">
              <label htmlFor="licensor" className="label">
                Licensor metamask Address:
              </label>
              <input
                type="text"
                className="inputs"
                id="licensor"
                placeholder="Eg.0x1562990CF848Eb5809D3D7026Ac6430c24f3bb87"
                required
                // maxLength={}
              />
              <label htmlFor="licensee" className="label">
                Licensee metamask Address:
              </label>
              <input
                type="text"
                className="inputs"
                id="licensee"
                placeholder="Eg.0x1562990CF848Eb5809D3D7026Ac6430c24f3bb87"
                required
              />
              <label htmlFor="patent_no" className="label">
                Enter Patent No.:
              </label>
              <input
                type="text"
                className="inputs"
                id="patent_no"
                placeholder="Eg.d12345"
                required
              />
              <label htmlFor="amount" className="label">
                Enter Amount:
              </label>
              <input
                type="number"
                step="any"
                className="inputs"
                id="amount"
                placeholder="Eg.0.000000000000030000"
                required
              />
              <label htmlFor="state" className="label">
                Enter State:
              </label>
              <input
                type="text"
                className="inputs"
                id="state"
                placeholder="Eg.Maharashtra"
                required
              />
              <button type="submit" className="btn">
                {loading ? <CircularProgress size={25} /> : "Submit"}
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
                      <span style={{ color: "#8DD8E8" }}>
                        Licensor Information
                      </span>
                      {!licensorSign === true ? (
                        <form onSubmit={signLicensor} className="form">
                          <label htmlFor="aadhar" className="label">
                            Enter Licensor Aadhar_No:
                          </label>
                          <input
                            type="number"
                            className="inputs"
                            id="lr_aadhar"
                            placeholder="Eg.123456789012"
                            required
                            minLength={12}
                            maxLength={12}
                          />
                          <label htmlFor="name" className="label">
                            Enter Licensor Name:
                          </label>
                          <input
                            type="text"
                            className="inputs"
                            id="lr_name"
                            placeholder="Eg.Vijay Dinanath Chauhan"
                            required
                          />
                          <label htmlFor="address" className="label">
                            Enter Licensor Address:
                          </label>
                          <textarea
                            type="text"
                            className="inputs"
                            id="lr_addr"
                            rows={4}
                            cols={20}
                            placeholder="Eg.flat no.d1,some colony, some nagar,some road,city,123456."
                            required
                          />
                          <button type="submit" className="btn">
                            {loading ? (
                              <CircularProgress size={25} />
                            ) : (
                              "Submit"
                            )}
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
                      <span style={{ color: "#8DD8E8" }}>
                        Licensee Information
                      </span>
                      {!licenseeSign === true ? (
                        <form onSubmit={signLicensee} className="form">
                          <label htmlFor="aadhar" className="label">
                            Enter Licensee Aadhar_No:
                          </label>
                          <input
                            type="number"
                            className="inputs"
                            id="le_aadhar"
                            placeholder="Eg.123456789012"
                            required
                            maxLength={12}
                            minLength={12}
                          />
                          <label htmlFor="name" className="label">
                            Enter Licensee Name:
                          </label>
                          <input
                            type="text"
                            className="inputs"
                            id="le_name"
                            placeholder="Eg.Vijay Dinanath Chauhan"
                            required
                          />
                          <label htmlFor="address" className="label">
                            Enter Licensee Address:
                          </label>
                          <textarea
                            type="text"
                            className="inputs"
                            id="le_address"
                            rows={4}
                            cols={20}
                            placeholder="Eg.flat no.d1,some colony, some nagar,some road,city,123456."
                            required
                          />
                          <button type="submit" className="btn">
                            {loading ? (
                              <CircularProgress size={25} />
                            ) : (
                              "Submit"
                            )}
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
                    <b>{licensee}</b> and the information is successfully stored
                    on Bockchain.
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

export default Patent;
