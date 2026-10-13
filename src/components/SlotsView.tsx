import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Car, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Zap, 
  Clock, 
  ArrowRight, 
  X, 
  Phone, 
  User, 
  DollarSign, 
  LogOut, 
  Plus, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { ParkingSlot, SlotStatus, VehicleType } from '../types';
import { formatLKR, formatSriLankanDateTime, calculateParkingDuration, calculateParkingFee } from '../utils/formatters';

interface SlotsViewProps {
  slots: ParkingSlot[];
  onSelectSlotForEntry: (slotId: string) => void;
  onSelectSlotForExit: (slotId: string) => void;
  onSelectSlotForBooking: (slotId: string) => void;
}

export const SlotsView: React.FC<SlotsViewProps> = ({
  slots,
  onSelectSlotForEntry,
  onSelectSlotForExit,
  onSelectSlotForBooking,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected slot detail modal
  const [inspectSlot, setInspectSlot] = useState<ParkingSlot | null>(null);

  // Counters
  const total = slots.length;
  const availableCount = slots.filter((s) => s.status === 'available').length;
  const occupiedCount = slots.filter((s) => s.status === 'occupied').length;
  const reservedCount = slots.filter((s) => s.status === 'reserved').length;

  // Filtered Slots
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      if (selectedZone !== 'all') {
        if (selectedZone === 'A' && !slot.zone.includes('Zone A')) return false;
        if (selectedZone === 'B' && !slot.zone.includes('Zone B')) return false;
        if (selectedZone === 'C' && !slot.zone.includes('Zone C')) return false;
      }

      if (statusFilter !== 'all' && slot.status !== statusFilter) return false;

      if (vehicleFilter !== 'all') {
        if (!slot.supportedVehicleTypes.includes(vehicleFilter as VehicleType)) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = slot.id.toLowerCase().includes(q);
        const matchesPlate = slot.currentOccupant?.vehicleRegNumber.toLowerCase().includes(q);
        const matchesName = slot.currentOccupant?.customerName.toLowerCase().includes(q);
        if (!matchesId && !matchesPlate && !matchesName) return false;
      }

      return true;
    });
  }, [slots, selectedZone, statusFilter, vehicleFilter, searchQuery]);

  // Status Styling Helper
  const getSlotColorClasses = (status: SlotStatus) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 border-[#10B981]';
      case 'occupied':
        return 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-800 border-[#F43F5E]';
      case 'reserved':
        return 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border-[#F59E0B]';
    }
  };

  const getStatusBadge = (status: SlotStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#10B981] text-white">
            Available
          </span>
        );
      case 'occupied':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#F43F5E] text-white">
            Occupied
          </span>
        );
      case 'reserved':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#F59E0B] text-white">
            Reserved
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1220] tracking-tight">
              120 Interactive Parking Slots
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              P001 to P120
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Click any bay to view occupant details, calculate accrued LKR fees, or record vehicle movements.
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>Available ({availableCount})</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
            <span>Occupied ({occupiedCount})</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span>Reserved ({reservedCount})</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        {/* Zone Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold uppercase text-slate-400 mr-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Zone / Level:
          </span>
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedZone === 'all'
                ? 'bg-[#0B1220] text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 120 Slots
          </button>
          <button
            onClick={() => setSelectedZone('A')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedZone === 'A'
                ? 'bg-[#3B82F6] text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Zone A &bull; Ground Floor (P001 - P040)
          </button>
          <button
            onClick={() => setSelectedZone('B')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedZone === 'B'
                ? 'bg-[#3B82F6] text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Zone B &bull; Level 1 (P041 - P080)
          </button>
          <button
            onClick={() => setSelectedZone('C')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedZone === 'C'
                ? 'bg-[#3B82F6] text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Zone C &bull; Level 2 (P081 - P120)
          </button>
        </div>

        {/* Search & Sub-filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Bay (e.g. P015) or Plate (WP CAB-1234)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Slot Statuses</option>
              <option value="available">🟢 Available Only ({availableCount})</option>
              <option value="occupied">🔴 Occupied Only ({occupiedCount})</option>
              <option value="reserved">🟡 Reserved Only ({reservedCount})</option>
            </select>
          </div>

          {/* Vehicle Category */}
          <div>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Vehicle Types</option>
              <option value="car">Car / Sedan / Hatchback</option>
              <option value="van">Van / KDH / Wagon</option>
              <option value="suv">SUV / 4WD / Jeep</option>
              <option value="motorcycle">Motorbike / Scooter</option>
              <option value="three_wheeler">Three-Wheeler (Tuk-Tuk)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 120 SLOTS GRID */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 text-xs text-slate-500">
          <span className="font-bold">
            Showing <strong className="text-slate-900">{filteredSlots.length}</strong> of 120 Parking Bays
          </span>
          <span className="font-mono text-slate-400">
            Colombo City Center &bull; Speed Limit 10 km/h
          </span>
        </div>

        {filteredSlots.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Car className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No bays match your filter</h3>
            <p className="text-xs text-slate-400">Try adjusting your zone, vehicle category, or status query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {filteredSlots.map((slot) => {
              const isOccupied = slot.status === 'occupied';
              const isReserved = slot.status === 'reserved';
              const isAvailable = slot.status === 'available';

              return (
                <div
                  key={slot.id}
                  onClick={() => setInspectSlot(slot)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[105px] select-none hover:scale-[1.03] hover:shadow-lg ${getSlotColorClasses(
                    slot.status
                  )}`}
                >
                  {/* Top: Slot ID & EV Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black tracking-wider text-slate-900">
                      {slot.id}
                    </span>
                    {slot.hasEvCharging && (
                      <span title="EV Charging" className="text-cyan-600">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                      </span>
                    )}
                  </div>

                  {/* Middle: Icon or Plate Number */}
                  <div className="py-1.5 text-center">
                    {isOccupied ? (
                      <div>
                        <Car className="w-6 h-6 mx-auto text-[#F43F5E]" />
                        <p className="font-mono text-[9px] font-bold text-slate-800 mt-1 truncate max-w-[85px] mx-auto">
                          {slot.currentOccupant?.vehicleRegNumber || 'OCCUPIED'}
                        </p>
                      </div>
                    ) : isReserved ? (
                      <div>
                        <Calendar className="w-6 h-6 mx-auto text-[#F59E0B]" />
                        <p className="text-[9px] font-bold text-amber-800 mt-1">BOOKED</p>
                      </div>
                    ) : (
                      <div>
                        <span className="w-6 h-6 rounded-full border border-dashed border-emerald-500 text-[#10B981] flex items-center justify-center text-xs font-black mx-auto">
                          P
                        </span>
                        <p className="text-[9px] font-bold text-emerald-700 mt-1">OPEN</p>
                      </div>
                    )}
                  </div>

                  {/* Accessible Text Status Label (MANDATORY REQUIREMENT) */}
                  <div className="text-center pt-1 border-t border-slate-200/50">
                    <span
                      className={`text-[8px] font-black tracking-widest uppercase block ${
                        isAvailable
                          ? 'text-emerald-700'
                          : isOccupied
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SLOT DETAIL MODAL / DRAWER */}
      {inspectSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
            <button
              onClick={() => setInspectSlot(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  {inspectSlot.zone} &bull; {inspectSlot.floorLevel}
                </span>
                <h3 className="text-3xl font-black text-[#0B1220] mt-0.5">
                  Slot Bay {inspectSlot.id}
                </h3>
              </div>
              <div className="mr-8">
                {getStatusBadge(inspectSlot.status)}
              </div>
            </div>

            {/* If Occupied -> Show Live Parking Details */}
            {inspectSlot.status === 'occupied' && inspectSlot.currentOccupant && (
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500">Parked Vehicle</span>
                  <span className="font-mono text-base font-black text-[#0B1220]">
                    {inspectSlot.currentOccupant.vehicleRegNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Driver Name</span>
                    <span className="font-bold text-slate-800">{inspectSlot.currentOccupant.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                    <span className="font-mono font-bold text-slate-800">{inspectSlot.currentOccupant.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Entry Timestamp</span>
                    <span className="text-slate-700 font-medium">{formatSriLankanDateTime(inspectSlot.currentOccupant.entryTime)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle Type</span>
                    <span className="capitalize font-bold text-slate-800">{inspectSlot.currentOccupant.vehicleType}</span>
                  </div>
                </div>

                {/* Live fee estimation in LKR */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Elapsed Duration</span>
                    <p className="text-xs font-bold text-slate-800">
                      {calculateParkingDuration(inspectSlot.currentOccupant.entryTime).formattedText}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Accrued LKR Fee</span>
                    <p className="text-xl font-black text-blue-700">
                      {formatLKR(
                        calculateParkingFee(
                          calculateParkingDuration(inspectSlot.currentOccupant.entryTime).billableHours,
                          inspectSlot.currentOccupant.vehicleType
                        ).totalAmount
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const sid = inspectSlot.id;
                    setInspectSlot(null);
                    onSelectSlotForExit(sid);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Process Vehicle Exit & Payment</span>
                </button>
              </div>
            )}

            {/* If Reserved -> Show Booking Details */}
            {inspectSlot.status === 'reserved' && inspectSlot.activeBooking && (
              <div className="space-y-4 bg-amber-50/60 p-5 rounded-2xl border border-amber-200">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Active Advance Reservation
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Customer</span>
                    <span className="font-bold text-slate-900">{inspectSlot.activeBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Vehicle Plate</span>
                    <span className="font-mono font-bold text-slate-900">{inspectSlot.activeBooking.vehicleRegNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Arrival Expected</span>
                    <span className="text-slate-700">{formatSriLankanDateTime(inspectSlot.activeBooking.startTime)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Departure Expected</span>
                    <span className="text-slate-700">{formatSriLankanDateTime(inspectSlot.activeBooking.endTime)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const sid = inspectSlot.id;
                    setInspectSlot(null);
                    onSelectSlotForEntry(sid);
                  }}
                  className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Check-In Reserved Vehicle Now</span>
                </button>
              </div>
            )}

            {/* If Available -> Actions to park or reserve */}
            {inspectSlot.status === 'available' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">Slot is currently free and ready for parking.</p>
                  <p className="text-slate-600">
                    Pricing: Rs. 100 1st hr &bull; Rs. 100/hr additional &bull; Daily Max Rs. 1,000
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const sid = inspectSlot.id;
                      setInspectSlot(null);
                      onSelectSlotForEntry(sid);
                    }}
                    className="py-3.5 px-4 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Park Vehicle Here</span>
                  </button>

                  <button
                    onClick={() => {
                      const sid = inspectSlot.id;
                      setInspectSlot(null);
                      onSelectSlotForBooking(sid);
                    }}
                    className="py-3.5 px-4 rounded-xl bg-[#111C35] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#F59E0B]" />
                    <span>Reserve in Advance</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
