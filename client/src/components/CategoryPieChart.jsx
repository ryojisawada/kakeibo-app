import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { aggregateByCategory } from '../utils/aggregate.js';
import { getCategoryColor } from '../utils/categories.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function formatYen(amount) {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
}

export default function CategoryPieChart({ items }) {
  const totals = aggregateByCategory(items);

  if (totals.length === 0) {
    return null;
  }

  const data = {
    labels: totals.map((t) => t.category),
    datasets: [
      {
        data: totals.map((t) => t.total),
        // カテゴリと色の対応を固定順で維持し、識別を色だけに頼らないよう凡例も併用する
        backgroundColor: totals.map((t) => getCategoryColor(t.category)),
        borderColor: '#fcfcfb',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#0b0b0b' },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${formatYen(context.parsed)}`,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>カテゴリ別支出</h3>
      <Pie data={data} options={options} />
    </div>
  );
}
