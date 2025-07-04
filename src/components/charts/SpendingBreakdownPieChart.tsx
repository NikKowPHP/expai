import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { SpendingBreakdownData } from '@/lib/data/getFinancialSummary';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface SpendingBreakdownPieChartProps {
  data: SpendingBreakdownData[];
}

/**
 * A client component that displays spending breakdown by category type
 * (Need/Want/Saving) as a pie chart.
 */
export function SpendingBreakdownPieChart({ data }: SpendingBreakdownPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
