import React, { useState, useMemo } from 'react';
import { 
  LogOut, 
  X, 
  Search, 
  Car, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { VehicleEntryRecord, FacilityConfig } from '../types';
import { 
  formatLKR, 
  formatSriLankanDateTime, 
  calculateParkingDuration, 
  calculateParkingFee 
} from '../utils/formatters';

interface VehicleExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEntries: VehicleEntryRecord[];
  preselectedEntryId?: string;
  config: FacilityConfig;
  onConfirmExit: (params: {
    entryId: string;
    exitTime?: string;
    paymentMethod: 'Cash' | 'Card' | 'LankaPay Online';
  }) => void;
}

export const VehicleExitModal: React.FC<VehicleExitModalProps> = ({
  isOpen,
  onClose,
  activeEntries,
  preselectedEntryId,
  config,
  onConfirmExit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string>(
    preselectedEntryId || activeEntries[0]?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'LankaPay Online'>('Cash');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Keep selectedEntryId synced if preselectedEntryId passed
  React.useEffect(() => {
    if (preselectedEntryId) {
      setSelectedEntryId(preselectedEntryId);
    } else if (activeEntries.length > 0 && !selectedEntryId) {
      setSelectedEntryId(activeEntries[0].id);
    }
  }, [preselectedEntryId, activeEntries]);

  if (!isOpen) return null;

  // Filtered active list for searching
  const filteredActive = activeEntries.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      e.vehicleRegNumber.toLowerCase().includes(q) ||
      e.customerName.toLowerCase().includes(q) ||
      e.slotId.toLowerCase().includes(q)
    );
  });

  const selectedEntry = activeEntries.find((e) => e.id === selectedEntryId) || filteredActive[0];

  // Dynamic fee computation in LKR
  const calculation = useMemo(() => {
    if (!selectedEntry) return null;
    const now = new Date();
    const duration = calculateParkingDuration(selectedEntry.entryTime, now);
    const feeData = calculateParkingFee(
      duration.billableHours,
      selectedEntry.vehicleType,
      config.rateRules
    );
    return { duration, feeData };
  }, [selectedEntry, config.rateRules]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedEntry) {
      setErrorMsg('Please select a currently parked vehicle to process exit.');
      return;
    }

    try {
      onConfirmExit({
        entryId: selectedEntry.id,
        exitTime: new Date().toISOString(),
        paymentMethod,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process vehicle exit.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <LogOut className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#0B1220]">Vehicle Gate Exit & Billing</h3>
            <p className="text-xs text-slate-500">Calculate duration, bill in LKR, and release parking bay</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeEntries.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <Car className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Active Vehicles Inside</h4>
            <p className="text-xs text-slate-500">All 120 parking bays are currently empty.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Vehicle Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Select Parked Vehicle ({activeEntries.length} inside car park)
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Search by plate or slot</span>
              </div>

              <div className="relative mb-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Quick search vehicle plate (e.g. WP CAB-1234)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={selectedEntry?.id || ''}
                onChange={(e) => setSelectedEntryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filteredActive.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.vehicleRegNumber} &bull; Slot {e.slotId} &bull; {e.customerName} ({e.vehicleType.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Fee & Duration Computation Card in LKR */}
            {selectedEntry && calculation && (
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Slot Bay</span>
                    <span className="font-mono text-lg font-black text-blue-700">{selectedEntry.slotId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">License Plate</span>
                    <span className="font-mono text-base font-black text-slate-900">{selectedEntry.vehicleRegNumber}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Entry Time</span>
                    <span className="font-medium text-slate-800">
                      {formatSriLankanDateTime(selectedEntry.entryTime)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Exit Time</span>
                    <span className="font-medium text-slate-800">Now (Asia/Colombo)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Elapsed Duration</span>
                    <span className="font-bold text-slate-900">
                      {calculation.duration.formattedText}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Billable Hours</span>
                    <span className="font-bold text-slate-900">
                      {calculation.duration.billableHours} hrs
                    </span>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Pricing Formula:</span>
                    <span className="font-mono">{calculation.feeData.breakdown}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-slate-100">
                    <span>Total Parking Fee (LKR):</span>
                    <span className="text-xl font-black text-blue-700">
                      {formatLKR(calculation.feeData.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Payment Method */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Payment Collection Method (LKR)
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['Cash', 'Card', 'LankaPay Online'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2.5 px-2 rounded-xl border font-bold text-center transition-all ${
                      paymentMethod === method
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!selectedEntry}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#3B82F6] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                Confirm Exit, Collect{' '}
                {calculation ? formatLKR(calculation.feeData.totalAmount) : 'Fee'}{' '}
                & Print Receipt
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
