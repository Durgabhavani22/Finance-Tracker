import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

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
    <div className="home-container">
      <h1>Welcome to My Wallet</h1>
      <p>Your personal expense tracker</p>
      <div className="home-buttons">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    </div></div>
  );
}

export default Home;
