import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Search, 
  Filter, 
  Clock, 
  ArrowRight, 
  LogOut, 
  Plus, 
  Phone, 
  User, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  ShieldCheck,
  Printer,
  FileText
} from 'lucide-react';
import { VehicleEntryRecord, ParkingSlot, VehicleType, FacilityConfig } from '../types';
import { 
  formatLKR, 
  formatSriLankanDateTime, 
  calculateParkingDuration, 
  calculateParkingFee 
} from '../utils/formatters';

interface GateOperationsViewProps {
  entries: VehicleEntryRecord[];
  slots: ParkingSlot[];
  config: FacilityConfig;
  onOpenEntryModal: () => void;
  onOpenExitModal: (preselectedEntryId?: string) => void;
  onOpenReceipt: (receiptData: any) => void;
}

export const GateOperationsView: React.FC<GateOperationsViewProps> = ({
  entries,
  slots,
  config,
  onOpenEntryModal,
  onOpenExitModal,
  onOpenReceipt,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');

  // Counts
  const activeEntries = useMemo(() => entries.filter((e) => e.status === 'active'), [entries]);
  const historyEntries = useMemo(() => entries.filter((e) => e.status === 'exited'), [entries]);

  const filteredList = useMemo(() => {
    const targetList = activeTab === 'active' ? activeEntries : historyEntries;
    return targetList.filter((item) => {
      if (vehicleTypeFilter !== 'all' && item.vehicleType !== vehicleTypeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesPlate = item.vehicleRegNumber.toLowerCase().includes(q);
        const matchesName = item.customerName.toLowerCase().includes(q);
        const matchesPhone = item.customerPhone.toLowerCase().includes(q);
        const matchesSlot = item.slotId.toLowerCase().includes(q);
        if (!matchesPlate && !matchesName && !matchesPhone && !matchesSlot) {
          return false;
        }
      }
      return true;
    });
  }, [activeTab, activeEntries, historyEntries, vehicleTypeFilter, searchQuery]);

  const getSlotDetails = (slotId: string) => {
    return slots.find((s) => s.id === slotId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP HEADER & OPERATIONAL METRICS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1220] tracking-tight">
              Gate Operations & Barrier Terminal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Control
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time vehicle check-in, automated LKR tariff calculation, and gate barrier checkout.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenEntryModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Vehicle Entry</span>
          </button>

          <button
            onClick={() => onOpenExitModal()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-black shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>Process Vehicle Exit</span>
          </button>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Vehicles Inside</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-[#F43F5E]">{activeEntries.length}</span>
            <span className="text-[11px] text-slate-400">/ 120 bays</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Available Bays</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-[#10B981]">
              {slots.filter((s) => s.status === 'available').length}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">Vacant</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Exits Processed</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-[#3B82F6]">{historyEntries.length}</span>
            <span className="text-[11px] text-blue-600 font-semibold">Settled</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Default Base Rate</span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900">
              Rs. {config.rateRules.firstHourRate}
            </span>
            <span className="text-[11px] text-slate-500">/ 1st hr</span>
          </div>
        </div>
      </div>

      {/* 3. CONTROLS & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tab Selection */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'active'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-rose-500" />
            <span>Vehicles Inside Facility ({activeEntries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Exit & Payment History ({historyEntries.length})</span>
          </button>
        </div>

        {/* Search & Type Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search plate (e.g. WP CAB), name, slot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <select
            value={vehicleTypeFilter}
            onChange={(e) => setVehicleTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Vehicles</option>
            <option value="car">Car (1.0x)</option>
            <option value="van">Van (1.2x)</option>
            <option value="suv">SUV (1.2x)</option>
            <option value="three_wheeler">Three Wheeler (0.7x)</option>
            <option value="motorcycle">Motorcycle (0.5x)</option>
            <option value="bus">Commercial Bus (2.0x)</option>
          </select>
        </div>
      </div>

      {/* 4. ACTIVE VEHICLES / HISTORY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="py-16 text-center">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Vehicle Records Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchQuery
                ? 'Try adjusting your search query or vehicle type filter.'
                : activeTab === 'active'
                ? 'All parking bays are currently unoccupied. New check-ins will appear here.'
                : 'No exited vehicles recorded yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">Vehicle Reg Plate</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Allocated Bay</th>
                  <th className="py-3 px-4">Customer Contact</th>
                  <th className="py-3 px-4">{activeTab === 'active' ? 'Entry Time' : 'Timings'}</th>
                  <th className="py-3 px-4">Duration & Units</th>
                  <th className="py-3 px-4">{activeTab === 'active' ? 'Accrued Fee' : 'Settled Fee'}</th>
                  <th className="py-3 px-4 text-right">Gate Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((record) => {
                  const slot = getSlotDetails(record.slotId);
                  const isExited = record.status === 'exited';
                  
                  // Calculate live duration and accrued fee if currently active
                  const duration = isExited
                    ? {
                        formattedText: `${Math.floor((record.durationMinutes || 60) / 60)}h ${(record.durationMinutes || 60) % 60}m`,
                        billableHours: record.billableHours || 1,
                      }
                    : calculateParkingDuration(record.entryTime);

                  const liveFee = isExited
                    ? record.feeAmountLKR || 0
                    : calculateParkingFee(
                        duration.billableHours,
                        record.vehicleType,
                        config.rateRules
                      ).totalAmount;

                  return (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Plate */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#0B1220] bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                            {record.vehicleRegNumber}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {record.id}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                          {record.vehicleType.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Allocated Bay */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {record.slotId}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {slot?.floorLevel || 'Ground'}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{record.customerName}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{record.customerPhone}</span>
                        </p>
                      </td>

                      {/* Timings */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800">
                          {formatSriLankanDateTime(record.entryTime)}
                        </p>
                        {isExited && record.exitTime && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Exit: {formatSriLankanDateTime(record.exitTime)}
                          </p>
                        )}
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">
                          {duration.formattedText}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {duration.billableHours} {duration.billableHours === 1 ? 'hour' : 'hours'} billed
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="py-3.5 px-4">
                        <span className={`font-black text-sm ${isExited ? 'text-emerald-700' : 'text-[#0B1220]'}`}>
                          {formatLKR(liveFee)}
                        </span>
                        {isExited && record.paymentMethod && (
                          <span className="block text-[10px] text-slate-500 font-semibold">
                            Via {record.paymentMethod}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {activeTab === 'active' ? (
                          <button
                            onClick={() => onOpenExitModal(record.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 ml-auto transition-all"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Process Exit</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onOpenReceipt({
                                receiptNumber: record.receiptNumber || `RCPT-LK-${record.id.slice(-5)}`,
                                transactionId: `TXN-LK-${record.id.slice(-5)}`,
                                vehicleRegNumber: record.vehicleRegNumber,
                                vehicleType: record.vehicleType,
                                customerName: record.customerName,
                                customerPhone: record.customerPhone,
                                slotId: record.slotId,
                                entryTime: record.entryTime,
                                exitTime: record.exitTime || new Date().toISOString(),
                                durationText: duration.formattedText,
                                billableHours: duration.billableHours,
                                amountLKR: record.feeAmountLKR || 0,
                                paymentMethod: record.paymentMethod || 'Cash',
                                facilityName: config.facilityName,
                                facilityAddress: config.locationAddress,
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 ml-auto transition-all"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
