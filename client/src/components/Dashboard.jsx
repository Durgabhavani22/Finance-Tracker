import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { transactions } = useContext(TransactionContext);

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income + expense;

  return (
    <div className="dashboard">
      <div className="card income">Income: ₹{income}</div>
      <div className="card expense">Expense: ₹{Math.abs(expense)}</div>
      <div className="card balance">Balance: ₹{balance}</div>
    </div>
  );
};

export default Dashboard;
