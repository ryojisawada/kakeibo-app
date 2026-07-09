import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { aggregateByMonth } from '../utils/aggregate.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function formatYen(amount) {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
}

export default function MonthlyBarChart({ items }) {
  const totals = aggregateByMonth(items);

  if (totals.length === 0) {
    return null;
  }

  const data = {
    labels: totals.map((t) => t.month),
    datasets: [
      {
        label: '月別支出合計',
        data: totals.map((t) => t.total),
        // 単一系列の量を表すので、カテゴリカルではなく単色(sequentialのベース色)を使う
        backgroundColor: '#2a78d6',
        borderRadius: 4,
        maxBarThickness: 48,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => formatYen(context.parsed.y),
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        grid: { color: '#e1e0d9' },
        ticks: { callback: (value) => formatYen(value) },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>月別支出</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
