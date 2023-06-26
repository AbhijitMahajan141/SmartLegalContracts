import "./Admin.css";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import CircularProgress from "@mui/material/CircularProgress";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";

const AdminHome = ({ state }) => {
  //   console.log(state.new_patent_contract);

  const [totalPatent, setTotalPatent] = useState(0);
  const [totalShoprental, setShoprental] = useState(0);
  const [totalTrademark, setTrademark] = useState(0);

  const getTotal = async (e) => {
    // e.preventDefault();
    try {
      const totalPatent = await state.new_patent_contract.total_patent();
      const totalRental = await state.shopRental_contract.total_rental();
      const totalTrade = await state.trademark_contract.total_trademark();

      setTotalPatent(ethers.BigNumber.from(totalPatent).toNumber());
      setShoprental(ethers.BigNumber.from(totalRental).toNumber());
      setTrademark(ethers.BigNumber.from(totalTrade).toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTotal();
  }, []);

  return (
    <div className="home-container">
      <span style={{ color: "#8DD8E8", fontSize: "2em" }}>Welcome Home</span>
      <div className="home-section">
        <div className="home-contract-info-card">
          <span>Total Patent Application's</span>
          <span>{totalPatent}</span>
        </div>
        <div className="home-contract-info-card">
          <span>Total Shoprental Contract's</span>
          <span>{totalShoprental}</span>
        </div>
        <div className="home-contract-info-card">
          <span>Total Trademark Application's</span>
          <span>{totalTrademark}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
