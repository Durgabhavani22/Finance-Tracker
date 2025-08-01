import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>My Wallet</h2>
      <ul>
        <li>Dashboard</li>
        <li>Transactions</li>
        <li>Analytics</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
