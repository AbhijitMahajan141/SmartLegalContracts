import "./Patent.css";
import React, { useState } from "react";
// import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { NewPatentGuidelines } from "./Guidelines";

const NewPatent = ({ state, newId }) => {
  //   const [aSigned, setASigned] = useState(false);
  const [applicant, setApplicant] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [appli, setAppli] = useState("");
  const [ptype, setPType] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleType = (event) => {
    setType(event.target.value);
  };

  const handlePType = (event) => {
    setPType(event.target.value);
  };

  //   const id = newId;

  const newApplication = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const _applicant = document.querySelector("#applicant").value;
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
      if (transaction) {
        setApplicant(_applicant);
      }
      // setApplicant();
      //   newSigned();
      setLoading(false);
      setAadhar("");
      setName("");
      setAddress("");
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

  const signPatent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const _appli = applicant; //document.querySelector("#applicantAddress2").value;
      const _pTitle = document.querySelector("#patentTitle").value;
      const _pType = ptype; //document.querySelector("#patentType").value;
      const _pDesc = document.querySelector("#patentDesc").value;

      // const val = {
      //   value: ethers.utils.parseEther("0.000001"),
      // };

      const transact = await state.new_patent_contract.patentData(
        newId,
        _appli,
        _pTitle,
        _pType,
        _pDesc
        // val.value
      );
      await transact.wait();
      if (transact) {
        setApplicant("");
      }
      //   const patentDat = await state.new_patent_contract.patent_info(newId);
      setLoading(false);
      setTitle("");
      setDesc("");
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

  //   const newSigned = async () => {
  //     const newSign = await state.new_patent_contract.getSigned(newId);
  //     setASigned(newSign);
  //   };

  //   useEffect(() => {
  //     //uncaught error due to this...........
  //     // newSigned();
  //     // console.log(signed, divorced);
  //   });

  return !applicant ? (
    <>
      <NewPatentGuidelines />
      <h2 style={{ color: "#8DD8E8" }}>Patent Application</h2>
      <span style={{ color: "#8DD8E8" }}>
        The Applicant must enter their details here.
      </span>
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

        <label className="label">Applicant's Aadhar No.:</label>
        <input
          maxLength={12}
          type="number"
          className="inputs"
          id="applicantAadhar"
          onChange={(e) => {
            setAadhar(e.target.value);
          }}
          value={aadhar}
          placeholder="Eg.123456789012"
          // minLength="12"

          required
        />
        <label className="label">Applicant's Full Name:</label>
        <input
          type="text"
          className="inputs"
          id="applicantName"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
          placeholder="Eg.Vijay Dinanath Chauhan"
          required
        />
        <label className="label">Applicant's Full Address:</label>
        <textarea
          type="text"
          className="inputs"
          id="applicantAddress"
          onChange={(e) => {
            setAddress(e.target.value);
          }}
          value={address}
          placeholder="Eg.flat no.d1,some colony, some nagar,some road,city,123456"
          rows={4}
          cols={20}
          required
        />
        <button type="submit" className="btn">
          {loading ? <CircularProgress size={25} /> : "Submit"}
        </button>
      </form>
    </>
  ) : (
    <>
      <h2 style={{ color: "#8DD8E8" }}>Patent Application</h2>
      <span style={{ color: "#8DD8E8", margin: ".5rem" }}>
        Your Token is: {newId}
      </span>
      <span style={{ color: "#8DD8E8" }}>
        The Applicant must enter Patent details here.
      </span>
      <form className="form" onSubmit={signPatent}>
        {/* <label className="label">
          Applicant's metamask Address:
        </label>
        <input
          type="text"
          className="inputs"
          id="applicantAddress"
          value={applicant}
          disabled
          required
        /> */}
        <label className="label">Patent Title:</label>
        <input
          type="text"
          className="inputs"
          id="patentTitle"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
          placeholder="Eg.Stress Detector"
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

        <label className="label">Patent Description:</label>
        <textarea
          type="text"
          className="inputs"
          id="patentDesc"
          onChange={(e) => {
            setDesc(e.target.value);
          }}
          value={desc}
          placeholder="Full detailed description of the patent."
          rows={4}
          cols={20}
          required
        />

        {/* <label className="label">Fees:</label>
        <input
          type="number"
          className="inputs"
          id="pamt"
          step="any"
          value={0.000001}
          disabled
          required
        /> */}

        <button type="submit" className="btn">
          {loading ? <CircularProgress size={25} /> : "Submit"}
        </button>
      </form>
    </>
  );
};

export default NewPatent;
