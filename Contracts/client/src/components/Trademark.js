import "./Trademark.css";
import React, { useState } from "react";
// import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import { TrademarkGuidelines } from "./Guidelines";

const Trademark = ({ state, id }) => {
  const [applicant, setApplicant] = useState();
  const [loading, setLoading] = useState(false);
  const [appli, setAppli] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [Name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [st, setSt] = useState("");
  const [contact, setContact] = useState("");
  const [tmName, setTmname] = useState("");
  const [tmClass, setTmclass] = useState("");
  const [tmDesc, setTmdesc] = useState("");
  // const [tmDesign, setTmdesign] = useState("");

  const newApplication = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const _applicant = document.querySelector("#applicant").value;
      const _applicantAadhar = document.querySelector("#applicantAadhar").value;
      const _applicantName = document.querySelector("#applicantName").value;
      const _applicantAddr = document.querySelector("#applicantAddr").value;
      const _applicantState = document.querySelector("#applicantState").value;
      const _applicantContact =
        document.querySelector("#applicantContact").value;

      const transaction = await state.trademark_contract.submitApplication(
        _applicant,
        _applicantAadhar,
        _applicantName,
        _applicantAddr,
        _applicantState,
        _applicantContact
      );
      await transaction.wait();
      if (transaction) {
        setApplicant(_applicant);
      }
      // setApplicant();
      //   newSigned();
      setLoading(false);
      setAppli("");
      setAadhar("");
      setName("");
      setAddress("");
      setSt("");
      setContact("");
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

  const signTrademark = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const _appli = applicant; //document.querySelector("#applicantAddress2").value;
      const _tmName = document.querySelector("#trademarkName").value;
      const _tmClass = document.querySelector("#trademarkClass").value;
      const _tmDesc = document.querySelector("#trademarkDesc").value;
      // const _tmDesign = document.querySelector("#trademarkDesign").value;

      //  const val = {
      //    value: ethers.utils.parseEther("0.000001"),
      //  };

      const transact = await state.trademark_contract.trademarkApplication(
        id,
        _appli,
        _tmName,
        _tmClass,
        _tmDesc
        // _tmDesign
        //  val.value
      );
      await transact.wait();
      if (transact) {
        setApplicant("");
      }
      //   const patentDat = await state.new_patent_contract.patent_info(newId);
      setLoading(false);
      setTmname("");
      setTmclass("");
      setTmdesc("");
      // setTmdesign("");

      toast.success(
        "Patent Information Saved!!! Your Application is under scrutinity.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong:" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <div className="trademark-container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#8DD8E8" }}>Trademark Application</h2>
        <TrademarkGuidelines />
      </div>
      {!applicant ? (
        <div>
          <form className="form" onSubmit={newApplication}>
            <label className="label">Applicant's metamask Address:</label>
            <input
              type="text"
              className="inputs"
              id="applicant"
              onChange={(e) => {
                setAppli(e.target.value);
              }}
              value={appli}
              placeholder="Eg.0x1562990CF848Eb5809D3D7026Ac6430c24f3bb87"
              required
            />

            <label className="label">Aadhar Id:</label>
            <input
              type="number"
              className="inputs"
              id="applicantAadhar"
              onChange={(e) => {
                setAadhar(e.target.value);
              }}
              value={aadhar}
              placeholder="Eg.123456789012"
              required
              minLength={12}
              maxLength={12}
            />

            <label className="label">Applicant's Full Name:</label>
            <input
              type="text"
              className="inputs"
              id="applicantName"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={Name}
              placeholder="Eg.Vijay Dinanath Chauhan"
              required
            />

            <label className="label">Applicant's Address:</label>
            <textarea
              type="text"
              className="inputs"
              id="applicantAddr"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              value={address}
              placeholder="Eg.flat no.d1,some colony, some nagar,some road,city,123456"
              rows={4}
              cols={20}
              required
            />

            <label className="label">Applicant's State:</label>
            <input
              type="text"
              className="inputs"
              id="applicantState"
              onChange={(e) => {
                setSt(e.target.value);
              }}
              value={st}
              placeholder="Eg.Maharashtra"
              required
            />

            <label className="label">Applicant's Contact:</label>
            <input
              type="number"
              className="inputs"
              id="applicantContact"
              onChange={(e) => {
                setContact(e.target.value);
              }}
              value={contact}
              placeholder="Eg.8790032345"
              required
              minLength={10}
              maxLength={10}
            />
            <button type="submit" className="btn">
              {loading ? <CircularProgress size={25} /> : "Submit"}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <form className="form" onSubmit={signTrademark}>
            <label className="label">Trademark Name:</label>
            <input
              type="text"
              className="inputs"
              id="trademarkName"
              onChange={(e) => {
                setTmname(e.target.value);
              }}
              value={tmName}
              placeholder="Eg.Nestle"
              required
            />

            <label className="label">Trademark Class:</label>
            <input
              type="text"
              className="inputs"
              id="trademarkClass"
              onChange={(e) => {
                setTmclass(e.target.value);
              }}
              value={tmClass}
              placeholder="Eg.class 1-45"
              required
            />

            <label className="label">Trademark Description:</label>
            <textarea
              type="text"
              className="inputs"
              id="trademarkDesc"
              onChange={(e) => {
                setTmdesc(e.target.value);
              }}
              value={tmDesc}
              placeholder="Detailed description of the trademark."
              rows={4}
              cols={20}
              required
            />

            {/* <label className="label">Trademark Design(s):</label>
            <input
              type="text"
              className="inputs"
              id="trademarkDesign"
              onChange={(e) => {
                setTmdesign(e.target.value);
              }}
              value={tmDesign}
              // multiple
              required
            /> */}

            <button type="submit" className="btn">
              {loading ? <CircularProgress size={25} /> : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Trademark;
