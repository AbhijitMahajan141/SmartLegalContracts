import "./ViewPatent.css";
import React, { useState } from "react";
import { ethers } from "ethers";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const ViewNewPatent = ({ state, currentAccount }) => {
  const [token, setToken] = useState();
  const [applicant, setApplicant] = useState();
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [applicantType, setApplicantType] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantAadhar, setApplicantAadhar] = useState("");
  const [applicantAddress, setApplicantAddress] = useState("");
  const [patentTitle, setPatentTitle] = useState("");
  const [patentType, setPatentType] = useState("");
  const [patentDesc, setPatentDesc] = useState("");
  // const [patentAmount, setPatentAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setToken("");
    setApplicant("");
    setApplicantType("");
    setApplicantName("");
    setApplicantAadhar("");
    setApplicantAddress("");
    setPatentTitle("");
    setPatentType("");
    setPatentDesc("");
    // setPatentAmount("");
  };
  let account = currentAccount;

  const getContract = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = document.querySelector("#token").value;
      // console.log(token);
      if (token) {
        const application = await state.new_patent_contract.applicant_info(
          token
        );
        const patentData = await state.new_patent_contract.patent_info(token);

        const isApproved = await state.new_patent_contract.getApproved(token);
        const isRejected = await state.new_patent_contract.getRejected(token);

        // console.log(agreement, licensor, licensee);

        if (
          ethers.BigNumber.from(application.application_id).toNumber() !== 0 &&
          application.applicant !== "" &&
          patentData.applicant !== ""
        ) {
          if (application.applicant.toLowerCase() === account) {
            setToken(
              ethers.BigNumber.from(application.application_id).toNumber()
            );
            setApplicant(application.applicant);
            setApplicantType(application.applicantType);
            setApplicantName(application._Fname);
            setApplicantAadhar(
              ethers.BigNumber.from(application._aadhar_no).toNumber()
            );
            setApplicantAddress(application._Faddr);
            setPatentTitle(patentData.inventionTitle);
            setPatentType(patentData.inventionType);
            setPatentDesc(patentData.inventionDescription);
            // setPatentAmount(
            //   ethers.BigNumber.from(patentData.amount).toNumber()
            // );
            setApproved(isApproved);
            setRejected(isRejected);

            setOpen(true);
          } else {
            setLoading(false);
            toast.warning("Please enter your token number!!!", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            // alert("Please enter your token number!!!");
          }
        } else {
          setLoading(false);
          toast.warning("The Contract Token does not Exist!!!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          // alert("The Contract Token does not Exist!");
        }
      } else {
        setLoading(false);
        toast.warning("Please Enter a Token!!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      // alert(error.message);
    }
    setLoading(false);
  };

  const convertPdf = () => {
    html2canvas(document.querySelector("#view-patent")).then((canvas) => {
      let base64image = canvas.toDataURL("image/png");
      // console.log(base64image);
      let pdf = new jsPDF("p", "px", [450, 650]);
      pdf.addImage(base64image, "PNG", 15, 15);
      pdf.save("PatentApplication.pdf");
    });
  };

  return (
    <div className="viewPatent-container">
      {!token && !applicant ? (
        <div>
          <form className="form" onSubmit={getContract}>
            <label htmlFor="index" className="label">
              Enter Your Token:
            </label>
            <input type="number" className="inputz" id="token" required />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? <CircularProgress size={25} /> : "Submit"}
            </button>
          </form>
        </div>
      ) : (
        <>
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
              <>
                {!approved && !rejected ? (
                  <div className="view-contract" id="view-trademark">
                    <h1 style={{ color: "#8DD8E8" }}>Patent Application</h1>
                    <span className="txt">Agreement Id: {token}</span>
                    <span className="txt">
                      Applicant Metamask address: {applicant}
                    </span>
                    <span className="txt">
                      Your Application is under scrutiny.
                    </span>
                  </div>
                ) : approved ? (
                  <div className="view-contract" id="view-trademark">
                    <h1 style={{ color: "#8DD8E8" }}>Patent Application</h1>
                    <span className="txt">Agreement Id: {token}</span>
                    <span className="txt">
                      Applicant Metamask address: {applicant}
                    </span>
                    <span style={{ color: "green" }}>
                      Your Application is Approved!!!
                    </span>
                    <span style={{ color: "#8dd8e8", margin: ".5rem" }}>
                      Applicant Type: {applicantType}
                    </span>
                    <span style={{ color: "#8dd8e8", margin: ".5rem" }}>
                      Applicant Aadhar: {applicantAadhar}
                    </span>
                    <span style={{ color: "#8dd8e8", margin: ".5rem" }}>
                      Applicant Name: {applicantName}
                    </span>
                    <span style={{ color: "#8dd8e8", margin: ".5rem" }}>
                      Applicant Address: {applicantAddress}
                    </span>
                    <span style={{ color: "#8dd8e8", margin: ".5rem" }}>
                      Patent Title: {patentTitle}
                    </span>
                    <span style={{ color: "#8dd8e8", margin: ".5rem" }}>
                      Patent type: {patentType}
                    </span>
                    <span style={{ color: "#8dd8e8", margin: ".5rem" }}>
                      Patent Description: {patentDesc}
                    </span>
                  </div>
                ) : (
                  <div className="view-contract" id="view-trademark">
                    <h1 style={{ color: "#8DD8E8" }}>Patent Application</h1>
                    <span className="txt">Agreement Id: {token}</span>
                    <span className="txt">
                      Applicant Metamask address: {applicant}
                    </span>
                    <span className="txt">Your Application is Rejected!!!</span>
                  </div>
                )}
              </>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={convertPdf}
                  type="primary"
                  className="downloadPdf"
                >
                  Download PDF
                </button>
                <button onClick={handleClose} className="close-btn">
                  Close
                </button>
              </div>
            </Box>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ViewNewPatent;
