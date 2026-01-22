import React from 'react';
import { TimelineEvent } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

interface SentimentChartProps {
  events: TimelineEvent[];
}

export const SentimentChart: React.FC<SentimentChartProps> = ({ events }) => {
  // Normalize data for chart
  const data = events.map((e, idx) => ({
    name: e.date,
    shortDate: e.date.slice(5), // MM-DD
    sentiment: e.sentimentScore,
    title: e.title,
  }));

  return (
    <div className="w-full h-[300px] bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-12">
      <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">分析：情感波动曲线</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="shortDate" 
            tick={{fontSize: 12, fill: '#9ca3af'}} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[-10, 10]} 
            hide={true} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
          />
          <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
          <Area 
            type="monotone" 
            dataKey="sentiment" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSentiment)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};