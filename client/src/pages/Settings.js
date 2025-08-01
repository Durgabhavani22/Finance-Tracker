import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";

function Settings() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const updateSettings = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/update-settings", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Settings updated");
      navigate("/dashboard");
    } else {
      alert(data.msg || "Failed to update");
    }
  };

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
    <div className="form-container">
      <h2>Update Settings</h2>
      <form onSubmit={updateSettings}>
        <input
          type="text"
          placeholder="New Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button className="type-selector" type="submit">Update</button>
      </form>
              <button onClick={() => navigate("/dashboard")} className="back-btn">
  ⬅ Back to Dashboard
</button>
    </div></div>
  );
}

export default Settings;
