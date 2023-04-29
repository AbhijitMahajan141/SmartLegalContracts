import "./ViewShopRental.css";
import React, { useState } from "react";
import { ethers } from "ethers";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const ViewShopRental = ({ state, currentAccount }) => {
  const [contractId, setContractId] = useState();
  const [landlord, setLandlord] = useState("");
  const [lessee, setLessee] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [term, setTerm] = useState();
  const [rent, setRent] = useState();
  const [rentduedate, setRentDueDate] = useState();
  const [timestamp, setTimestamp] = useState();
  const [landlordAadhar, setLandlordAadhar] = useState();
  const [landlordName, setLandlordName] = useState("");
  const [lFathersName, setLFathersName] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [lesseeAadhar, setLesseeAadhar] = useState();
  const [lesseeName, setLesseeName] = useState("");
  const [leFathersName, setLeFathersName] = useState("");
  const [lesseeAddress, setLesseeAddress] = useState("");
  const [rentId, setRentId] = useState();
  const [rentDate, setRentDate] = useState();
  const [rentAmount, setRentAmount] = useState();
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setContractId(null);
    setLandlord(null);
    setLessee(null);
    setShopAddress(null);
    setTerm(null);
    setRent(null);
    setRentDueDate(null);
    setTimestamp(null);
    setLandlordAadhar(null);
    setLandlordName(null);
    setLandlordAddress(null);
    setLesseeAadhar(null);
    setLesseeName(null);
    setLesseeAddress(null);
    setRentId(null);
    setRentDate(null);
    setRentAmount(null);
  };

  let account = currentAccount;

  const getContract = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = document.querySelector("#id").value;
      if (token) {
        const agreement = await state.shopRental_contract.agreement_info(token);
        const landlord = await state.shopRental_contract.landlord_info(token);
        const lessee = await state.shopRental_contract.lessee_info(token);
        const rent = await state.shopRental_contract.paidrents(token);

        // console.log(token, agreement, landlord, lessee);
        if (
          ethers.BigNumber.from(agreement.agreement_id).toNumber() !== 0 &&
          landlord.name !== "" &&
          lessee.name !== ""
        ) {
          if (
            agreement.landlord_address.toLowerCase() === account ||
            agreement.lessee_address.toLowerCase() === account
          ) {
            setContractId(
              ethers.BigNumber.from(agreement.agreement_id).toNumber()
            );
            setLandlord(agreement.landlord_address);
            setLessee(agreement.lessee_address);
            setShopAddress(agreement.shopAddress);
            setTerm(ethers.BigNumber.from(agreement.term).toNumber());
            setRent(ethers.BigNumber.from(agreement.rent).toNumber());
            setRentDueDate(
              ethers.BigNumber.from(agreement.rentduedate).toNumber()
            );
            setTimestamp(ethers.BigNumber.from(agreement.timestamp).toNumber());
            setLandlordAadhar(
              ethers.BigNumber.from(landlord.aadhar).toNumber()
            );
            setLandlordName(landlord.name);
            setLFathersName(landlord.fathers_name);
            setLandlordAddress(landlord.addr);
            setLesseeAadhar(ethers.BigNumber.from(lessee.aadhar).toNumber());
            setLesseeName(lessee.name);
            setLeFathersName(lessee.fathers_name);
            setLesseeAddress(lessee.addr);

            setRentId(ethers.BigNumber.from(rent.id).toNumber());
            setRentDate(ethers.BigNumber.from(rent.time).toNumber());
            setRentAmount(ethers.BigNumber.from(rent.value).toNumber());
            setLoading(false);
            setOpen(true);
            // paidrent();
          } else {
            setLoading(false);
            toast.warning("Please enter your token number!!!", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
        } else {
          setLoading(false);
          toast.warning("The Contract token does not exist!!!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } else {
        setLoading(false);
        toast.warning("Please Enter a token!!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong:" + error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      // alert(error.message);
    }
  };

  const payRent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const value = { value: rent };
      const transact = await state.shopRental_contract.payRent(
        contractId,
        value
      );
      // console.log(value);

      await transact.wait();
      const rentt = await state.shopRental_contract.paidrents(contractId);
      setRentId(ethers.BigNumber.from(rentt.id).toNumber());
      setRentDate(ethers.BigNumber.from(rentt.time).toNumber());
      setRentAmount(ethers.BigNumber.from(rentt.value).toNumber());
      setLoading(false);
      toast.success(" Rent paid successfully!!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } catch (error) {
      setLoading(false);
      toast.error(" Something went wrong:" + error.error.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }

    // paidrent();
  };

  // const paidrent = async (e) => {
  //   e.preventDefault();
  //   const rent = await state.shopRental_contract.paidrents(contractId);
  //   setRentId(ethers.BigNumber.from(rent.id).toNumber());
  //   setRentDate(ethers.BigNumber.from(rent.time).toNumber());
  //   setRentAmount(ethers.BigNumber.from(rent.value).toNumber());
  // };

  const convertPdf = () => {
    // setLoading(true);
    html2canvas(document.querySelector("#viewShoprental")).then((canvas) => {
      let base64image = canvas.toDataURL("image/png");
      // console.log(base64image);
      let pdf = new jsPDF("p", "px", [450, 1050]);
      pdf.addImage(base64image, "PNG", 15, 15);
      pdf.save("ShopRentalContract.pdf");
      // setLoading(false);
    });
  };

  let dateobj = new Date(timestamp * 1000).toLocaleString();

  return (
    <div className="viewShopRental-container">
      <h1 style={{ color: "whitesmoke" }}>Your ShopRental Contract</h1>
      {!contractId && !landlordAadhar && !lesseeAadhar ? (
        <div>
          <form className="form" onSubmit={getContract}>
            <label htmlFor="index" className="label">
              Enter Your Contract Token:
            </label>
            <input type="number" step="any" className="inputz" id="id" />
            <button type="submit" className="btn">
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
              <div className="view-contract" id="viewShoprental">
                <span className="txt">Agreement Id: {contractId}</span>
                <span className="txt">Landlord: {landlord}</span>
                <span className="txt">
                  Landlord Aadhar ID: {landlordAadhar}
                </span>
                <span className="txt">Lessee: {lessee}</span>
                <span className="txt">Lessee Aadhar ID: {lesseeAadhar}</span>
                <p
                  align="justify"
                  style={{ color: "#8DD8E8", margin: "5px 70px" }}
                >
                  This Shop Rental Agreement is made and entered into on{" "}
                  <b>{dateobj}</b> by and between <b>{landlordName}</b>, Son of{" "}
                  <b>{lFathersName}</b>, whose address is{" "}
                  <b>{landlordAddress}</b>, and <b>{lesseeName}</b>, Son of{" "}
                  <b>{leFathersName}</b>, whose address is{" "}
                  <b>{lesseeAddress}</b>.
                  <br />
                  The Lessor and Lessee are each referred to herein as a
                  “Party,” and collectively known as the “Parties.”
                </p>
                <div className="terms" style={{ color: "#8DD8E8" }}>
                  <h4>TERMS AND CONDITIONS</h4>
                  <ol align="justify">
                    <li>
                      LEASE AGREEMENT - The Lessor hereby leases a commercial
                      property hereinafter known as “Premises” to the Lessee,
                      herein described as a Store, located at{" "}
                      <b>{shopAddress}</b>.
                    </li>
                    <li>
                      LEASE TERM - This Agreement will cover a period of{" "}
                      <b>{term}</b> month's which shall start on start until
                      end.
                    </li>
                    <li>
                      RENT - The Lessee shall pay a monthly rent of Rs.{" "}
                      <b>{rent}</b>, with the first month's rent paid in
                      advance. Payment of rent shall be made on or before the{" "}
                      <b>{rentduedate}</b> of every Month.
                    </li>
                    <li>
                      DEPOSIT - The Lessee shall also pay a security deposit of
                      Rs. Deposit amount which shall be refunded upon expiry or
                      termination of this Agreement. An itemized list of
                      deductions will be provided by the Lessor upon refund of
                      the security deposit. The Lessee shall forfeit in claiming
                      the security deposit if the Lessee fails to claim it
                      within <b>{term}</b> month's after the security deposit
                      return period or if the Lessee breaches the terms of the
                      Agreement.
                    </li>
                    <li>
                      PAYMENT OPTION - The Parties agree that payment of rent,
                      deposits, fees, and other charges described herein shall
                      be made in Cash/Online. The Parties agree that the future
                      payment of rent, deposits, fees, and other charges
                      described herein shall be mailed or delivered by hand to
                      the Lessor.
                    </li>
                    <li>
                      RENEWAL OPTION - This Agreement does not automatically
                      renew upon expiration. The Lessee may, however, renew or
                      extend the Lease Term provided that a written notice is
                      sent to the Lessor before the expiration of the Lease
                      Term. The Lessee may also terminate this Agreement before
                      its expiration, provided that a written notice is sent to
                      the Lessor before the intended date of termination.
                    </li>
                    <li>
                      RIGHT TO ACCESS AND ENTRY - The Lessee shall have the
                      right to access and enter the premises upon commencement
                      date. However, Lessee's right to access and enter the
                      premises shall terminate upon eviction or upon the end of
                      the move-out period. The Lessor shall have the right to
                      access and enter the premises upon reasonable notice, for
                      purposes of inspection during the lease term or expiration
                      thereof.
                    </li>
                    <li>
                      USE OF THE PREMISES - The Lessee agrees to use the
                      premises for commercial purposes and is subject to the
                      following conditions of its use, throughout the lease.
                      <ul>
                        <li>
                          The Lessee shall not use the Premises for unlawful and
                          immoral activities, or to store illegal items and
                          substances.
                        </li>
                        <li>
                          The Lessee shall not cause, permit, or maintain waste
                          around and within the Premises.
                        </li>
                        <li>
                          The Lessee shall not cause a nuisance and
                          inconvenience to its neighbors.
                        </li>
                      </ul>
                      Written notice of penalties incurred shall be sent to the
                      Lessee within time after committing any of the prohibited
                      acts mentioned.
                    </li>
                  </ol>
                  <div style={{ margin: ".5rem" }}>
                    {/* <h3>Pay Rent</h3> */}
                    <button className="rent-btn" onClick={payRent}>
                      {loading ? <CircularProgress size={25} /> : "Pay Rent"}
                    </button>
                  </div>
                  {rentId > 0 && (
                    <div style={{ margin: ".5rem" }}>
                      <h3>Total rent's paid {rentId}</h3>
                      Last Paid Rent on Date -{" "}
                      {new Date(rentDate * 1000).toLocaleString()} and Amount -{" "}
                      {rentAmount}.
                    </div>
                  )}
                </div>
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

export default ViewShopRental;
