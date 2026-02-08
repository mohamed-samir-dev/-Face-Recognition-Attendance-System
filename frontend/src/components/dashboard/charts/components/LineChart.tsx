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
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            stroke="#888" 
            fontSize={12}
            tickFormatter={(value) => value % 5 === 0 ? value : ''}
          />
          <YAxis 
            stroke="#888" 
            fontSize={12}
            domain={[0, 100]}
            ticks={[0, 50, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#000'
            }}
            labelStyle={{ color: '#000', fontWeight: 'bold' }}
            formatter={(value: number) => [value === 100 ? 'Present' : 'Absent', 'Status']}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="status" 
            stroke="url(#lineGradient)" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  );
}