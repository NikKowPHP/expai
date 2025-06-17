// src/components/charts/SpendingDonutChart.tsx
"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { SpendingByCategoryData } from "@/lib/data/getFinancialSummary";

// A pre-defined array of colors for the chart segments
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF4560"];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

export const SpendingDonutChart = ({
  data,
}: {
  data: SpendingByCategoryData[];
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No spending data to display.</p>
      </div>
    );
  }

  return (
    // ResponsiveContainer makes the chart adapt to its parent's size
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60} // This makes it a donut chart
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value" // The key in our data object that holds the value
          nameKey="name" // The key for the label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
