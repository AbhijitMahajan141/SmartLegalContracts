import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const AdminTrademark = ({ state }) => {
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [token, setToken] = useState();
  const [applicantMetamask, setApplicantMetamask] = useState("");
  const [applicantAadhar, setApplicantAadhar] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantAddress, setApplicantAddress] = useState("");
  const [applicantState, setApplicantState] = useState("");
  const [applicantContact, setApplicantContact] = useState("");
  const [trademarkName, setTrademarkName] = useState("");
  const [trademarkClass, setTrademarkClass] = useState("");
  const [trademarkDesc, setTrademarkDesc] = useState("");

  const handleModalOpen = (applicant) => {
    setSelectedApplicant(applicant);
    setToken(ethers.BigNumber.from(applicant.token).toNumber());
    setApplicantMetamask(applicant.applicant);
    setApplicantAadhar(ethers.BigNumber.from(applicant.aadharNo).toNumber());
    setApplicantName(applicant.name);
    setApplicantAddress(applicant.addr);
    setApplicantState(applicant.state);
    setApplicantContact(ethers.BigNumber.from(applicant.contact).toNumber());

    getApplicantPatent(ethers.BigNumber.from(applicant.token).toNumber());

    setModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedApplicant(null);

    setApplicantMetamask("");
    setApplicantAadhar("");
    setApplicantName("");
    setApplicantAddress("");
    setApplicantState("");
    setApplicantContact("");
    setTrademarkName("");
    setTrademarkClass("");
    setTrademarkDesc("");
    setModalOpen(false);
  };

  const getPatentApplications = async () => {
    try {
      const totalTrademark = await state.trademark_contract.total_trademark();

      // setTotalPatent(ethers.BigNumber.from(totalPatent).toNumber());

      const applicants = [];
      for (let i = 1; i <= totalTrademark; i++) {
        const approved = await state.trademark_contract.getApproved(i);
        console.log(approved);
        if (!approved) {
          const applicant = await state.trademark_contract.applicants(i);
          applicants.push(applicant);
        }
      }
      setApplicants(applicants);
    } catch (error) {
      console.log(error);
    }
  };

  const getApplicantPatent = async (id) => {
    try {
      const trademarkData = await state.trademark_contract.trademarks(id);
      setTrademarkName(trademarkData.trademarkName);
      setTrademarkClass(trademarkData.trademarkClass);
      setTrademarkDesc(trademarkData.trademarkDescription);
      // setPatentAmount(ethers.BigNumber.from(patentData.amount).toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  const approval = async (applicantId) => {
    // e.preventDefault();

    try {
      setLoading(true);
      console.log(applicantId);
      const approve = await state.trademark_contract.approve(applicantId);
      await approve.wait();
      console.log(ethers.BigNumber.from(approve.value).toNumber());

      // setModalOpen(true);
      setLoading(false);
      toast.success("The Application has been approved", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong:" + error, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      // console.log(error);
    }
  };

  const rejection = async (id) => {
    try {
      setLoading(true);
      const reject = await state.trademark_contract.reject(id);
      await reject.wait();

      setLoading(false);
      setModalOpen(false);
      toast.success("The Application has rejected approved", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong:" + error, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  useEffect(() => {
    getPatentApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-container">
      <span style={{ color: "#8DD8E8", fontSize: "2em" }}>
        Trademark Application's
      </span>
      <div className="patent-section">
        {applicants.map((applicant) => (
          <div
            key={ethers.BigNumber.from(applicant.token).toNumber()}
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "1rem",
              backgroundColor: "#03236e",
              padding: "1rem",
              borderRadius: "17px",
              width: "100%",
            }}
            onClick={() => handleModalOpen(applicant)}
          >
            <center>
              <span>{ethers.BigNumber.from(applicant.token).toNumber()}</span>
            </center>

            <div className="span-cont">
              <span className="col1">Applicant metamask Id:</span>
              <span className="col2">{applicant.applicant}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Applicant Aadhar No.: </span>
              <span className="col2">
                {ethers.BigNumber.from(applicant.aadharNo).toNumber()}
              </span>
            </div>
            <div className="span-cont">
              <span className="col1">Applicant Name:</span>
              <span className="col2">{applicant.name}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Applicant Address:</span>
              <span className="col2">{applicant.addr}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Applicant State:</span>
              <span className="col2">{applicant.state}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Applicant Contact: </span>
              <span className="col2">
                {ethers.BigNumber.from(applicant.contact).toNumber()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <>
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#8DD8E8",
              }}
              id="view-patent"
            >
              <center>
                <h1 style={{ marginBottom: "1rem" }}>Trademark Application</h1>
              </center>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#03236e",
                  padding: "1rem",
                  borderRadius: "17px",
                }}
              >
                <center>
                  <h3 style={{ marginBottom: "1rem" }}>Applicant Data</h3>
                </center>
                <div className="span-cont">
                  <span className="col1">Applicant Metamask address:</span>
                  <span className="col2">{applicantMetamask}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Applicant Aadhar:</span>
                  <span className="col2">{applicantAadhar}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Applicant Name:</span>
                  <span className="col2">{applicantName}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Applicant address:</span>
                  <span className="col2">{applicantAddress}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Applicant state:</span>
                  <span className="col2">{applicantState}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Applicant contact:</span>
                  <span className="col2">{applicantContact}</span>
                </div>

                <center>
                  <h3 style={{ margin: "1rem" }}>Patent Data</h3>
                </center>
                <div className="span-cont">
                  <span className="col1">Trademark Name: </span>
                  <span className="col2">{trademarkName}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Trademark Class: </span>
                  <span className="col2">{trademarkClass}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Trademark Description: </span>
                  <span className="col2">{trademarkDesc}</span>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                margin: "1rem",
              }}
            >
              <button
                onClick={() => approval(token)}
                type="primary"
                className="downloadPdf"
              >
                {loading ? <CircularProgress size={25} /> : "Approve"}
              </button>
              <button onClick={() => rejection(token)} className="close-btn">
                {loading ? <CircularProgress size={25} /> : "Reject"}
              </button>
              <button onClick={handleModalClose} className="close-btn">
                Close
              </button>
            </div>
          </Box>
        </Modal>
      </>
    </div>
  );
};

export default AdminTrademark;
