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

const ViewPatent = ({ state, currentAccount }) => {
  const [contractId, setContractId] = useState();
  const [licensor, setLicensor] = useState("");
  const [licensee, setLicensee] = useState("");
  const [patentNumber, setPatentNumber] = useState("");
  const [amount, setAmount] = useState();
  const [statee, setStatee] = useState("");
  const [createdTimestamp, setCreatedTimestamp] = useState();
  const [licensorAadhar, setLicensorAadhar] = useState();
  const [licensorName, setLicensorName] = useState("");
  const [licensorAddress, setLicensorAddress] = useState("");
  const [licenseeName, setLicenseeName] = useState("");
  const [licenseeAadhar, setLicenseeAadhar] = useState();
  const [licenseeAddress, setLicenseeAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setContractId(null);
    setLicensor(null);
    setLicensee(null);
    setPatentNumber(null);
    setAmount(null);
    setStatee(null);
    setCreatedTimestamp(null);
    setLicensorAadhar(null);
    setLicensorName(null);
    setLicensorAddress(null);
    setLicenseeName(null);
    setLicenseeAadhar(null);
    setLicenseeAddress(null);
  };
  let account = currentAccount;

  const getContract = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = document.querySelector("#token").value;
      // console.log(token);
      if (token) {
        const agreement = await state.patent_contract.agreement_info(token);
        const licensor = await state.patent_contract.licensor_info(token);
        const licensee = await state.patent_contract.licensee_info(token);

        // console.log(agreement, licensor, licensee);

        if (
          ethers.BigNumber.from(agreement.agreement_id).toNumber() !== 0 &&
          licensor._name !== "" &&
          licensee._name !== ""
        ) {
          if (
            agreement.licensor.toLowerCase() === account ||
            agreement.licensee.toLowerCase() === account
          ) {
            setContractId(
              ethers.BigNumber.from(agreement.agreement_id).toNumber()
            );
            setLicensor(agreement.licensor);
            setLicensee(agreement.licensee);
            setPatentNumber(agreement.patent_number);
            setAmount(ethers.BigNumber.from(agreement.amount).toNumber());
            setStatee(agreement.state);
            setCreatedTimestamp(
              ethers.BigNumber.from(agreement.createdTimestamp).toNumber()
            );

            setLicensorName(licensor._name);
            setLicenseeName(licensee._name);
            setLicensorAddress(licensor._addr);
            setLicenseeAddress(licensee._addr);
            setLicensorAadhar(
              ethers.BigNumber.from(licensor._aadhar_no).toNumber()
            );
            setLicenseeAadhar(
              ethers.BigNumber.from(licensee._aadhar_no).toNumber()
            );
            setOpen(true);
          } else {
            toast.warning("Please enter your token number!!!", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            // alert("Please enter your token number!!!");
          }
        } else {
          toast.warning("The Contract Token does not Exist!!!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          // alert("The Contract Token does not Exist!");
        }
      } else {
        toast.warning("Please Enter a Token!!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (error) {
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
      pdf.save("PatentOwnershipTransfer.pdf");
    });
  };

  return (
    <div className="viewPatent-container">
      <h1 style={{ color: "whitesmoke" }}>Your Patent Contract</h1>
      {!contractId && !licensorName && !licenseeName ? (
        <div>
          <form className="form" onSubmit={getContract}>
            <label htmlFor="index" className="label">
              Enter Your Contract Token:
            </label>
            <input type="number" step="any" className="inputz" id="token" />
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
              <div className="view-contract" id="view-patent">
                <h1 style={{ color: "#8DD8E8" }}>
                  Patent Ownership Transfer Contract
                </h1>
                <span className="txt">Agreement Id: {contractId}</span>
                <span className="txt">Licensor: {licensor}</span>
                <span className="txt">Licensee: {licensee}</span>
                <p
                  align="justify"
                  style={{ color: "#8DD8E8", margin: "5px 70px" }}
                >
                  The Agreement is hearby entered into on this date{" "}
                  <b>{new Date(createdTimestamp * 1000).toLocaleString()}</b>{" "}
                  between Mr/Mrs. <b>{licensorName}</b> with Aadhar ID{" "}
                  <b>{licensorAadhar}</b> and Mr/Mrs. <b>{licenseeName}</b> with
                  Aadhar ID {licenseeAadhar} for the purpose of transfering the
                  ownership of Patent <b>{patentNumber}</b> from Mr/Mrs.{" "}
                  {licensorName} to Mr/Mrs. {licenseeName}.
                </p>
                <span className="txt">Licensor: {licensor}</span>
                <span className="txt">
                  Address of Licensor: {licensorAddress}
                </span>
                <span className="txt">Licensee: {licensee}</span>
                <span className="txt">
                  Address of Licensee: {licenseeAddress}
                </span>

                <ol
                  style={{
                    color: "#8DD8E8",
                    padding: "0px 70px",
                    textAlign: "justify",
                  }}
                >
                  General Terms -
                  <li>
                    The licensor will transfer the ownership and rights of the
                    patent <b>{patentNumber}</b> to the licensee.
                  </li>
                  <li>
                    The licensor has the authority to transfer the ownership and
                    rights of the patent license to the licensee.
                  </li>
                  <li>
                    The licensee accepts the patent license and has the ability
                    to pay the determined fees.
                  </li>
                  <li>
                    The licensor guarantees that the patent is licensed and
                    valid.
                  </li>
                  <li>
                    This agreement is governed under the jurisdiction of the
                    state of <b>{statee}</b>.
                  </li>
                </ol>
                <ol
                  style={{
                    color: "#8DD8E8",
                    padding: "0px 70px",
                    textAlign: "justify",
                  }}
                >
                  License Grant -
                  <li>
                    The licensor grants the patent license to the licensee
                    subject to the licensee's performance of all payment
                    obligations.
                  </li>
                  <li>
                    The licensee shall be entitled to the whole ownership of the
                    patent and may subcontract manufacturing of licensed
                    products under the patent to third parties.
                  </li>
                </ol>
                <ol
                  style={{
                    color: "#8DD8E8",
                    padding: "0px 70px",
                    textAlign: "justify",
                  }}
                >
                  Payments -
                  <li>
                    The licensee shall purchase the patent from the licensor at
                    a sum of Rs.<b>{amount}</b> in a single installment at the
                    time of signing this agreement.
                  </li>
                  <li>
                    The payment shall be made to the licensor via bank transfer.
                  </li>
                  <li>
                    The amount paid to the licensor shall in no way be refunded
                    or canceled.
                  </li>
                </ol>
                <ol
                  style={{
                    color: "#8DD8E8",
                    padding: "0px 70px",
                    textAlign: "justify",
                  }}
                >
                  Liability -
                  <li>
                    Neither party shall be held liable for any damages, indirect
                    or direct, including loss of profits or any commercial loss.
                  </li>
                </ol>
              </div>
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

export default ViewPatent;
