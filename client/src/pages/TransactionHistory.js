import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/transactions", { credentials: "include" })
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  return (
    <div>
    <div className="home-header">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa2-FIWy0H5pbZH-IMbJZuhPK_lWhSXvW6zA&s"
        alt="logo"
        className="home-logo"
      />
      <h1 className="home-title">My Wallet - Finance Tracker</h1>
    </div>
    <div className="dashboard">
      <h2>Your Transaction History</h2>
      <table className="history-table">
  <thead>
    <tr>
      <th>Date</th>
      <th>Type</th>
      <th>Description</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
    {transactions.map((tx) => (
      <tr key={tx.id}>
        <td>{new Date(tx.date).toLocaleDateString()}</td>
        <td>{tx.type}</td>
        <td>{tx.description}</td>
        <td>₹{tx.amount}</td>
      </tr>
    ))}
  </tbody>
</table>

              <button onClick={() => navigate("/dashboard")} className="back-btn">
  ⬅ Back to Dashboard
</button>
    </div></div>

  );
}

export default TransactionHistory;
