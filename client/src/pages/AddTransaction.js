import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";

function AddTransaction() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res =await fetch("http://localhost:5000/add-transaction", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    type,
    title,
    amount,
    date,
    description, // ✅ include this
  }),
});


    const data = await res.json();
    if (res.ok) {
      alert("Transaction added!");
      navigate("/dashboard");
    } else {
      alert(data.msg || "Failed to add");
    }
  };

  if (step === 1) {
    return (<div>
<div className="home-header">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa2-FIWy0H5pbZH-IMbJZuhPK_lWhSXvW6zA&s"
        alt="logo"
        className="home-logo"
      />
      <h1 className="home-title">My Wallet - Finance Tracker</h1>
    </div>
      <div className="form-container">

        <h2>New Transaction</h2>
        <button className="type-selector" onClick={() => { setType("income"); setStep(2); }}>Income</button>
        <button className="type-selector" onClick={() => { setType("expense"); setStep(2); }}>Expense</button>
        <button onClick={() => navigate("/dashboard")} className="back-btn">
  ⬅ Back to Dashboard
</button>

      </div></div>
    );
  }

  return (<div>
    <div className="home-header">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa2-FIWy0H5pbZH-IMbJZuhPK_lWhSXvW6zA&s"
        alt="logo"
        className="home-logo"
      />
      <h1 className="home-title">My Wallet - Finance Tracker</h1>
    </div>
    <div className="form-container">
      <h2>Add {type === "income" ? "Income" : "Expense"}</h2>
<form onSubmit={handleSubmit}>
  <input
    placeholder="Title"
    value={title}
    onChange={e => setTitle(e.target.value)}
    required
  />
  <input
    type="number"
    placeholder="Amount"
    value={amount}
    onChange={e => setAmount(e.target.value)}
    required
  />
  <input
    type="date"
    value={date}
    onChange={e => setDate(e.target.value)}
    required
  />
  <textarea
    placeholder="Description"
    value={description}
    onChange={e => setDescription(e.target.value)}
    rows="3"
  />
  <button className="type-selector" type="submit">Save</button>
</form>
        <button  onClick={() => navigate("/dashboard")} className="back-btn">
  ⬅ Back to Dashboard
</button>
    </div></div>
  );
}

export default AddTransaction;
