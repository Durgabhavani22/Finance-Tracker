import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
  const [data, setData] = useState({ income: 0, expense: 0, balance: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/dashboard", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setData(data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = () => {
    fetch("http://localhost:5000/logout", {
      credentials: "include",
    })
      .then(() => {
        alert("Logged out");
        navigate("/login");
      })
      .catch(() => alert("Error logging out"));
  };

  return (
    <div className="dashboard">
        <center> <div className="home-header">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa2-FIWy0H5pbZH-IMbJZuhPK_lWhSXvW6zA&s"
        alt="logo"
        className="home-logo"
      />
      <h1 className="home-title">My Wallet - Finance Tracker</h1>
    </div>
    </center> 
      <div className="summary">
        <div className="card income">Income: ₹{data.income}</div>
        <div className="card expense">Expense: ₹{data.expense}</div>
        <div className="card balance">Balance: ₹{data.balance}</div>
      </div>

      <div className="nav-links">
        <button onClick={() => navigate("/add")}>+ Add Transaction</button>
        <button onClick={() => navigate("/history")}>📜 History</button>
        <button onClick={() => navigate("/analytics")}>📈 Analytics</button>
        <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
