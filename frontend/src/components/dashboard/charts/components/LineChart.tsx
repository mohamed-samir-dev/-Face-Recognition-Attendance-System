import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: { day: number; status: number }[];
}

export default function LineChart({ data }: LineChartProps) {
  const chartData = data.length > 0 ? data : Array.from({ length: 30 }, (_, i) => ({ day: i + 1, status: 0 }));
  
  return (
    <div className="h-64 rounded-2xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLine data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280" 
            fontSize={12}
            tickFormatter={(value) => value % 5 === 0 ? value : ''}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
            domain={[0, 100]}
            ticks={[0, 50, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number | undefined) => [(value ?? 0) === 100 ? 'Present' : 'Absent', 'Status']}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="status" 
            stroke="#14b8a6" 
            strokeWidth={2}
            dot={{ fill: '#14b8a6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  );
}