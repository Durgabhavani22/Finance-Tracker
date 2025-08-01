import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import "./Charts.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Charts = () => {
  const { transactions } = useContext(TransactionContext);

  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0) * -1;

  const data = {
    labels: ['Income', 'Expense'],
    datasets: [{
      label: '₹ Amount',
      data: [income, expense],
      backgroundColor: ['#28a745', '#dc3545']
    }]
  };

  return (
    <div className="chart">
      <h3>Spending Overview</h3>
      <Bar data={data} />
    </div>
  );
};

export default Charts;
