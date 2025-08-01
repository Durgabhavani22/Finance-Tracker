import React, { useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import "./AddTransaction.css";

const AddTransaction = () => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const { addTransaction } = useContext(TransactionContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Date.now(),
      text,
      amount: parseFloat(amount),
    };
    addTransaction(newTransaction);
    setText("");
    setAmount("");
  };

  return (
    <form className="add-transaction" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Transaction title"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount (positive or negative)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddTransaction;
