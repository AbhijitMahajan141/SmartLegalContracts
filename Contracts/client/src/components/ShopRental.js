import "./ShopRental.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import { ShopRentalGuidelines } from "./Guidelines";

export const ShopRental = ({ state, id }) => {
  const [landlord, setLandlord] = useState();
  const [lessee, setLessee] = useState();
  const [signed, setSigned] = useState(false);
  const [landlordSign, setLandlordSign] = useState(false);
  const [lesseeSign, setLesseeSign] = useState(false);
  const [loading, setLoading] = useState(false);

  const setAgreement = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const _landlord = document.querySelector("#landlord").value;
      const _lessee = document.querySelector("#lessee").value;
      const _rent = document.querySelector("#rent").value;
      const _shopAddress = document.querySelector("#shopAddress").value;
      const _term = document.querySelector("#term").value;
      const _rentduedate = document.querySelector("#rentduedate").value;

      const transaction = await state.shopRental_contract.setAgreement(
        _landlord,
        _lessee,
        ethers.utils.parseUnits(_rent, 18),
        _shopAddress,
        _term,
        _rentduedate
      );
      await transaction.wait();
      setLandlord(_landlord);
      setLessee(_lessee);
      setLoading(false);
      toast.success(" Shoprental Contract Initiated!!!", {
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

  const signLandlord = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const ld_aadr = document.querySelector("#ld_aadhar").value;
      const ld_name = document.querySelector("#ld_name").value;
      const ld_fname = document.querySelector("#ld_father").value;
      const ld_addr = document.querySelector("#ld_addr").value;
      const transact = await state.shopRental_contract.signLandlord(
        id,
        ld_aadr,
        ld_name,
        ld_fname,
        ld_addr
      );
      await transact.wait();

      const landlord = await state.shopRental_contract.landlord_info(id);
      if (landlord.signed === true) {
        setLandlordSign(landlord.signed);
      }

      isSigned();

      setLoading(false);
      toast.success("Landlord data saved!!!", {
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

  const signLessee = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const le_aadr = document.querySelector("#le_aadhar").value;
      const le_name = document.querySelector("#le_name").value;
      const le_fname = document.querySelector("#le_father").value;
      const le_addr = document.querySelector("#le_address").value;
      const transact = await state.shopRental_contract.signLessee(
        id,
        le_aadr,
        le_name,
        le_fname,
        le_addr
      );
      await transact.wait();

      const lessee = await state.shopRental_contract.lessee_info(id);
      if (lessee.signed === true) {
        setLesseeSign(lessee.signed);
      }

      isSigned();

      setLoading(false);
      toast.success("Lessee data Saved!!!", {
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

  const isSigned = async () => {
    const sign = await state.shopRental_contract.getSigned(id);
    // console.log(sign);
    setSigned(sign);
  };

  useEffect(() => {
    //uncaught error due to this...........
    isSigned();

    // console.log(signed, divorced);
  });

  return (
    <div className="ShopRental-container">
      <h2 style={{ color: "#8DD8E8" }}>ShopRental Contract</h2>
      <ShopRentalGuidelines />

      {!landlord && !lessee ? (
        <form onSubmit={setAgreement} className="form">
          <label htmlFor="landlord" className="label">
            Enter Landlord metamask Address:
          </label>
          <input
            type="text"
            className="inputs"
            id="landlord"
            placeholder="Eg.0x1562990CF848Eb5809D3D7026Ac6430c24f3bb87"
            required
          />
          <label htmlFor="lessee" className="label">
            Enter Lessee metamask Address:
          </label>
          <input
            type="text"
            className="inputs"
            id="lessee"
            placeholder="Eg.0x1562990CF848Eb5809D3D7026Ac6430c24f3bb87"
            required
          />
          <label htmlFor="rent" className="label">
            Enter Rent:
          </label>
          <input
            type="number"
            step="any"
            className="inputs"
            id="rent"
            placeholder="Eg.0.000000000000030000"
            required
          />
          <label htmlFor="shopAddress" className="label">
            Enter Shop Address:
          </label>
          <textarea
            type="text"
            className="inputs"
            id="shopAddress"
            placeholder="Eg.shop no.d1,some colony, some nagar,some road,city,123456"
            rows={4}
            cols={20}
            required
          />
          <label htmlFor="term" className="label">
            Enter Term:
          </label>
          <input
            type="number"
            className="inputs"
            id="term"
            placeholder="Eg.11 (months)"
            required
          />
          <label htmlFor="rentduedate" className="label">
            Enter Rent Due Date:
          </label>
          <input
            type="number"
            className="inputs"
            id="rentduedate"
            placeholder="Eg.10 (of every month)"
            required
          />
          <button type="submit" className="btn">
            {loading ? <CircularProgress size={25} /> : "Submit"}
          </button>
        </form>
      ) : (
        <>
          {!signed ? (
            <>
              <span className="txt">Landlord: {landlord}</span>
              <span className="txt">Lessee: {lessee}</span>
              <span className="txt">Please Remember your Token: {id}</span>
              <span className="txt">
                NOTE: Submit the Landlord data with Landlord's metamask and
                Lessee's data with Lessee metamask!
              </span>

              <div className="shop-data">
                <div className="sps">
                  <span style={{ color: "#8DD8E8" }}>Landlord Information</span>
                  {!landlordSign === true ? (
                    <form onSubmit={signLandlord} className="form">
                      <label htmlFor="aadhar" className="label">
                        Enter Landlord Aadhar_No:
                      </label>
                      <input
                        type="number"
                        className="inputs"
                        id="ld_aadhar"
                        placeholder="Eg.123456789098"
                        required
                        minLength={12}
                        maxLength={12}
                      />
                      <label htmlFor="name" className="label">
                        Enter Landlord Name:
                      </label>
                      <input
                        type="text"
                        className="inputs"
                        id="ld_name"
                        placeholder="Eg.Vijay Dinanath Chauhan"
                        required
                      />
                      <label htmlFor="fathers_name" className="label">
                        Enter Landlord father's Name:
                      </label>
                      <input
                        type="text"
                        className="inputs"
                        id="ld_father"
                        placeholder="Eg.Dinanath Chauhan"
                        required
                      />
                      <label htmlFor="address" className="label">
                        Enter Landlord Address:
                      </label>
                      <textarea
                        type="text"
                        className="inputs"
                        id="ld_addr"
                        placeholder="Eg.flat no.d1,some colony, some nagar,some road,city,123456"
                        rows={4}
                        cols={20}
                        required
                      />
                      <button type="submit" className="btn">
                        {loading ? <CircularProgress size={25} /> : "Submit"}
                      </button>
                    </form>
                  ) : (
                    <div>
                      <span className="txt">
                        Landlord has signed the contract!
                      </span>
                    </div>
                  )}
                </div>
                <div className="sps">
                  <span style={{ color: "#8DD8E8" }}>Lessee Information</span>
                  {!lesseeSign === true ? (
                    <form onSubmit={signLessee} className="form">
                      <label htmlFor="aadhar" className="label">
                        Enter Lessee Aadhar_No:
                      </label>
                      <input
                        type="number"
                        className="inputs"
                        id="le_aadhar"
                        placeholder="Eg.123456789098"
                        required
                        minLength={12}
                        maxLength={12}
                      />
                      <label htmlFor="name" className="label">
                        Enter Lessee Name:
                      </label>
                      <input
                        type="text"
                        className="inputs"
                        id="le_name"
                        placeholder="Eg.Vijay Dinanath Chauhan"
                        required
                      />
                      <label htmlFor="fathers_name" className="label">
                        Enter Lessee father's Name:
                      </label>
                      <input
                        type="text"
                        className="inputs"
                        id="le_father"
                        placeholder="Eg.Dinanath Chauhan"
                        required
                      />
                      <label htmlFor="address" className="label">
                        Enter Lessee Address:
                      </label>
                      <textarea
                        type="text"
                        className="inputs"
                        id="le_address"
                        placeholder="Eg.flat no.d1,some colony, some nagar,some road,city,123456"
                        rows={4}
                        cols={20}
                        required
                      />
                      <button type="submit" className="btn">
                        {loading ? <CircularProgress size={25} /> : "Submit"}
                      </button>
                    </form>
                  ) : (
                    <div>
                      <span className="txt">
                        Lessee has signed the contract!
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
                The Shop Rental Contract has been formed between{" "}
                <b>{landlord}</b> and <b>{lessee}</b> and the information is
                successfully stored on Bockchain.
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
