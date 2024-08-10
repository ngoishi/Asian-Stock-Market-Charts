import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

const countries = ['JAPAN', 'KOREA', 'TAIWAN', 'HONG KONG', 'SINGAPORE', 'THAILAND'];
const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const StockChart = ({ data, country }) => {
  const chartData = {
    labels: data.map(row => row.Date),
    datasets: [
      {
        label: country,
        data: data.map(row => row[country]),
        borderColor: colors[countries.indexOf(country)],
        backgroundColor: colors[countries.indexOf(country)],
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${country} Stock Market`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

const App = () => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const sheetsId = process.env.REACT_APP_SHEETS_ID;
      const apiKey = process.env.REACT_APP_API_KEY;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/Sheet1?key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const formattedData = data.values.slice(1).map(row => ({
          Date: row[0],
          JAPAN: parseFloat(row[1]) || null,
          KOREA: parseFloat(row[2]) || null,
          TAIWAN: parseFloat(row[3]) || null,
          'HONG KONG': parseFloat(row[4]) || null,
          SINGAPORE: parseFloat(row[5]) || null,
          THAILAND: parseFloat(row[6]) || null,
        }));

        setStockData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app">
      <h1>East Asian Stock Markets</h1>
      <div className="charts-container">
        {countries.map(country => (
          <div key={country} className="chart">
            <StockChart data={stockData} country={country} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;