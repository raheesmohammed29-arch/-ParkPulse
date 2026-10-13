import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Car, 
  Layers, 
  CreditCard, 
  ArrowUpRight, 
  Clock, 
  Calendar, 
  PieChart,
  Download,
  ShieldCheck,
  Zap,
  MapPin
} from 'lucide-react';
import { PaymentTransaction, VehicleEntryRecord, ParkingSlot, FacilityConfig } from '../types';
import { formatLKR } from '../utils/formatters';

interface AnalyticsViewProps {
  transactions: PaymentTransaction[];
  entries: VehicleEntryRecord[];
  slots: ParkingSlot[];
  config: FacilityConfig;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions,
  entries,
  slots,
  config,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Revenue Totals in LKR
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amountLKR, 0);
  const avgTicketValue = transactions.length > 0 ? Math.round(totalRevenue / transactions.length) : 0;
  
  // Payment methods in LKR
  const cashAmount = transactions
    .filter((t) => t.paymentMethod === 'Cash')
    .reduce((sum, t) => sum + t.amountLKR, 0);
  const cardAmount = transactions
    .filter((t) => t.paymentMethod === 'Card')
    .reduce((sum, t) => sum + t.amountLKR, 0);
  const lankaPayAmount = transactions
    .filter((t) => t.paymentMethod === 'LankaPay Online')
    .reduce((sum, t) => sum + t.amountLKR, 0);

  const cashPct = totalRevenue > 0 ? Math.round((cashAmount / totalRevenue) * 100) : 0;
  const cardPct = totalRevenue > 0 ? Math.round((cardAmount / totalRevenue) * 100) : 0;
  const lankaPayPct = totalRevenue > 0 ? Math.max(0, 100 - cashPct - cardPct) : 0;

  // Hourly Revenue Dataset (Colombo operating hours)
  const hourlyData = [
    { hour: '06:00', amount: 2400, count: 6 },
    { hour: '08:00', amount: 5200, count: 14 },
    { hour: '10:00', amount: 8900, count: 22 },
    { hour: '12:00', amount: 13400, count: 31 },
    { hour: '14:00', amount: 17800, count: 39 },
    { hour: '16:00', amount: 21500, count: 48 },
    { hour: '18:00', amount: 24500, count: 54 },
    { hour: '20:00', amount: 27200, count: 60 },
  ];

  const weeklyData = [
    { day: 'Mon', amount: 21500, occupancy: '68%' },
    { day: 'Tue', amount: 23200, occupancy: '72%' },
    { day: 'Wed', amount: 24100, occupancy: '75%' },
    { day: 'Thu', amount: 24500, occupancy: '76%' },
    { day: 'Fri', amount: 28900, occupancy: '89%' },
    { day: 'Sat', amount: 33400, occupancy: '94%' },
    { day: 'Sun', amount: 26800, occupancy: '78%' },
  ];

  const monthlyData = [
    { month: 'May', amount: 640000 },
    { month: 'Jun', amount: 695000 },
    { month: 'Jul', amount: 720000 },
    { month: 'Aug', amount: 745000 },
    { month: 'Sep', amount: 780000 },
    { month: 'Oct (Proj)', amount: 835000 },
  ];

  const currentChartData =
    timeRange === 'today'
      ? hourlyData.map((d) => ({ label: d.hour, val: d.amount }))
      : timeRange === 'week'
      ? weeklyData.map((d) => ({ label: d.day, val: d.amount }))
      : monthlyData.map((d) => ({ label: d.month, val: d.amount }));

  const maxVal = Math.max(...currentChartData.map((d) => d.val));

  // Vehicle category breakdown
  const vehicleStats = [
    { type: 'Passenger Cars', share: 55, amount: Math.round(totalRevenue * 0.55), count: 66, color: 'bg-blue-600' },
    { type: 'SUVs & Jeeps', share: 22, amount: Math.round(totalRevenue * 0.22), count: 26, color: 'bg-indigo-600' },
    { type: 'Commercial Vans', share: 11, amount: Math.round(totalRevenue * 0.11), count: 13, color: 'bg-cyan-500' },
    { type: 'Three Wheelers (Tuk-Tuk)', share: 7, amount: Math.round(totalRevenue * 0.07), count: 9, color: 'bg-amber-500' },
    { type: 'Motorcycles & Scooters', share: 4, amount: Math.round(totalRevenue * 0.04), count: 5, color: 'bg-emerald-500' },
    { type: 'Tourist / Mini Buses', share: 1, amount: Math.round(totalRevenue * 0.01), count: 1, color: 'bg-purple-600' },
  ];

  // Floor occupancy
  const zoneAOccupied = slots.filter((s) => s.zone.includes('Zone A') && s.status !== 'available').length;
  const zoneBOccupied = slots.filter((s) => s.zone.includes('Zone B') && s.status !== 'available').length;
  const zoneCOccupied = slots.filter((s) => s.zone.includes('Zone C') && s.status !== 'available').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1220] tracking-tight">
              Revenue & Occupancy Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              LKR Reports
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Financial ledger analytics, peak hours traffic flow, and vehicle distribution for {config.facilityName}.
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeRange === 'today' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Today (Hourly)
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeRange === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeRange === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            6-Month Trend
          </button>
        </div>
      </div>

      {/* 2. TOP KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#0B1220] to-[#111C35] rounded-2xl p-5 text-white shadow-lg shadow-slate-900/10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Total Settled Revenue</span>
          <p className="text-3xl font-black mt-2">{formatLKR(totalRevenue)}</p>
          <span className="text-[11px] text-slate-300 mt-1 block">Live collected at Colombo gates</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Ticket Value</span>
          <p className="text-3xl font-black text-slate-900 mt-2">{formatLKR(avgTicketValue)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Per parking visit</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Peak Occupancy Rate</span>
          <p className="text-3xl font-black text-blue-600 mt-2">78%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">During Colombo evening rush</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Vehicle Turnout</span>
          <p className="text-3xl font-black text-slate-900 mt-2">{entries.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Logged entries & exits</span>
        </div>
      </div>

      {/* 3. REVENUE CHART */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-extrabold text-[#0B1220] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Revenue Performance Trend in Sri Lankan Rupees</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {timeRange === 'today'
                ? 'Cumulative hourly revenue recorded at automated Colombo exit barrier'
                : timeRange === 'week'
                ? 'Daily performance across Monday - Sunday'
                : 'Monthly performance trajectory and projected targets'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl self-start sm:self-auto">
            Currency: LKR (Rs.)
          </span>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-6 border-b border-slate-200">
          {currentChartData.map((item, idx) => {
            const heightPct = Math.max(12, Math.round((item.val / maxVal) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatLKR(item.val)}
                </span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#111C35] to-[#3B82F6] group-hover:from-blue-600 group-hover:to-cyan-400 transition-all duration-300 shadow-md relative"
                />
                <span className="text-[11px] font-bold text-slate-600 mt-1 whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TWO COLUMNS: PAYMENT METHOD SPLIT & VEHICLE CATEGORY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Methods */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#0B1220] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Sri Lanka Payment Methods Split</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Distribution of gate revenue collected across accepted payment channels in Sri Lanka.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">Cash Payments (Counter Cashier)</span>
                  <span className="text-slate-900">{formatLKR(cashAmount)} ({cashPct}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${cashPct}%` }} className="h-full bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">Credit / Debit Card POS</span>
                  <span className="text-slate-900">{formatLKR(cardAmount)} ({cardPct}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${cardPct}%` }} className="h-full bg-blue-600 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">LankaPay Online QR / App</span>
                  <span className="text-slate-900">{formatLKR(lankaPayAmount)} ({lankaPayPct}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${lankaPayPct}%` }} className="h-full bg-cyan-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-900 block mb-0.5">LankaPay & Card Settlement</span>
            Direct integration with Commercial Bank, Sampath Bank, and HNB automated merchant acquiring.
          </div>
        </div>

        {/* Vehicle Category Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <h2 className="text-base font-extrabold text-[#0B1220] flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-600" />
            <span>Revenue Breakdown by Vehicle Category</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tariff volume and revenue generated across different vehicle classifications.
          </p>

          <div className="mt-6 space-y-3.5">
            {vehicleStats.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <span className="font-bold text-slate-800">{cat.type}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 block">{formatLKR(cat.amount)}</span>
                  <span className="text-[11px] text-slate-500">{cat.share}% of total volume</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. ZONE OCCUPANCY SUMMARY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-base font-extrabold text-[#0B1220] flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-indigo-600" />
          <span>Multi-Level Floor Occupancy Status</span>
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Real-time sensor occupancy across Ground Floor (Zone A), Level 1 (Zone B), and Level 2 (Zone C).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 block">Ground Floor (Zone A)</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{zoneAOccupied} / 40 bays</p>
            <span className="text-xs text-blue-600 font-semibold block mt-1">
              {Math.round((zoneAOccupied / 40) * 100)}% occupied
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 block">Level 1 (Zone B)</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{zoneBOccupied} / 40 bays</p>
            <span className="text-xs text-blue-600 font-semibold block mt-1">
              {Math.round((zoneBOccupied / 40) * 100)}% occupied
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 block">Level 2 (Zone C)</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{zoneCOccupied} / 40 bays</p>
            <span className="text-xs text-blue-600 font-semibold block mt-1">
              {Math.round((zoneCOccupied / 40) * 100)}% occupied
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
