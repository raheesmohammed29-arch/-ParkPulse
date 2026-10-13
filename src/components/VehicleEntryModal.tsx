import React, { useState, useEffect } from 'react';
import { 
  Car, 
  X, 
  AlertCircle, 
  Plus, 
  Layers, 
  Phone, 
  User, 
  Clock, 
  CheckCircle2, 
  MapPin,
  Calendar
} from 'lucide-react';
import { ParkingSlot, VehicleType } from '../types';
import { PhoneInputField } from './PhoneInputField';
import { validateSriLankanPhone } from '../utils/phoneValidation';

interface VehicleEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSlots: ParkingSlot[];
  preselectedSlotId?: string;
  onConfirmEntry: (data: {
    vehicleRegNumber: string;
    vehicleType: VehicleType;
    customerName: string;
    customerPhone: string;
    slotId: string;
    entryTime?: string;
    notes?: string;
  }) => void;
}

export const VehicleEntryModal: React.FC<VehicleEntryModalProps> = ({
  isOpen,
  onClose,
  availableSlots,
  preselectedSlotId,
  onConfirmEntry,
}) => {
  const [vehicleReg, setVehicleReg] = useState('WP CAB-');
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [slotId, setSlotId] = useState(preselectedSlotId || availableSlots[0]?.id || 'P001');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const phoneValidation = validateSriLankanPhone(customerPhone);
  const isPhoneValid = phoneValidation.isValid;

  useEffect(() => {
    if (preselectedSlotId) {
      setSlotId(preselectedSlotId);
    } else if (availableSlots.length > 0 && !slotId) {
      setSlotId(availableSlots[0].id);
    }
  }, [preselectedSlotId, availableSlots]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanReg = vehicleReg.trim().toUpperCase();
    if (!cleanReg || cleanReg === 'WP CAB-') {
      setErrorMsg('Please enter a valid Sri Lankan vehicle registration number (e.g., WP CAB-1234).');
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg('Please enter the customer / driver name.');
      return;
    }

    const checkPhone = validateSriLankanPhone(customerPhone);
    if (!checkPhone.isValid) {
      setErrorMsg(checkPhone.errorMessage || 'Please enter all 10 digits of your phone number.');
      return;
    }

    if (!slotId) {
      setErrorMsg('Please select an available parking bay.');
      return;
    }

    try {
      onConfirmEntry({
        vehicleRegNumber: cleanReg,
        vehicleType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        slotId,
        entryTime: new Date().toISOString(),
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record vehicle entry.');
    }
  };

  const fillSampleCar = () => {
    setVehicleReg(`WP CAR-${Math.floor(1000 + Math.random() * 8999)}`);
    setVehicleType('car');
    setCustomerName('Dilshan Madushanka');
    setCustomerPhone('0774567890');
    setErrorMsg(null);
  };

  const fillSampleTuk = () => {
    setVehicleReg(`WP TUK-${Math.floor(1000 + Math.random() * 8999)}`);
    setVehicleType('three_wheeler');
    setCustomerName('Sunil Shantha');
    setCustomerPhone('0718890011');
    setErrorMsg(null);
  };

  const fillSampleVan = () => {
    setVehicleReg(`WP BCD-${Math.floor(1000 + Math.random() * 8999)}`);
    setVehicleType('van');
    setCustomerName('Ruwan Jayakody');
    setCustomerPhone('0762234455');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#0B1220]">Vehicle Gate Entry</h3>
            <p className="text-xs text-slate-500">Record arriving vehicle & allocate parking slot</p>
          </div>
        </div>

        {/* Quick Demo Autofill Buttons */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            1-Click Demo Sri Lankan Vehicles
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={fillSampleCar}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 font-bold"
            >
              🚗 Car (WP CAR)
            </button>
            <button
              type="button"
              onClick={fillSampleTuk}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 font-bold"
            >
              🛺 Tuk-Tuk (WP TUK)
            </button>
            <button
              type="button"
              onClick={fillSampleVan}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 font-bold"
            >
              🚐 Van (WP BCD)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Vehicle Registration No *
              </label>
              <input
                type="text"
                required
                placeholder="WP CAB-1234"
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Vehicle Category *
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="car">Car / Sedan (1.0x)</option>
                <option value="van">Van / KDH (1.2x)</option>
                <option value="suv">SUV / Jeep (1.2x)</option>
                <option value="three_wheeler">Three-Wheeler (0.7x)</option>
                <option value="motorcycle">Motorbike / Scooter (0.5x)</option>
                <option value="bus">Bus / Heavy Vehicle (2.0x)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Driver / Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kasun Perera"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <PhoneInputField
              value={customerPhone}
              onChange={(val) => setCustomerPhone(val)}
              label="Sri Lankan Phone No *"
              required
              placeholder="0771234567"
            />
          </div>

          {/* Slot Allocation */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Assign Parking Bay (Available Slots Only) *
            </label>
            <select
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {availableSlots.length === 0 ? (
                <option value="">No bays available - Car park is full</option>
              ) : (
                availableSlots.map((s) => (
                  <option key={s.id} value={s.id}>
                    Slot {s.id} &bull; {s.zone} ({s.floorLevel}) {s.hasEvCharging ? '⚡ EV Ready' : ''}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Rate Policy Reminder */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-[11px] text-blue-900 flex items-center justify-between">
            <span>Standard Parking Rate:</span>
            <span className="font-bold">Rs. 100 first hr &bull; Rs. 100/hr additional</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={availableSlots.length === 0 || !isPhoneValid}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Confirm Vehicle Entry & Issue Pass</span>
          </button>
        </form>
      </div>
    </div>
  );
};
