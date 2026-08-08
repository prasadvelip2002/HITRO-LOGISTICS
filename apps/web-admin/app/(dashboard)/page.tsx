"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Package, Clock, IndianRupee, ArrowUpRight, Activity } from 'lucide-react';

const chartData = [
  { name: 'M', volume: 42 },
  { name: 'T', volume: 55 },
  { name: 'W', volume: 30 },
  { name: 'T', volume: 65 },
  { name: 'F', volume: 50 },
  { name: 'S', volume: 85 },
  { name: 'S', volume: 60 },
];

const StunningKpi = ({ title, value, subValue, icon: Icon, color, isUrgent = false }: any) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 group">
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${color.bg}`} />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h3>
        <div className={`p-2.5 rounded-xl ${color.bgLight}`}>
          <Icon className={`w-5 h-5 ${color.text}`} />
        </div>
      </div>
      
      <div className="flex items-baseline gap-3 relative z-10">
        <h2 className="text-4xl font-black text-gray-800 tracking-tight">{value}</h2>
        {subValue && (
          <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${isUrgent ? 'text-orange-700 bg-orange-100' : 'text-emerald-700 bg-emerald-100'}`}>
            {!isUrgent && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    activeTrips: 184,
    pendingPod: 37,
    awaitingApproval: 14,
    pendingSettlements: 420000
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const tripsData = await fetchApi("/Trips");
        
        if (tripsData && tripsData.length > 0) {
          const active = tripsData.filter((t: any) => !['Paid', 'Cancelled'].includes(t.status)).length;
          const pendingPod = tripsData.filter((t: any) => t.status === 'Delivered').length;
          const awaitingApproval = tripsData.filter((t: any) => t.status === 'POD_Uploaded').length;
          const settlements = tripsData.filter((t: any) => t.status === 'Approved').reduce((acc: number, t: any) => {
             const finalAmt = t.fixedRate > 0 ? t.fixedRate : (t.ratePerTon * (t.indent?.weight || 0));
             return acc + (finalAmt - t.advanceAmount);
          }, 0);

          setMetrics({
            activeTrips: active,
            pendingPod,
            awaitingApproval,
            pendingSettlements: settlements
          });
          setTrips(tripsData.slice(0, 10));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StunningKpi 
          title="Active Trips" 
          value={metrics.activeTrips} 
          subValue="12% wk"
          icon={TrendingUp}
          color={{ bg: 'bg-yellow-500', bgLight: 'bg-yellow-100', text: 'text-yellow-600' }}
        />
        <StunningKpi 
          title="Open Indents" 
          value={metrics.pendingPod} 
          subValue="5 today"
          icon={Package}
          color={{ bg: 'bg-blue-500', bgLight: 'bg-blue-100', text: 'text-blue-600' }}
        />
        <StunningKpi 
          title="Pending Approvals" 
          value={metrics.awaitingApproval} 
          subValue="4 urgent"
          isUrgent={true}
          icon={Clock}
          color={{ bg: 'bg-orange-500', bgLight: 'bg-orange-100', text: 'text-orange-600' }}
        />
        <StunningKpi 
          title="Advances Today" 
          value={`₹${(metrics.pendingSettlements / 100000).toFixed(1)}L`} 
          subValue="8%"
          icon={IndianRupee}
          color={{ bg: 'bg-emerald-500', bgLight: 'bg-emerald-100', text: 'text-emerald-600' }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black text-gray-900">Trip Volume</h3>
              <p className="text-xs text-gray-500 font-medium">Last 7 days of dispatched trips</p>
            </div>
            <select className="bg-gray-50 border-none text-sm font-bold text-gray-600 py-2 px-4 rounded-xl outline-none cursor-pointer hover:bg-gray-100 transition-colors">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                />
                <Bar dataKey="volume" radius={[6, 6, 6, 6]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#eab308' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-900">Recent Activity</h3>
            <button className="text-xs font-bold text-yellow-600 hover:text-yellow-700 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
              View All
            </button>
          </div>
          
          <div className="space-y-6">
            {loading ? (
              <div className="text-center text-sm text-gray-400 py-4 font-medium">Loading activity...</div>
            ) : trips.length === 0 ? (
              <>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <IndianRupee className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Advance approved</p>
                    <p className="text-xs text-gray-500 font-medium">TRIP-2291 • ₹15,000 to FastFleet</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1 uppercase tracking-wider">10 mins ago</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">POD verified</p>
                    <p className="text-xs text-gray-500 font-medium">TRIP-2287 • Delhi Hub</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1 uppercase tracking-wider">45 mins ago</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Indent created</p>
                    <p className="text-xs text-gray-500 font-medium">IND-5521 • ACME Corp</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1 uppercase tracking-wider">2 hours ago</p>
                  </div>
                </div>
              </>
            ) : (
              trips.slice(0, 4).map(trip => (
                <div key={trip.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{trip.status}</p>
                    <p className="text-xs text-gray-500 font-medium">TRP-{1000 + trip.id} • {trip.indent?.customer?.name || "Unknown"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
