import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import "./TransactionList.css";

const TransactionList = () => {
  const { transactions } = useContext(TransactionContext);

  return (
    <div className="transaction-list">
      <h3>Transaction History</h3>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            {tx.text}: ₹{tx.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
