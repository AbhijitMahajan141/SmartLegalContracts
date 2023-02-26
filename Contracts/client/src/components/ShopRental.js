import "./ShopRental.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export const ShopRental = ({ state, id }) => {
  const [landlord, setLandlord] = useState();
  const [lessee, setLessee] = useState();
  const [signed, setSigned] = useState(false);

  const setAgreement = async (e) => {
    e.preventDefault();
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
  };

  const signLandlord = async (e) => {
    e.preventDefault();
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
    isSigned();
  };

  const signLessee = async (e) => {
    e.preventDefault();
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
    isSigned();
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
      <h2 style={{ color: "whitesmoke" }}>ShopRental Contract</h2>
      {!landlord && !lessee ? (
        <form onSubmit={setAgreement} className="form">
          <label htmlFor="landlord" className="label">
            Enter Landlord Address:
          </label>
          <input type="text" className="inputs" id="landlord" />
          <label htmlFor="lessee" className="label">
            Enter Lessee Address:
          </label>
          <input type="text" className="inputs" id="lessee" />
          <label htmlFor="rent" className="label">
            Enter Rent:
          </label>
          <input type="number" step="any" className="inputs" id="rent" />
          <label htmlFor="shopAddress" className="label">
            Enter Shop Address:
          </label>
          <input type="text" className="inputs" id="shopAddress" />
          <label htmlFor="term" className="label">
            Enter Term:
          </label>
          <input type="number" className="inputs" id="term" />
          <label htmlFor="rentduedate" className="label">
            Enter Rent Due Date:
          </label>
          <input type="number" className="inputs" id="rentduedate" />
          <button type="submit" className="btn">
            Submit
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
                  Landlord Information
                  <form onSubmit={signLandlord} className="form">
                    <label htmlFor="aadhar" className="label">
                      Enter Landlord Aadhar_No:
                    </label>
                    <input type="number" className="inputs" id="ld_aadhar" />
                    <label htmlFor="name" className="label">
                      Enter Landlord Name:
                    </label>
                    <input type="text" className="inputs" id="ld_name" />
                    <label htmlFor="fathers_name" className="label">
                      Enter Landlord father's Name:
                    </label>
                    <input type="text" className="inputs" id="ld_father" />
                    <label htmlFor="address" className="label">
                      Enter Landlord Address:
                    </label>
                    <input type="text" className="inputs" id="ld_addr" />
                    <button type="submit" className="btn">
                      Submit
                    </button>
                  </form>
                </div>
                <div className="sps">
                  Lessee Information
                  <form onSubmit={signLessee} className="form">
                    <label htmlFor="aadhar" className="label">
                      Enter Lessee Aadhar_No:
                    </label>
                    <input type="number" className="inputs" id="le_aadhar" />
                    <label htmlFor="name" className="label">
                      Enter Lessee Name:
                    </label>
                    <input type="text" className="inputs" id="le_name" />
                    <label htmlFor="fathers_name" className="label">
                      Enter Lessee father's Name:
                    </label>
                    <input type="text" className="inputs" id="le_father" />
                    <label htmlFor="address" className="label">
                      Enter Lessee Address:
                    </label>
                    <input type="text" className="inputs" id="le_address" />
                    <button type="submit" className="btn">
                      Submit
                    </button>
                  </form>
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
