import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Analytics() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/analytics", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setData(data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const months = data.map((row) => row.month);
  const incomeData = data.map((row) => row.income);
  const expenseData = data.map((row) => row.expense);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
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
    <div style={{ width: "90%", margin: "40px auto", textAlign: "center" }}>
      <h2>Monthly Expense & Income Analysis</h2>
      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <Bar data={chartData} options={chartOptions} />
      )}
      <br />
      <button onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
    </div></div>
  );
}

export default Analytics;
