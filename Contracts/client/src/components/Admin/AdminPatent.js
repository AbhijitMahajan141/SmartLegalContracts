import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const AdminPatent = ({ state }) => {
  // const [totalpatent, setTotalPatent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [token, setToken] = useState();
  const [applicantMetamask, setApplicantMetamask] = useState("");
  const [applicantType, setApplicantType] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantAadhar, setApplicantAadhar] = useState("");
  const [applicantAddress, setApplicantAddress] = useState("");
  const [patentTitle, setPatentTitle] = useState("");
  const [patentType, setPatentType] = useState("");
  const [patentDesc, setPatentDesc] = useState("");
  // const [patentAmount, setPatentAmount] = useState("");

  const handleModalOpen = (applicant) => {
    setSelectedApplicant(applicant);
    setToken(ethers.BigNumber.from(applicant.application_id).toNumber());
    setApplicantMetamask(applicant.applicant);
    setApplicantType(applicant.applicantType);
    setApplicantName(applicant._Fname);
    setApplicantAadhar(ethers.BigNumber.from(applicant._aadhar_no).toNumber());
    setApplicantAddress(applicant._Faddr);

    getApplicantPatent(
      ethers.BigNumber.from(applicant.application_id).toNumber()
    );

    setModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedApplicant(null);
    setApplicantMetamask("");
    setApplicantType("");
    setApplicantName("");
    setApplicantAadhar("");
    setApplicantAddress("");
    setPatentTitle("");
    setPatentType("");
    setPatentDesc("");
    // setPatentAmount("");
    setModalOpen(false);
  };

  const getPatentApplications = async () => {
    try {
      const totalPatent = await state.new_patent_contract.total_patent();

      // setTotalPatent(ethers.BigNumber.from(totalPatent).toNumber());

      const applicants = [];
      for (let i = 1; i <= totalPatent; i++) {
        const approved = await state.new_patent_contract.getApproved(i);
        if (!approved) {
          const applicant = await state.new_patent_contract.applicant_info(i);
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
      const patentData = await state.new_patent_contract.patent_info(id);
      setPatentTitle(patentData.inventionTitle);
      setPatentType(patentData.inventionType);
      setPatentDesc(patentData.inventionDescription);
      // setPatentAmount(ethers.BigNumber.from(patentData.amount).toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  const approval = async (applicantId) => {
    try {
      setLoading(true);
      const approve = await state.new_patent_contract.approve(applicantId);
      await approve.wait();

      // setModalOpen(true);
      setLoading(false);
      setModalOpen(false);
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
      const reject = await state.new_patent_contract.reject(id);
      await reject.wait();

      setLoading(false);
      setModalOpen(false);
      toast.success("The Application has been rejected", {
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
        Patent Application's
      </span>
      <div className="patent-section">
        {applicants.map((applicant) => (
          <div
            key={ethers.BigNumber.from(applicant.application_id).toNumber()}
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
              <span>
                {ethers.BigNumber.from(applicant.application_id).toNumber()}
              </span>
            </center>
            <div className="span-cont">
              <span className="col1">Applicant metamask Id:</span>
              <span className="col2">{applicant.applicant}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Applicant Type:</span>
              <span className="col2">{applicant.applicantType}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Applicant Name:</span>
              <span className="col2">{applicant._Fname}</span>
            </div>
            <div className="span-cont">
              <span className="col1">Applicant Aadhar No.:</span>
              <span className="col2">
                {ethers.BigNumber.from(applicant._aadhar_no).toNumber()}
              </span>
            </div>
            <div className="span-cont">
              <span className="col1">Applicant Address:</span>
              <span className="col2">{applicant._Faddr}</span>
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
                <h1 style={{ marginBottom: "1rem" }}>Patent Application</h1>
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
                  <span className="col1">Applicant metamask Id:</span>
                  <span className="col2">{applicantMetamask}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Applicant Type:</span>
                  <span className="col2">{applicantType}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Applicant Name:</span>
                  <span className="col2">{applicantName}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Applicant Aadhar No.:</span>
                  <span className="col2">{applicantAadhar}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Applicant Address:</span>
                  <span className="col2">{applicantAddress}</span>
                </div>

                <center>
                  <h3 style={{ margin: "1rem" }}>Patent Data</h3>
                </center>
                <div className="span-cont">
                  <span className="col1">Patent Title:</span>
                  <span className="col2">{patentTitle}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Patent Type:</span>
                  <span className="col2">{patentType}</span>
                </div>
                <div className="span-cont">
                  <span className="col1">Patent Description:</span>
                  <span className="col2">{patentDesc}</span>
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

export default AdminPatent;
