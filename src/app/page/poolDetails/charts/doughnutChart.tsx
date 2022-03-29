import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import { Doughnut } from 'react-chartjs-2'
import { Row, Space } from 'antd'

ChartJS.register(ArcElement, Tooltip, Legend)

export const data = {
  labels: ['USDC', 'SOL', 'SNTR'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3],
      backgroundColor: [
        'rgba(255, 99, 132)',
        'rgba(54, 162, 235)',
        'rgba(255, 206, 86)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      innerWidth: '10px',
      borderWidth: 0.1,
    },
  ],
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
  },
}

const DoughnutChart = () => {
  return (
    <Row justify="center">
      <Space className="doughnut-container">
        <Doughnut data={data} options={options} />
      </Space>
    </Row>
  )
}

export default DoughnutChart
