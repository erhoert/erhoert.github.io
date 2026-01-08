import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { DayLog, Session, TagType } from '../types';
import { formatDuration, downloadData } from '../utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, X } from 'lucide-react';

interface AnalyticsProps {
  onClose: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ onClose }) => {
  const [days, setDays] = useState<DayLog[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const allDays = await db.days.toArray();
      const allSessions = await db.sessions.toArray();
      setDays(allDays);
      setSessions(allSessions);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading data...</div>;

  // -- Metrics Calculation --
  
  // 1. Distraction Rate
  const totalStops = sessions.length;
  const distractionStops = sessions.filter(s => s.tag === TagType.DISTRACTION || s.tag === TagType.BLOCKED).length;
  const distractionRate = totalStops > 0 ? Math.round((distractionStops / totalStops) * 100) : 0;

  // 2. Efficiency (Net Focus / Gross Time) for the last recorded day
  let efficiency = 0;
  if (days.length > 0) {
    const lastDay = days[days.length - 1];
    if (lastDay.endTime) {
      const grossTime = lastDay.endTime - lastDay.startTime;
      const daySessions = sessions.filter(s => s.dayId === lastDay.id);
      const netFocus = daySessions.reduce((acc, s) => acc + s.duration, 0);
      efficiency = grossTime > 0 ? Math.round((netFocus / grossTime) * 100) : 0;
    }
  }

  // 3. Tag Distribution Data
  const tagData = [
    { name: 'Rest', value: sessions.filter(s => s.tag === TagType.REST).length, color: '#60a5fa' },
    { name: 'Blocked', value: sessions.filter(s => s.tag === TagType.BLOCKED).length, color: '#f97316' },
    { name: 'Distraction', value: sessions.filter(s => s.tag === TagType.DISTRACTION).length, color: '#ef4444' },
    { name: 'Work/Done', value: sessions.filter(s => s.tag === TagType.DONE || s.tag === TagType.WORK).length, color: '#22c55e' },
  ].filter(d => d.value > 0);

  // 4. Session Duration Trend (Last 10 sessions)
  const sessionTrendData = sessions.slice(-10).map((s, i) => ({
    name: `#${i + 1}`,
    minutes: Math.round(s.duration / 1000 / 60)
  }));

  return (
    <div className="bg-white min-h-screen p-4 sm:p-8 relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
            <p className="text-gray-500">Your deep work patterns</p>
          </div>
          <div className="flex gap-4">
             <button onClick={downloadData} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
               <Download size={18} /> Export
             </button>
             <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
               <X size={24} />
             </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="text-gray-500 text-sm mb-1">Total Sessions</div>
            <div className="text-2xl font-bold">{totalStops}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="text-gray-500 text-sm mb-1">Distraction Rate</div>
            <div className={`text-2xl font-bold ${distractionRate > 30 ? 'text-red-500' : 'text-green-600'}`}>
              {distractionRate}%
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="text-gray-500 text-sm mb-1">Latest Efficiency</div>
            <div className="text-2xl font-bold">{efficiency}%</div>
          </div>
           <div className="bg-gray-50 p-4 rounded-xl">
            <div className="text-gray-500 text-sm mb-1">Days Tracked</div>
            <div className="text-2xl font-bold">{days.length}</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Tag Distribution */}
          <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl">
            <h3 className="font-semibold text-gray-700 mb-4">Interruption Reasons</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tagData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tagData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Session Length Trend */}
          <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl">
            <h3 className="font-semibold text-gray-700 mb-4">Recent Session Lengths (mins)</h3>
             <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionTrendData}>
                  <XAxis dataKey="name" tick={false} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#1f2937" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
