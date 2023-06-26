import "./Admin.css";
import React, { useState } from "react";
import AdminHome from "./AdminHome";
import AdminPatent from "./AdminPatent";
// import AdminShoprental from "./AdminShoprental";
import AdminTrademark from "./AdminTrademark";
import Tenders from "./Tenders";

const Admin = ({ state, currentAccount }) => {
  const [menuItem, setMenuItem] = useState("Home");

  return (
    <div className="main-container">
      <div className="admin-menu">
        <span>
          <b className="logo">SML</b>
          <br />
          SmartLegalContracts
        </span>
        <div className="menu-btns">
          <button
            onClick={() => {
              setMenuItem("Home");
            }}
          >
            Home
          </button>
          <button
            onClick={() => {
              setMenuItem("Tenders");
            }}
          >
            Tender Creation
          </button>
          <button
            onClick={() => {
              setMenuItem("Patent");
            }}
          >
            Patent Application
          </button>

          <button
            onClick={() => {
              setMenuItem("Trademark");
            }}
          >
            Trademark Application
          </button>
        </div>
      </div>
      <div className="main-section">
        <div className="top-bar">
          <span>Hello Admin : 0x06c57cbaa47a9bc856a061322eea9109b441c7d6</span>
        </div>
        <div className="data-container">
          {menuItem === "Home" && (
            <div>
              <AdminHome state={state} />
            </div>
          )}
          {menuItem === "Tenders" && (
            <div>
              <Tenders state={state} currentAccount={currentAccount} />
            </div>
          )}
          {menuItem === "Patent" && (
            <div>
              <AdminPatent state={state} />
            </div>
          )}

          {menuItem === "Trademark" && (
            <div>
              <AdminTrademark state={state} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
