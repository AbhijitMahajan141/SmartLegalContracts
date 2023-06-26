import React, { useEffect, useState } from "react";
import "./Admin.css";
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

const Tenders = ({ state, currentAccount }) => {
  // let wonBidder = currentAccount;
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [bidderDetails, setBidderDetails] = useState(false);
  const [allTenders, setAllTenders] = useState([]);
  const [allBidders, setAllBidders] = useState([]);

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

  const [hideAsignTender, setHideAssignTender] = useState(false);

  const handleType = (event) => {
    setType(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };

  const bidderDetailsOpen = (id) => {
    allBids(id);
    setBidderDetails(true);
  };
  const bidderDetailsClose = () => {
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
    setBidderDetails(false);
    setHideAssignTender(false);
  };

  const uploadTender = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const _organizationChain =
        document.querySelector("#organizationChain").value;
      const _tenderTitle = document.querySelector("#tenderTitle").value;
      const _workDesc = document.querySelector("#workDesc").value;
      const _tenderCategory = type;
      const _PreQualification =
        document.querySelector("#PreQualification").value;
      const _location = document.querySelector("#location").value;
      const _tenderBudget = document.querySelector("#tenderBudget").value;
      const _bidValidity = document.querySelector("#bidValidity").value;
      const _periodOfWork = document.querySelector("#periodOfWork").value;

      const tendorData = await state.tenders_contract.tendorData(
        _organizationChain,
        _tenderTitle,
        _workDesc,
        _tenderCategory,
        _PreQualification,
        _location,
        _tenderBudget,
        _bidValidity,
        _periodOfWork
      );
      await tendorData.wait();

      setOpen(false);
      setType("");
      setLoading(false);
      getTenders();
      toast.success("Tender Created Successfully", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const getTenders = async () => {
    try {
      const totalTenders = await state.tenders_contract.totalTenders();

      // setTotalPatent(ethers.BigNumber.from(totalPatent).toNumber());

      const tenders = [];
      for (let i = 1; i <= totalTenders; i++) {
        const t = await state.tenders_contract.tenderDetails(i);
        tenders.push(t);
      }
      setAllTenders(tenders);
    } catch (error) {
      toast.error("Something went wrong" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const closeTender = async (id) => {
    try {
      setLoading(true);

      const closeTender = await state.tenders_contract.closeTender(id);
      await closeTender.wait();

      getTenders();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong" + error.error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const getWinningBid = async (Id) => {
    try {
      setLoading(true);

      const getWinningBid = await state.tenders_contract.getWinningBid(Id);
      await getWinningBid.wait();
      console.log(ethers.BigNumber.from(getWinningBid.value).toNumber());
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const allBids = async (tenderId) => {
    try {
      const bidders = [];
      const jlen = await state.tenders_contract.totalBidders(tenderId);
      const tender = await state.tenders_contract.tenderDetails(tenderId);

      for (let j = 0; j < ethers.BigNumber.from(jlen).toNumber(); j++) {
        const bidderdetails = await state.tenders_contract.bidderDetails(
          tenderId,
          j
        );
        if (
          ethers.BigNumber.from(bidderdetails.wonTenderId).toNumber() ===
          ethers.BigNumber.from(tenderId).toNumber()
        ) {
          setHideAssignTender(true);
        }
        bidders.push(bidderdetails);
      }

      setAllBidders(bidders);
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
      // console.log(tender);
      // console.log(bidders);
    } catch (error) {
      console.log(error);
    }
  };

  const assignTender = async (tId, bId) => {
    try {
      setLoading(true);
      let appli = "";
      const jlen = await state.tenders_contract.totalBidders(tId);

      for (let j = 0; j < ethers.BigNumber.from(jlen).toNumber(); j++) {
        const bidderdetails = await state.tenders_contract.bidderDetails(
          tId,
          j
        );
        // console.log(bidderdetails.applicant, bidderdetails.bidderId, bId);
        if (ethers.BigNumber.from(bidderdetails.bidderId).toNumber() === bId) {
          appli = bidderdetails.applicant;
          break;
        }
      }
      console.log(tId, bId, appli);
      // console.log(bd);

      const assignTend = await state.tenders_contract.assignTender(
        tId,
        bId,
        appli
      );
      await assignTend.wait();

      // setHideAssignTender(true);
      setLoading(false);
      setBidderDetails(false);
      toast.success("Tender Assigned Successfully", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  useEffect(() => {
    getTenders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-container">
      <span style={{ color: "#8DD8E8", fontSize: "2em" }}>Create Tender</span>
      <div className="tender-container">
        <button
          style={{
            border: "none",
            padding: "1rem",
            backgroundColor: "#03236e",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
          }}
          onClick={handleOpen}
        >
          Create Tender
        </button>
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
              <h1 style={{ color: "#8dd8e8" }}>Please Enter Tender Details</h1>
            </center>
            <>
              {/* <form className="form" onSubmit={uploadTender}> */}
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
                  id="organizationChain"
                  label="Organization Chain"
                  placeholder="Eg.Defence Research and Development Organisation."
                  required
                  // multiline
                  // maxRows={2}
                />

                <TextField
                  id="tenderTitle"
                  label="Tender Title"
                  placeholder="Eg.ANNUAL MAINTENANCE CONTRACT FOR KONICA MINOLTA COLOUR AND MONOCHROME PHOTOCOPIER."
                  required
                  // multiline
                  // maxRows={2}
                />

                <TextField
                  id="workDesc"
                  label="Work Description"
                  placeholder="Eg.ANNUAL MAINTENANCE CONTRACT FOR KONICA MINOLTA COLOUR AND MONOCHROME PHOTOCOPIER AND FAX MACHINE INSTALLED AT THE OFFICE OF PMU BALASORE, MLC AND ILC, DHAMRA"
                  required
                  multiline
                  maxRows={2}
                />

                <FormControl
                  sx={{
                    m: 1,
                    minWidth: 200,
                    backgroundColor: "white",
                    borderRadius: "9px",
                  }}
                >
                  <InputLabel id="tendorCategory">Tender Category</InputLabel>
                  <Select
                    labelId="tendorCategory"
                    id="tendorCategory"
                    value={type}
                    onChange={handleType}
                    autoWidth
                    label="type"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Works">Works</MenuItem>
                    <MenuItem value="Goods">Goods</MenuItem>
                    <MenuItem value="Services">Services</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  id="PreQualification"
                  label="Pre Qualification"
                  placeholder="Eg.Some Basic qualification required by the Bidder."
                  required
                  multiline
                  maxRows={2}
                />

                <TextField
                  id="location"
                  label="Location"
                  placeholder="Eg.Dharma"
                  required
                />

                <TextField
                  id="tenderBudget"
                  label="Tender Budget"
                  placeholder="Eg.600000"
                  type="number"
                  required
                />

                <TextField
                  id="bidValidity"
                  label="Bid Validity"
                  placeholder="Eg.90 (days)"
                  type="number"
                  required
                />

                <TextField
                  id="periodOfWork"
                  label="Period of Work"
                  placeholder="Eg.120 (days)"
                  type="number"
                  required
                />
              </Box>
              <div>
                <button type="submit" className="btn" onClick={uploadTender}>
                  {loading ? <CircularProgress size={25} /> : "Submit"}
                </button>
                <button
                  onClick={handleClose}
                  style={{
                    border: "none",
                    padding: "10px",
                    backgroundColor: "tomato",
                    marginLeft: ".5rem",
                    borderRadius: "5px",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  Close
                </button>
              </div>
              {/* </form> */}
            </>
          </Box>
        </Modal>
      </div>
      {/* <div> */}
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
                <span>{ethers.BigNumber.from(tender.tenderId).toNumber()}</span>
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
                  {ethers.BigNumber.from(tender.tenderBudget).toNumber()}
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: ".5rem",
                }}
              >
                {!tender.tendorClosed ? (
                  <button
                    className="closetender-btn"
                    onClick={() => {
                      closeTender(tender.tenderId);
                    }}
                  >
                    {loading ? <CircularProgress size={25} /> : "Close Tender"}
                  </button>
                ) : (
                  // The tendor has been closed!
                  <>
                    <button
                      className="tenderDetails-btn"
                      onClick={() => {
                        bidderDetailsOpen(tender.tenderId);
                      }}
                    >
                      View Bids
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* </div> */}
      <>
        <Modal
          open={bidderDetails}
          onClose={bidderDetailsClose}
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
              <h1 style={{ color: "#8dd8e8" }}>All Bids</h1>
            </center>
            <div className="allBids-container">
              <div className="allBids-tender">
                <center>
                  <span>Tender Details</span>
                </center>
                <center style={{ margin: "1rem" }}>
                  <span>TenderId {selectedTender}</span>
                </center>
                <div className="span-cont">
                  <span className="col1">Organization Chain:</span>
                  <span className="col2"> {organizationChain}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Tender Title: </span>
                  <span className="col2"> {tenderTitle}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Work Description:</span>
                  <span className="col2"> {workDesc}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Tender Category: </span>
                  <span className="col2"> {tenderCategory}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Pre-Qualification: </span>
                  <span className="col2"> {preQualification}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Work Location: </span>
                  <span className="col2"> {location}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Tender Budget:</span>
                  <span className="col2">{tenderbudget}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Bid Validity:</span>
                  <span className="col2">{bidValidity} days</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Period of Work(Deadline):</span>
                  <span className="col2">{periodOfWork} days</span>
                </div>
                <div>
                  {allBidders.map(
                    (b) =>
                      ethers.BigNumber.from(b.wonTenderId).toNumber() !== 0 && (
                        <div
                          key={ethers.BigNumber.from(b.bidderId).toNumber()}
                          className="individual-bidder"
                        >
                          <center>
                            <span>Tender assigned to </span>
                            <span>
                              BidderId:{" "}
                              {ethers.BigNumber.from(b.bidderId).toNumber()}
                            </span>
                          </center>
                          <div className="span-cont">
                            <span className="col1">Applicant Metamask:</span>
                            <span className="col2">{b.applicant}</span>
                          </div>
                          <div className="span-cont">
                            <span className="col1">Company Name:</span>
                            <span className="col2">{b.companyLicenseName}</span>
                          </div>
                          <div className="span-cont">
                            <span className="col1">
                              Company Registration number:
                            </span>
                            <span className="col2">
                              {b.companyRegistrationNumber}
                            </span>
                          </div>
                          <div className="span-cont">
                            <span className="col1">Proposed Budget:</span>
                            <span className="col2">
                              {ethers.BigNumber.from(
                                b.proposedBudget
                              ).toNumber()}
                            </span>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
              <div className="allBids-tender">
                <center>
                  <span>Bidder Details</span>
                </center>
                {allBidders.map(
                  (bidder) => (
                    // ethers.BigNumber.from(bidder.wonTenderId).toNumber() === 0 ? (

                    <div
                      key={ethers.BigNumber.from(bidder.bidderId).toNumber()}
                      className="individual-bidder"
                      // onClick={() => handleModalOpen(tender)}
                    >
                      <center>
                        <span>
                          BidderId:{" "}
                          {ethers.BigNumber.from(bidder.bidderId).toNumber()}
                        </span>
                      </center>
                      <div className="span-cont">
                        <span className="col1">Applicant Metamask:</span>
                        <span className="col2">{bidder.applicant}</span>
                      </div>
                      <div className="span-cont">
                        <span className="col1">Company Name:</span>
                        <span className="col2">
                          {bidder.companyLicenseName}
                        </span>
                      </div>
                      <div className="span-cont">
                        <span className="col1">
                          Company Registration number:
                        </span>
                        <span className="col2">
                          {bidder.companyRegistrationNumber}
                        </span>
                      </div>
                      <div className="span-cont">
                        <span className="col1">Registered Address:</span>
                        <span className="col2">{bidder.registeredAddress}</span>
                      </div>
                      <div className="span-cont">
                        <span className="col1">Pin:</span>
                        <span className="col2">
                          {ethers.BigNumber.from(bidder.pin).toNumber()}
                        </span>
                      </div>
                      <div className="span-cont">
                        <span className="col1">Legal Status:</span>
                        <span className="col2">{bidder.legalStatus}</span>
                      </div>
                      <div className="span-cont">
                        <span className="col1">Proposed Budget:</span>
                        <span className="col2">
                          {ethers.BigNumber.from(
                            bidder.proposedBudget
                          ).toNumber()}
                        </span>
                      </div>
                      <div className="span-cont">
                        <span className="col1">
                          Scope and Approach to work:
                        </span>
                        <span className="col2">{bidder.scopeandapproach}</span>
                      </div>
                      <div className="span-cont">
                        <span className="col1">
                          Previous Experience and Qualification:
                        </span>
                        <span className="col2">
                          {bidder.prevprojandqualification}
                        </span>
                      </div>

                      {!hideAsignTender ? (
                        <center>
                          <button
                            className="bestBid-btn"
                            onClick={() => {
                              assignTender(
                                ethers.BigNumber.from(
                                  bidder.tenderId
                                ).toNumber(),
                                ethers.BigNumber.from(
                                  bidder.bidderId
                                ).toNumber()
                              );
                            }}
                          >
                            Assign Tender
                          </button>
                        </center>
                      ) : (
                        ""
                      )}
                    </div>
                  )
                  // ) : (
                  //   <div
                  //     key={ethers.BigNumber.from(bidder.bidderId).toNumber()}
                  //     className="individual-bidder"
                  //   >
                  //     <span>
                  //       The Tender has been assigned to :
                  //       {ethers.BigNumber.from(bidder.bidderId).toNumber()}
                  //     </span>
                  //   </div>
                  // )
                )}
              </div>
            </div>
            <center>
              <button
                className="bestBid-btn"
                onClick={() => {
                  getWinningBid(selectedTender);
                }}
              >
                {loading ? <CircularProgress size={25} /> : "Best Bid"}
              </button>
              <button className="close-btn" onClick={bidderDetailsClose}>
                Close
              </button>
            </center>
          </Box>
        </Modal>
      </>
    </div>
  );
};

export default Tenders;
