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
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // This hides the legend
      },
      title: {
        display: true,
        text: `${country} Stock Market`,
        font: {
          size: 16,
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

  useEffect(() => {
    const fetchData = async () => {
     const API_KEY = 'AIzaSyC9OSYVdlZpA1yqfTvJ30uu_1HtUDBivlg';
      const SPREADSHEET_ID = '1yax38Oae40Udp7x2eEX1vTAT6vVSBaLYaO3G4JnpevY';
      const RANGE = 'Sheet1!A:G'; // Adjust this to match your sheet name and range

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.values && data.values.length > 1) {
          const [headers, ...rows] = data.values;

          const formattedData = rows.map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
              rowData[header] = index === 0 ? row[index] : parseFloat(row[index]) || null;
            });
            return rowData;
          });

          setStockData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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