import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

// Mock data - TODO: replace with real API data
const data = [
  { day: '01', value: 240 },
  { day: '05', value: 139 },
  { day: '10', value: 980 },
  { day: '15', value: 390 },
  { day: '20', value: 480 },
  { day: '25', value: 380 },
  { day: '30', value: 430 },
];

interface ActivitySparklineProps {
  color?: 'indigo' | 'green' | 'amber' | 'cyan';
}

const colors = {
  indigo: { stroke: '#818cf8', fill: '#818cf8' },
  green: { stroke: '#4ade80', fill: '#4ade80' },
  amber: { stroke: '#fbbf24', fill: '#fbbf24' },
  cyan: { stroke: '#22d3ee', fill: '#22d3ee' },
};

export function ActivitySparkline({ color = 'indigo' }: ActivitySparklineProps) {
  const colorSet = colors[color];
  const gradientId = `gradient-${color}`;

  return (
    <div className="h-[80px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorSet.fill} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colorSet.fill} stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <XAxis dataKey="day" hide />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              borderColor: '#334155', 
              borderRadius: '8px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#e2e8f0' }}
            labelStyle={{ display: 'none' }}
            cursor={{ stroke: colorSet.stroke, strokeWidth: 1 }}
            formatter={(value: number) => [`${value} messages`, '']}
          />
          
          <Area 
            type="monotone"
            dataKey="value" 
            stroke={colorSet.stroke}
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#${gradientId})`} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
