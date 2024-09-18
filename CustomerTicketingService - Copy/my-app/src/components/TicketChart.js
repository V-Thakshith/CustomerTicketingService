import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register necessary components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const TicketChart = ({ ticketCount, ticketResolved, ticketInProgress, ticketOpen }) => {
  // Define the data for the chart
  const data = {
    labels: ['Total Tickets', 'Resolved Tickets', 'In Progress Tickets', 'Open Tickets'],
    datasets: [
      {
        label: 'Ticket Metrics',
        data: [ticketCount, ticketResolved, ticketInProgress, ticketOpen],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Define options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h3>Ticket Metrics</h3>
      <Pie data={data} options={options} />
    </div>
  );
};

export default TicketChart;
