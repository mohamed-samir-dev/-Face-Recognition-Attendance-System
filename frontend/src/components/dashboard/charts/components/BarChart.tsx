import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BarChartProps {
  data: { month: string; attendance: number }[];
  onBarClick?: (month: string) => void;
}

export default function BarChart({ data, onBarClick }: BarChartProps) {
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', attendance: 0 },
    { month: 'Feb', attendance: 0 },
    { month: 'Mar', attendance: 0 },
    { month: 'Apr', attendance: 0 },
    { month: 'May', attendance: 0 },
    { month: 'Jun', attendance: 0 },
    { month: 'Jul', attendance: 0 },
    { month: 'Aug', attendance: 0 },
    { month: 'Sep', attendance: 0 },
    { month: 'Oct', attendance: 0 },
    { month: 'Nov', attendance: 0 },
    { month: 'Dec', attendance: 0 }
  ];

  const getBarColor = (value: number) => {
    if (value >= 90) return '#10B981';
    if (value >= 75) return '#3B82F6';
    if (value >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="h-64 rounded-2xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar data={chartData}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#888" 
            fontSize={12}
          />
          <YAxis 
            stroke="#888" 
            fontSize={12}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`${value}%`, 'Attendance']}
          />
          <Bar 
            dataKey="attendance" 
            radius={[8, 8, 0, 0]}
            onClick={(data) => onBarClick && onBarClick(data.month)}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.attendance)}
                cursor="pointer"
              />
            ))}
          </Bar>
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}