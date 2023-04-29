import "./Patent.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Patent = ({ state, id, newId }) => {
  const [licensor, setLicensor] = useState();
  const [licensee, setLicensee] = useState();
  const [signed, setSigned] = useState(false);
  const [amount, setAmount] = useState();
  const [licensorSign, setLicensorSign] = useState(false);
  const [licenseeSign, setLicenseeSign] = useState(false);
  const [loading, setLoading] = useState(false);

  const [select, setSelect] = useState("New");

  const [aSigned, setASigned] = useState(false);
  const [applicant, setApplicant] = useState();
  const [type, setType] = useState("");

  const handleType = (event) => {
    setType(event.target.value);
  };

  const [ptype, setPType] = useState("");

  const handlePType = (event) => {
    setPType(event.target.value);
  };
  const [patentType, setpatentType] = useState();
  const [inventionTitle, setinventionTitle] = useState();
  // const [inventionType, setinventionType] = useState();
  const [inventionDescription, setinventionDescription] = useState();
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
      toast.error("Something went wrong:" + error.error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      // alert(error.error.message);
    }
  };

  const newApplication = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const _applicant = document.querySelector("#applicantAddress").value;
      const _applicantType = type; //document.querySelector("#applicantType").value;
      const _applicantAadhar = document.querySelector("#applicantAadhar").value;
      const _applicantName = document.querySelector("#applicantName").value;
      const _applicantAddr = document.querySelector("#applicantAddress").value;

      const transaction = await state.new_patent_contract.setAgreement(
        _applicant,
        _applicantType,
        _applicantAadhar,
        _applicantName,
        _applicantAddr
      );
      await transaction.wait();
      setApplicant(_applicant);
      // setApplicantType();
      // setApplicantAadhar();
      // setApplicantName();
      // setApplicantAddr();

      setLoading(false);
      toast.success("Contract Initiated!!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong:" + error.error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
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

  const signPatent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // console.log(applicant);
      // console.log(document.querySelector("#applicantAddress2").value);
      const _appli = applicant; //document.querySelector("#applicantAddress2").value;

      const _pTitle = document.querySelector("#patentTitle").value;

      const _pType = ptype; //document.querySelector("#patentType").value;

      const _pDesc = document.querySelector("#patentDesc").value;
      // console.log(document.querySelector("#pamt").value);
      const price = document.querySelector("#pamt").value;
      const val = {
        value: ethers.utils.parseEther("0.001"),
      };

      const transact = await state.new_patent_contract.patentData(
        newId,
        _appli,
        _pTitle,
        _pType,
        _pDesc,
        { value: ethers.utils.parseEther("0.001") }
      );
      await transact.wait();

      const patentDat = await state.new_patent_contract.patent_info(newId);
      if (
        patentDat.applicant &&
        patentDat.inventionTitle &&
        patentDat.inventionType &&
        patentDat.inventionDescription
      ) {
        setpatentType(patentDat.inventionType);
        setinventionTitle(patentDat.inventionTitle);
        setinventionDescription(patentDat.inventionDescription);
      }

      setLoading(false);
      toast.success("Patent Information Saved!!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong:" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  // const newPatent = async (e) => {};

  //Problem in isSigned **********
  const isSigned = async () => {
    const sign = await state.patent_contract.getSigned(id);
    // console.log(sign);
    setSigned(sign);
  };
  // ***************

  const newSigned = async () => {
    const newSign = await state.new_patent_contract.getSigned(newId);
    setASigned(newSign);
  };

  useEffect(() => {
    //uncaught error due to this...........
    isSigned();
    newSigned();
    // console.log(signed, divorced);
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
      {select === "New" &&
        (!aSigned ? (
          <>
            <h2 style={{ color: "#8DD8E8" }}>Patent Application</h2>
            <span style={{ color: "#8DD8E8" }}>
              The Applicant must enter their details here.
            </span>
            <form onSubmit={newApplication} className="form">
              <label htmlFor="applicantAddress" className="label">
                Applicant's metamask Address:
              </label>
              <input
                type="text"
                className="inputs"
                id="applicantAddress"
                required
              />
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 200,
                  backgroundColor: "white",
                  borderRadius: "9px",
                }}
              >
                <InputLabel id="applicantType">Applicant Type</InputLabel>
                <Select
                  labelId="applicantType"
                  id="applicantType"
                  value={type}
                  onChange={handleType}
                  autoWidth
                  label="type"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="NaturalPerson">Natural Person</MenuItem>
                  <MenuItem value="Organization">Organization</MenuItem>
                  <MenuItem value="SmallEntity">Small Entity</MenuItem>
                </Select>
              </FormControl>

              {/* <label htmlFor="applicantType" className="label">
                Patent Type:
              </label>
              <input
                type="text"
                className="inputs"
                id="applicantType"
                required
              /> */}

              <label htmlFor="applicantAadhar" className="label">
                Applicant's Aadhar No.:
              </label>
              <input
                type="number"
                className="inputs"
                id="applicantAadhar"
                required
              />
              <label htmlFor="applicantName" className="label">
                Applicant's Full Name:
              </label>
              <input
                type="text"
                className="inputs"
                id="applicantName"
                required
              />
              <label htmlFor="applicantAddress" className="label">
                Applicant's Full Address:
              </label>
              <input
                type="text"
                className="inputs"
                id="applicantAddress"
                required
              />
              <button type="submit" className="btn">
                {loading ? <CircularProgress size={25} /> : "Submit"}
              </button>
            </form>
          </>
        ) : !patentType && !inventionTitle && !inventionDescription ? (
          <>
            <h2 style={{ color: "#8DD8E8" }}>Patent Application</h2>
            <h4 style={{ color: "#8DD8E8" }}>Your Token is {newId}</h4>
            <span style={{ color: "#8DD8E8" }}>
              The Applicant must enter Patent details here.
            </span>
            <form onSubmit={signPatent} className="form">
              <label htmlFor="applicantAddress2" className="label">
                Applicant's metamask Address:
              </label>
              <input
                type="text"
                className="inputs"
                id="applicantAddress"
                value={applicant}
                disabled
                required
              />
              <label htmlFor="patentTitle" className="label">
                Patent Title:
              </label>
              <input type="text" className="inputs" id="patentTitle" required />

              <FormControl
                sx={{
                  m: 1,
                  minWidth: 200,
                  backgroundColor: "white",
                  borderRadius: "9px",
                }}
              >
                <InputLabel id="patentType">Patent Type</InputLabel>
                <Select
                  labelId="patentType"
                  id="patentType"
                  value={ptype}
                  onChange={handlePType}
                  autoWidth
                  label="type"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Utility">Utility Patent</MenuItem>
                  <MenuItem value="Design">Design Patent</MenuItem>
                  <MenuItem value="Plant">Plant Patent</MenuItem>
                  <MenuItem value="Complete">Complete Patent</MenuItem>
                </Select>
              </FormControl>

              {/* <label htmlFor="patentType" className="label">
                Patent Type:
              </label>
              <input type="text" className="inputs" id="patentType" required /> */}
              <label htmlFor="patentDesc" className="label">
                Patent Description:
              </label>
              <input type="text" className="inputs" id="patentDesc" required />

              <label htmlFor="pamt" className="label">
                Fees:
              </label>
              <input
                type="number"
                className="inputs"
                id="pamt"
                step="any"
                value={0.000001}
                disabled
                required
              />

              <button type="submit" className="btn">
                {loading ? <CircularProgress size={25} /> : "Submit"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Your Application is under Scrutinity.</h1>
          </>
        ))}
      {select === "Transfer" && (
        <>
          <h2 style={{ color: "#8DD8E8" }}>Patent Ownership Transfer</h2>
          {!licensor && !licensee ? (
            <form onSubmit={setParam} className="form">
              <label htmlFor="licensor" className="label">
                Licensor metamask Address:
              </label>
              <input type="text" className="inputs" id="licensor" required />
              <label htmlFor="licensee" className="label">
                Licensee metamask Address:
              </label>
              <input type="text" className="inputs" id="licensee" required />
              <label htmlFor="patent_no" className="label">
                Enter Patent No.:
              </label>
              <input type="text" className="inputs" id="patent_no" required />
              <label htmlFor="amount" className="label">
                Enter Amount:
              </label>
              <input
                type="number"
                step="any"
                className="inputs"
                id="amount"
                required
              />
              <label htmlFor="state" className="label">
                Enter State:
              </label>
              <input type="text" className="inputs" id="state" required />
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
                            required
                          />
                          <label htmlFor="name" className="label">
                            Enter Licensor Name:
                          </label>
                          <input
                            type="text"
                            className="inputs"
                            id="lr_name"
                            required
                          />
                          <label htmlFor="address" className="label">
                            Enter Licensor Address:
                          </label>
                          <input
                            type="text"
                            className="inputs"
                            id="lr_addr"
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
                            required
                          />
                          <label htmlFor="name" className="label">
                            Enter Licensee Name:
                          </label>
                          <input
                            type="text"
                            className="inputs"
                            id="le_name"
                            required
                          />
                          <label htmlFor="address" className="label">
                            Enter Licensee Address:
                          </label>
                          <input
                            type="text"
                            className="inputs"
                            id="le_address"
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
