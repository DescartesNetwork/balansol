import React from 'react'

import { Row } from 'antd'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  maintainAspectRatio: false,
  scales: {
    y: {
      stacked: true,
      grid: {
        display: true,
        color: 'rgba(255,99,132,0.2)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      position: 'bottom' as const,
    },
  },
}

const labels = [
  '18/11',
  '19/11',
  '20/11',
  '21/11',
  '22/11',
  '23/11',
  '24/11',
  '25/11',
]

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => Math.random()),
      backgroundColor: '#61DBAF',
    },
  ],
}

const BarChart = () => {
  return (
    <Row justify="center" className="barchart-container">
      <Bar options={options} data={data} />
    </Row>
  )
}

export default BarChart
