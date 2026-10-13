import React, { useState } from 'react';
import { 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  ArrowRight, 
  Plus, 
  LogOut, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  CreditCard, 
  ShieldCheck, 
  MapPin, 
  Phone,
  Sparkles,
  ChevronRight,
  Activity
} from 'lucide-react';
import { ParkingSlot, VehicleEntryRecord, ParkingBooking, PaymentTransaction } from '../types';
import { formatLKR, formatSriLankanDateTime } from '../utils/formatters';

interface DashboardViewProps {
  slots: ParkingSlot[];
  entries: VehicleEntryRecord[];
  bookings: ParkingBooking[];
  transactions: PaymentTransaction[];
  onOpenEntryModal: () => void;
  onOpenExitModal: () => void;
  onOpenBookingModal: () => void;
  onNavigateToSlots: () => void;
  onNavigateToReports: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  slots,
  entries,
  bookings,
  transactions,
  onOpenEntryModal,
  onOpenExitModal,
  onOpenBookingModal,
  onNavigateToSlots,
  onNavigateToReports,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Exact counts from live slots
  const totalSlots = slots.length;
  const availableSlots = slots.filter((s) => s.status === 'available').length;
  const occupiedSlots = slots.filter((s) => s.status === 'occupied').length;
  const reservedSlots = slots.filter((s) => s.status === 'reserved').length;
  const occupancyRate = totalSlots > 0 ? Math.round(((occupiedSlots + reservedSlots) / totalSlots) * 100) : 0;

  // Revenue calculation in LKR
  const todayRevenue = transactions.reduce((sum, t) => sum + t.amountLKR, 0);

  // Revenue chart dataset in LKR
  const dailyRevenueData = [
    { label: '06:00', amount: 2400 },
    { label: '08:00', amount: 4800 },
    { label: '10:00', amount: 8200 },
    { label: '12:00', amount: 12500 },
    { label: '14:00', amount: 16800 },
    { label: '16:00', amount: 20400 },
    { label: '18:00', amount: 24500 },
  ];

  const weeklyRevenueData = [
    { label: 'Mon', amount: 21200 },
    { label: 'Tue', amount: 22800 },
    { label: 'Wed', amount: 23400 },
    { label: 'Thu', amount: 24500 },
    { label: 'Fri', amount: 27900 },
    { label: 'Sat', amount: 31500 },
    { label: 'Sun', amount: 26400 },
  ];

  const monthlyRevenueData = [
    { label: 'May', amount: 620000 },
    { label: 'Jun', amount: 685000 },
    { label: 'Jul', amount: 710000 },
    { label: 'Aug', amount: 735000 },
    { label: 'Sep', amount: 760000 },
    { label: 'Oct (Proj)', amount: 820000 },
  ];

  const currentChartData =
    chartPeriod === 'daily'
      ? dailyRevenueData
      : chartPeriod === 'weekly'
      ? weeklyRevenueData
      : monthlyRevenueData;

  const maxChartVal = Math.max(...currentChartData.map((d) => d.amount));

  // Recent 6 vehicle activities
  const recentEntries = entries.slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP STATS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1220] tracking-tight">
              Colombo Facility Operations Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            SmartPark Pro &bull; 137 Galle Road, Colombo 03 &bull; Timezone: <span className="font-semibold text-slate-700">Asia/Colombo</span>
          </p>
        </div>

        {/* Quick Gate Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenEntryModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Vehicle Entry</span>
          </button>

          <button
            onClick={onOpenExitModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-black shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>Vehicle Exit</span>
          </button>

          <button
            onClick={onOpenBookingModal}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#F59E0B]" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* 2. STATS KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Slots: 120 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Slots</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#0B1220] mt-2">{totalSlots}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">P001 to P120</span>
        </div>

        {/* Available: 75 (#10B981) */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Available</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <span className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#10B981] mt-2">{availableSlots}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Green &bull; Ready</span>
        </div>

        {/* Occupied: 35 (#F43F5E) */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Occupied</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Car className="w-4 h-4 text-[#F43F5E]" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#F43F5E] mt-2">{occupiedSlots}</p>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Red &bull; Parked</span>
        </div>

        {/* Reserved: 10 (#F59E0B) */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Reserved</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4 text-[#F59E0B]" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#F59E0B] mt-2">{reservedSlots}</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Yellow &bull; Booked</span>
        </div>

        {/* Today's Revenue: Rs. 24,500.00 */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-[#0B1220] to-[#111C35] rounded-2xl p-5 text-white shadow-lg shadow-slate-900/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Today's Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 text-[#22D3EE] flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {formatLKR(todayRevenue)}
          </p>
          <span className="text-[11px] text-slate-300 font-mono mt-1 block">
            Occupancy: <strong className="text-emerald-400">{occupancyRate}%</strong>
          </span>
        </div>
      </div>

      {/* 3. REVENUE CHARTS (LKR) & OCCUPANCY RATE GAUGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Revenue Chart in LKR (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#3B82F6]" />
                <h3 className="text-base font-extrabold text-[#0B1220]">
                  Revenue Performance in Sri Lankan Rupees (LKR)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time parking cash & digital collections in Asia/Colombo time
              </p>
            </div>

            {/* Daily / Weekly / Monthly Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600">
              <button
                onClick={() => setChartPeriod('daily')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartPeriod === 'daily'
                    ? 'bg-white text-blue-700 shadow-sm font-black'
                    : 'hover:text-slate-900'
                }`}
              >
                Today (Hourly)
              </button>
              <button
                onClick={() => setChartPeriod('weekly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartPeriod === 'weekly'
                    ? 'bg-white text-blue-700 shadow-sm font-black'
                    : 'hover:text-slate-900'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setChartPeriod('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartPeriod === 'monthly'
                    ? 'bg-white text-blue-700 shadow-sm font-black'
                    : 'hover:text-slate-900'
                }`}
              >
                Monthly Trend
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100">
            {currentChartData.map((item, idx) => {
              const heightPct = Math.round((item.amount / maxChartVal) * 100);

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end cursor-pointer"
                >
                  <div className="text-[10px] font-mono font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatLKR(item.amount)}
                  </div>
                  <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden flex items-end h-44">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        idx === currentChartData.length - 1
                          ? 'bg-gradient-to-t from-[#3B82F6] to-[#22D3EE]'
                          : 'bg-gradient-to-t from-[#111C35] to-[#3B82F6]'
                      } group-hover:scale-y-105`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Peak Hourly Inflow: 12:00 PM - 02:00 PM</span>
            <span className="font-bold text-emerald-600">
              Average Parking Fee: Rs. 280.00 / vehicle
            </span>
          </div>
        </div>

        {/* Right: Occupancy Rate & Zone Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0B1220]">Occupancy Analytics</h3>
              <button
                onClick={onNavigateToSlots}
                className="text-xs font-bold text-[#3B82F6] hover:underline"
              >
                View 120 Slots &rarr;
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Facility utilization by level</p>

            {/* Circular Progress Gauge */}
            <div className="py-5 text-center">
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-blue-50 border-4 border-blue-100">
                <span className="text-3xl font-black text-[#0B1220]">{occupancyRate}%</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                45 of 120 slots occupied or reserved
              </p>
            </div>

            {/* Zone breakdown */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Zone A (Ground - P001 to P040)</span>
                  <span className="text-slate-900 font-bold">65% Full</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#3B82F6] h-full rounded-full" style={{ width: '65%' }} />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Zone B (Level 1 - P041 to P080)</span>
                  <span className="text-slate-900 font-bold">35% Full</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#22D3EE] h-full rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Zone C (Level 2 - P081 to P120)</span>
                  <span className="text-slate-900 font-bold">12% Full</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Facility Status</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
              Normal Capacity
            </span>
          </div>
        </div>
      </div>

      {/* 4. RECENT VEHICLE ACTIVITY (Sri Lankan plates & times) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-[#0B1220]">
              Recent Vehicle Activity & Gate Movements
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live arrival and departure log with Sri Lankan license numbers in Colombo local time
            </p>
          </div>
          <button
            onClick={onNavigateToReports}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Audit Log Reports &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Vehicle Reg No</th>
                <th className="py-3 px-4">Vehicle Category</th>
                <th className="py-3 px-4">Slot Bay</th>
                <th className="py-3 px-4">Driver / Customer</th>
                <th className="py-3 px-4">Entry Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Fee Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEntries.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B1220] text-sm">
                    {rec.vehicleRegNumber}
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-600 font-medium">
                    {rec.vehicleType.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-blue-700">
                    {rec.slotId}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{rec.customerName}</p>
                    <p className="text-[10px] text-slate-400">{rec.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {formatSriLankanDateTime(rec.entryTime)}
                  </td>
                  <td className="py-3.5 px-4">
                    {rec.status === 'active' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        Parked Inside
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Exited
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {rec.feeAmountLKR ? formatLKR(rec.feeAmountLKR) : 'Accruing Hourly'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
