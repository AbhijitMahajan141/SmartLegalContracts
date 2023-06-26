import React, { useEffect, useState } from "react";
import "./Admin/Admin.css";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const AllTenders = ({ state, currentAccount }) => {
  const [allTenders, setAllTenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");

  const [afterAssignopen, afterAssignsetOpen] = useState(false);
  // // const [assignedTenderId, setAssignedTenderId] = useState("");
  // const [assignedTenderDetails, setAssignedTenderDetails] = useState();
  // const [assignedBidderDetails, setAssignedBidderDetails] = useState();

  const [tenderId, setTenderId] = useState("");
  // const [userTender, setUsertender] = useState("");

  const [selectedTender, setSelectedTender] = useState("");
  const [organizationChain, setOrganizationChain] = useState("");
  const [tenderTitle, setTenderTitle] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [tenderCategory, setTenderCategory] = useState("");
  const [preQualification, setPreQualification] = useState("");
  const [location, setLocation] = useState("");
  const [tenderbudget, setTenderbudget] = useState("");
  const [bidValidity, setBidValidity] = useState("");
  const [periodOfWork, setPeriodOfWork] = useState("");

  const [applicant, setApplicant] = useState();
  const [companyLicenseName, setcompanyLicenseName] = useState();
  const [companyRegistrationNumber, setcompanyRegistrationNumber] = useState();
  const [registeredAddress, setregisteredAddress] = useState();
  const [pin, setpin] = useState();
  const [legalStatus, setlegalStatus] = useState();
  const [proposedBudget, setproposedBudget] = useState();
  const [scopeandapproach, setscopeandapproach] = useState();
  const [prevprojandqualification, setprevprojandqualification] = useState();
  // const [wonTenderId, setwonTenderId] = useState();

  const handleType = (event) => {
    setType(event.target.value);
  };

  const handleOpen = (t) => {
    setTenderId(t);
    setOpen(true);
  };
  const handleClose = () => {
    // setLoading(false);
    setOpen(false);
  };

  const afterAssignhandleOpen = async (t) => {
    // setAssignedTenderId(t);
    await assignedData(t);
    afterAssignsetOpen(true);
  };
  const afterAssignhandleClose = () => {
    // setLoading(false);
    // setAssignedTenderId("");
    // setAssignedTenderDetails("");
    // setAssignedBidderDetails("");
    setSelectedTender("");
    setOrganizationChain("");
    setTenderTitle("");
    setWorkDesc("");
    setTenderCategory("");
    setPreQualification("");
    setLocation("");
    setTenderbudget("");
    setBidValidity("");
    setPeriodOfWork("");
    afterAssignsetOpen(false);
  };

  const getTenders = async () => {
    try {
      const totalTenders = await state.tenders_contract.totalTenders();

      // setTotalPatent(ethers.BigNumber.from(totalPatent).toNumber());

      const tenders = [];
      for (let i = 1; i <= totalTenders; i++) {
        const t = await state.tenders_contract.tenderDetails(i);

        // if (!t.tendorClosed) {
        tenders.push(t);
        // }
      }
      setAllTenders(tenders);
    } catch (error) {
      toast.error("Something went wrong" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const biddingData = async () => {
    // e.preventDefault();
    try {
      setLoading(true);

      const _appli = document.querySelector("#appli").value;
      const _companyName = document.querySelector("#companyLicenseName").value;
      const _companyRegNum = document.querySelector(
        "#companyRegistrationNumber"
      ).value;

      const _regAddress = document.querySelector("#registeredAddress").value;
      const _pin = document.querySelector("#pin").value;
      const _legalStatus = type;
      const _proposedBudget = document.querySelector("#proposedBudget").value;
      const _scopeandapproach =
        document.querySelector("#scopeandapproach").value;
      const _exp = document.querySelector("#prevprojandqualification").value;

      const tendorData = await state.tenders_contract.bidderData(
        ethers.BigNumber.from(tenderId).toNumber(),
        _appli,
        _companyName,
        _companyRegNum,
        _regAddress,
        _pin,
        _legalStatus,
        _proposedBudget,
        _scopeandapproach,
        _exp
      );
      await tendorData.wait();

      setTenderId("");
      setType("");
      setOpen(false);
      setLoading(false);
      // hasSubmitted();
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      console.log(error.message);
    }
  };

  const assignedData = async (tId) => {
    try {
      const tender = await state.tenders_contract.tenderDetails(
        ethers.BigNumber.from(tId).toNumber()
      );
      setSelectedTender(ethers.BigNumber.from(tender.tenderId).toNumber());
      setOrganizationChain(tender.organizationChain);
      setTenderTitle(tender.tenderTitle);
      setWorkDesc(tender.workDescription);
      setTenderCategory(tender.tenderCategory);
      setPreQualification(tender.preQualification);
      setLocation(tender.location);
      setTenderbudget(ethers.BigNumber.from(tender.tenderBudget).toNumber());
      setBidValidity(ethers.BigNumber.from(tender.bidValidity).toNumber());
      setPeriodOfWork(ethers.BigNumber.from(tender.periodOfWork).toNumber());
      // setAssignedTenderDetails(tender);

      const jlen = await state.tenders_contract.totalBidders(
        ethers.BigNumber.from(tId).toNumber()
      );
      for (let j = 0; j < ethers.BigNumber.from(jlen).toNumber(); j++) {
        const bidderdetails = await state.tenders_contract.bidderDetails(
          ethers.BigNumber.from(tId).toNumber(),
          j
        );
        if (
          ethers.BigNumber.from(bidderdetails.wonTenderId).toNumber() ===
          ethers.BigNumber.from(tId).toNumber()
        ) {
          // setAssignedBidderDetails(bidderdetails);
          // console.log(assignedBidderDetails);
          setApplicant(bidderdetails.applicant);
          setcompanyLicenseName(bidderdetails.companyLicenseName);
          setcompanyRegistrationNumber(bidderdetails.companyRegistrationNumber);
          setregisteredAddress(bidderdetails.registeredAddress);
          setpin(ethers.BigNumber.from(bidderdetails.pin).toNumber());
          setlegalStatus(bidderdetails.legalStatus);
          setproposedBudget(
            ethers.BigNumber.from(bidderdetails.proposedBudget).toNumber()
          );
          setscopeandapproach(bidderdetails.scopeandapproach);
          setprevprojandqualification(bidderdetails.prevprojandqualification);
          // setwonTenderId();
        }
      }
    } catch (error) {
      toast.error("Something went wrong" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      console.log(error.message);
    }
  };

  useEffect(() => {
    getTenders();
    // hasSubmitted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tenders-section">
      <h1 style={{ color: "#8dd8e8" }}>All Open Tenders</h1>
      <div className="tender-card">
        {allTenders.map((tender) => (
          <div
            key={ethers.BigNumber.from(tender.tenderId).toNumber()}
            className="individual-tender"
            // onClick={() => handleModalOpen(tender)}
          >
            <center>
              <span>
                TenderId: {ethers.BigNumber.from(tender.tenderId).toNumber()}
              </span>
            </center>
            <div className="span-cont">
              <span className="col1">Organization Chain:</span>
              <span className="col2"> {tender.organizationChain}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Tender Title: </span>
              <span className="col2"> {tender.tenderTitle}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Work Description:</span>
              <span className="col2"> {tender.workDescription}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Tender Category: </span>
              <span className="col2"> {tender.tenderCategory}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Pre-Qualification: </span>
              <span className="col2"> {tender.preQualification}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Work Location: </span>
              <span className="col2"> {tender.location}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Tender Budget:</span>
              <span className="col2">
                Rs. {ethers.BigNumber.from(tender.tenderBudget).toNumber()}
              </span>
            </div>
            <div className="span-cont">
              <span className="col1">Bid Validity:</span>
              <span className="col2">
                {ethers.BigNumber.from(tender.bidValidity).toNumber()} days
              </span>
            </div>
            <div className="span-cont">
              <span className="col1">Period of Work(Deadline):</span>
              <span className="col2">
                {ethers.BigNumber.from(tender.periodOfWork).toNumber()} days
              </span>
            </div>
            <center>
              <span>
                {
                  tender.tendorClosed ? (
                    //
                    tender.wonBidderId.toLowerCase() === currentAccount ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span>
                          The tender has been assigned to you:
                          {tender.wonBidderId}
                        </span>
                        <button
                          className="bestBid-btn"
                          onClick={() => {
                            afterAssignhandleOpen(tender.tenderId);
                          }}
                        >
                          View Detail's
                        </button>
                      </div>
                    ) : (
                      <span>The Tender has been closed for application's.</span>
                    )
                  ) : (
                    // tender.tenderId === userTender ? (
                    <>
                      <button
                        className="bestBid-btn"
                        onClick={
                          () => {
                            handleOpen(tender.tenderId);
                          }
                          //     () => {
                          //   biddingData(tender.tenderId);
                          // }
                        }
                      >
                        Apply to Tender
                      </button>
                    </>
                  )
                  // ) : (
                  //   <span>You have already applied to tender!</span>
                  // )
                }
              </span>
            </center>
          </div>
        ))}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        // aria-labelledby="child-modal-title"
        // aria-describedby="child-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40vw",
            height: "90vh",
            bgcolor: "#0F2557",
            // border: "2px solid #000",
            borderRadius: "17px",
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
            // width: "200px",
            overflow: "auto",
          }}
        >
          <center>
            <h1 style={{ color: "#8dd8e8" }}>Please Enter Details</h1>
          </center>
          <>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": {
                  m: 1,
                  width: "100%",
                  // color: "white",
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "5px",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="appli"
                label="Applicants Metamask"
                placeholder="Eg.Ax0aksjdjk24jbjkb2jkb34234dsfsdfsf434"
                required
                // multiline
                // maxRows={2}
              />

              <TextField
                id="companyLicenseName"
                label="Company/License Name"
                placeholder="Eg.ABC Company"
                required
                // multiline
                // maxRows={2}
              />

              <TextField
                id="companyRegistrationNumber"
                label="Company Registration Number"
                placeholder="Eg.LTECHNMH2000PLC123456"
                required
              />

              <TextField
                id="registeredAddress"
                label="Registered Address"
                placeholder="Eg.Registered address of the company here."
                required
                multiline
                maxRows={2}
              />

              <TextField
                id="pin"
                label="Pin"
                placeholder="Eg.422116"
                required
                type="number"
              />

              <FormControl
                sx={{
                  m: 1,
                  minWidth: 200,
                  backgroundColor: "white",
                  borderRadius: "9px",
                }}
              >
                <InputLabel id="legalStatus">Legal Status</InputLabel>
                <Select
                  labelId="legalStatus"
                  id="legalStatus"
                  value={type}
                  onChange={handleType}
                  autoWidth
                  label="type"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="limited">Limited Company</MenuItem>
                  <MenuItem value="Undertaking">Undertaking</MenuItem>
                  <MenuItem value="Jointventure">Jointventure</MenuItem>
                  <MenuItem value="Partnership">Partnership</MenuItem>
                </Select>
              </FormControl>

              <TextField
                id="proposedBudget"
                label="Proposed Budget"
                placeholder="Eg.600000"
                type="number"
                required
              />

              <TextField
                id="scopeandapproach"
                label="Scope and Approach of Work"
                placeholder="Eg.Some Scope and Approach of Work"
                required
              />

              <TextField
                id="prevprojandqualification"
                label="Previous project and details"
                placeholder="Eg.Some Previous project and details"
                required
              />
            </Box>

            <button onClick={biddingData} className="bestBid-btn">
              {loading ? <CircularProgress size={25} /> : "Submit"}
            </button>
          </>
        </Box>
      </Modal>

      <Modal
        open={afterAssignopen}
        onClose={afterAssignhandleClose}
        // aria-labelledby="child-modal-title"
        // aria-describedby="child-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vw",
            height: "90vh",
            bgcolor: "#0F2557",
            // border: "2px solid #000",
            borderRadius: "17px",
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
            // width: "200px",
            overflow: "auto",
          }}
        >
          <center>
            <h1 style={{ color: "#8dd8e8" }}>Tender Contract</h1>
          </center>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="individual-tender">
              <center>
                <span style={{ fontSize: "1.5em" }}>Tender Detail's</span>
                <br />
                <span>TenderId: {selectedTender}</span>
              </center>
              <div className="span-cont">
                <span className="col1">Organization Chain:</span>
                <span className="col2">{organizationChain}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Tender Title: </span>
                <span className="col2"> {tenderTitle}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Work Description:</span>
                <span className="col2">{workDesc}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Tender Category: </span>
                <span className="col2">{tenderCategory}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Pre-Qualification: </span>
                <span className="col2">{preQualification}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Work Location: </span>
                <span className="col2"> {location}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Tender Budget:</span>
                <span className="col2">Rs. {tenderbudget}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Bid Validity:</span>
                <span className="col2">{bidValidity} days</span>
              </div>
              <div className="span-cont">
                <span className="col1">Period of Work(Deadline):</span>
                <span className="col2">{periodOfWork} days</span>
              </div>
            </div>

            <div className="individual-tender">
              <center>
                <span style={{ fontSize: "1.5em" }}>Bidder Detail's</span>
              </center>
              <div className="span-cont">
                <span className="col1">Applicant Metamask:</span>
                <span className="col2">{applicant}</span>
              </div>
              <div className="span-cont">
                <span className="col1">company Licensed Name: </span>
                <span className="col2"> {companyLicenseName}</span>
              </div>
              <div className="span-cont">
                <span className="col1">company Registration Number:</span>
                <span className="col2">{companyRegistrationNumber}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Registered Address: </span>
                <span className="col2">{registeredAddress}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Pin: </span>
                <span className="col2">{pin}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Legal Status: </span>
                <span className="col2"> {legalStatus}</span>
              </div>
              <div className="span-cont">
                <span className="col1">proposed Budget:</span>
                <span className="col2">Rs. {proposedBudget}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Scope and Approach:</span>
                <span className="col2">{scopeandapproach}</span>
              </div>
              <div className="span-cont">
                <span className="col1">Qualification & Experience:</span>
                <span className="col2">{prevprojandqualification}</span>
              </div>
            </div>
          </div>
          <center>
            <h3 style={{ color: "#8dd8e8", marginBottom: "10px" }}>
              A contract has been formed between the Tender Entity and Bidder
              Entity stating that the tender with tenderID {selectedTender}{" "}
              titled {tenderTitle} has been assigned to {companyLicenseName} and
              the assigned entity has accepted to all the terms and conditions
              stated in tender. The assigned entity takes full responsibility of
              the completion of work in given time and following legal
              procedure's.
            </h3>
          </center>
          <center>
            <button className="close-btn" onClick={afterAssignhandleClose}>
              close
            </button>
          </center>
        </Box>
      </Modal>
    </div>
  );
};

export default AllTenders;
