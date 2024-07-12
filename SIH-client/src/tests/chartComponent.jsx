import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const ChartComponent = ({ userId }) => {
  const [chartData, setChartData] = useState({
    series: [{ name: 'Total Scores', data: [] }],
    options: {
      chart: { id: 'total-scores-chart' },
      xaxis: { categories: [] }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/all-results?user_id=${encodeURIComponent(userId)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
    
        console.log('Fetched data:', data); // Log fetched data for debugging
        console.log('Total Scores:', data[0].totalScores); // Log totalScores for debugging
    
        // Ensure totalScores is an array
        if (!Array.isArray(data[0].totalScores)) {
          throw new Error('totalScores is not a valid array');
        }
    
        // Update state with new data
        setChartData({
          series: [{ name: 'Total Scores', data: data[0].totalScores }],
          options: {
            ...chartData.options,
            xaxis: { categories: Array.from({ length: data[0].noOfTests }, (_, i) => i + 1) }
          }
        });
      } catch (error) {
        console.error('Error fetching result:', error);
      }
    };
    
    
    

    fetchData();
  }, [userId]);

  return (
    <div className="chart">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        width="500"
      />
    </div>
  );
};

export default ChartComponent;
