"use client";

import React, { useState, useEffect } from "react";
import {
  Slider,
  Label,
  Text,
  Card,
  CardHeader,
} from "@fluentui/react-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface InvestmentData {
  year: number;
  value: number;
}

export default function CompoundInterestSimulator() {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [interestRate, setInterestRate] = useState(7);
  const [years, setYears] = useState(20);
  const [data, setData] = useState<InvestmentData[]>([]);

  useEffect(() => {
    const calculateGrowth = () => {
      const annualContribution = monthlyContribution * 12;
      const rate = interestRate / 100;
      const monthlyRate = rate / 12;
      const newData: InvestmentData[] = [];

      let currentValue = initialAmount;
      newData.push({ year: 0, value: initialAmount });

      for (let i = 1; i <= years; i++) {
        // Compound interest on initial amount
        currentValue = currentValue * Math.pow(1 + rate, 1);
        // Add annual contributions and compound them
        for (let j = 0; j < 12; j++) {
          currentValue += monthlyContribution;
          currentValue *= (1 + monthlyRate);
        }
        newData.push({ year: i, value: Math.round(currentValue) });
      }
      setData(newData);
    };

    calculateGrowth();
  }, [initialAmount, monthlyContribution, interestRate, years]);

  return (
    <Card className="p-4 max-w-4xl mx-auto">
      <CardHeader
        header={<Text className="text-xl font-bold">Compound Interest Simulator</Text>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="initialAmount">Initial Investment: ${initialAmount}</Label>
          <Slider
            id="initialAmount"
            min={0}
            max={100000}
            step={1000}
            value={initialAmount}
            onChange={(_, data) => setInitialAmount(data.value)}
          />
        </div>
        <div>
          <Label htmlFor="monthlyContribution">Monthly Contribution: ${monthlyContribution}</Label>
          <Slider
            id="monthlyContribution"
            min={0}
            max={1000}
            step={50}
            value={monthlyContribution}
            onChange={(_, data) => setMonthlyContribution(data.value)}
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Annual Interest Rate: {interestRate}%</Label>
          <Slider
            id="interestRate"
            min={0}
            max={15}
            step={0.5}
            value={interestRate}
            onChange={(_, data) => setInterestRate(data.value)}
          />
        </div>
        <div>
          <Label htmlFor="years">Years: {years}</Label>
          <Slider
            id="years"
            min={1}
            max={50}
            step={1}
            value={years}
            onChange={(_, data) => setYears(data.value)}
          />
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Investment Value"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
