import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Car, 
  Phone, 
  User, 
  DollarSign, 
  AlertCircle, 
  Layers,
  X,
  Check
} from 'lucide-react';
import { ParkingBooking, ParkingSlot, VehicleType, BookingStatus, FacilityConfig } from '../types';
import { 
  formatLKR, 
  formatSriLankanDateTime, 
  calculateParkingDuration, 
  calculateParkingFee 
} from '../utils/formatters';
import { PhoneInputField } from './PhoneInputField';
import { validateSriLankanPhone } from '../utils/phoneValidation';

interface BookingsViewProps {
  bookings: ParkingBooking[];
  slots: ParkingSlot[];
  config: FacilityConfig;
  preselectedSlotId?: string;
  onCreateBooking: (params: {
    customerName: string;
    customerPhone: string;
    vehicleRegNumber: string;
    vehicleType: VehicleType;
    slotId: string;
    arrivalDateTime: string;
    departureDateTime: string;
    notes?: string;
  }) => void;
  onCancelBooking: (bookingId: string) => void;
  onCheckInBooking: (booking: ParkingBooking) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  slots,
  config,
  preselectedSlotId,
  onCreateBooking,
  onCancelBooking,
  onCheckInBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleReg, setVehicleReg] = useState('WP CAR-');
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');

  const phoneValidation = validateSriLankanPhone(customerPhone);
  const isPhoneValid = phoneValidation.isValid;

  // Dates default: tomorrow 09:00 to 13:00 (Sri Lanka time)
  const [arrivalDateTime, setArrivalDateTime] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  const [departureDateTime, setDepartureDateTime] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(13, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  const [slotId, setSlotId] = useState(preselectedSlotId || slots.find((s) => s.status === 'available')?.id || 'P005');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (preselectedSlotId) {
      setSlotId(preselectedSlotId);
      setIsModalOpen(true);
    }
  }, [preselectedSlotId]);

  // Real-time estimated price calculation in LKR
  const estimatedCalculation = useMemo(() => {
    if (!arrivalDateTime || !departureDateTime) return null;
    const duration = calculateParkingDuration(arrivalDateTime, departureDateTime);
    if (duration.diffMs <= 0) return null;

    const feeData = calculateParkingFee(
      duration.billableHours,
      vehicleType,
      config.rateRules
    );
    return { duration, feeData };
  }, [arrivalDateTime, departureDateTime, vehicleType, config.rateRules]);

  // Available slots for the booking modal
  const eligibleSlots = useMemo(() => {
    return slots.filter((s) => s.status === 'available' || s.id === slotId);
  }, [slots, slotId]);

  // Filtered Bookings Table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesPlate = b.vehicleRegNumber.toLowerCase().includes(q);
        const matchesName = b.customerName.toLowerCase().includes(q);
        const matchesId = b.id.toLowerCase().includes(q);
        const matchesSlot = b.slotId.toLowerCase().includes(q);
        if (!matchesPlate && !matchesName && !matchesId && !matchesSlot) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, searchQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanReg = vehicleReg.trim().toUpperCase();
    if (!customerName.trim() || !cleanReg) {
      setErrorMsg('Please complete all customer and vehicle fields.');
      return;
    }

    const checkPhone = validateSriLankanPhone(customerPhone);
    if (!checkPhone.isValid) {
      setErrorMsg(checkPhone.errorMessage || 'Please enter all 10 digits of your phone number.');
      return;
    }

    if (!slotId) {
      setErrorMsg('Please select a parking bay.');
      return;
    }

    if (!estimatedCalculation || estimatedCalculation.duration.diffMs <= 0) {
      setErrorMsg('Departure date & time must be after arrival date & time.');
      return;
    }

    try {
      onCreateBooking({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        vehicleRegNumber: cleanReg,
        vehicleType,
        slotId,
        arrivalDateTime: new Date(arrivalDateTime).toISOString(),
        departureDateTime: new Date(departureDateTime).toISOString(),
        notes: notes.trim(),
      });
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create booking reservation.');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1220] tracking-tight">
              Online Advance Parking Bookings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {bookings.filter((b) => b.status === 'confirmed').length} Active Reservations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reserve parking slots in advance with automated overlap conflict protection and LKR rate calculation.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Advance Reservation</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking ID, vehicle plate, or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700"
          >
            <option value="all">All Bookings ({bookings.length})</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Bookings Found</h3>
            <p className="text-xs text-slate-400">There are no advance reservations matching this query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Vehicle Reg No</th>
                  <th className="py-3 px-4">Reserved Bay</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Arrival Window</th>
                  <th className="py-3 px-4">Departure Window</th>
                  <th className="py-3 px-4">Est. LKR Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((bkg) => (
                  <tr key={bkg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{bkg.id}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">{bkg.vehicleRegNumber}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#F59E0B]">{bkg.slotId}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{bkg.customerName}</p>
                      <p className="text-[10px] text-slate-400">{bkg.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{formatSriLankanDateTime(bkg.arrivalDateTime)}</td>
                    <td className="py-3.5 px-4 text-slate-600">{formatSriLankanDateTime(bkg.departureDateTime)}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900 font-mono">
                      {formatLKR(bkg.totalFeeLKR)}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(bkg.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {bkg.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => onCheckInBooking(bkg)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Check-In</span>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Cancel reservation ${bkg.id}?`)) {
                                  onCancelBooking(bkg.id);
                                }
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[10px] font-bold"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: CREATE ONLINE BOOKING */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0B1220]">Advance Parking Reservation</h3>
                <p className="text-xs text-slate-500">Lock in bay with guaranteed arrival guarantee</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ruwan Gunasekara"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <PhoneInputField
                  value={customerPhone}
                  onChange={(val) => setCustomerPhone(val)}
                  label="Contact Phone No *"
                  required
                  placeholder="0771234567"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle License Plate *</label>
                  <input
                    type="text"
                    required
                    placeholder="WP CAR-5501"
                    value={vehicleReg}
                    onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="car">Car / Sedan</option>
                    <option value="van">Van / KDH</option>
                    <option value="suv">SUV / 4WD</option>
                    <option value="three_wheeler">Three-Wheeler</option>
                    <option value="motorcycle">Motorbike</option>
                  </select>
                </div>
              </div>

              {/* Arrival and Departure Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Arrival Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={arrivalDateTime}
                    onChange={(e) => setArrivalDateTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expected Departure *</label>
                  <input
                    type="datetime-local"
                    required
                    value={departureDateTime}
                    onChange={(e) => setDepartureDateTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Slot Allocation */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Selected Bay *</label>
                <select
                  value={slotId}
                  onChange={(e) => setSlotId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {eligibleSlots.map((s) => (
                    <option key={s.id} value={s.id}>
                      Bay {s.id} &bull; {s.zone} ({s.floorLevel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Real-time Estimated Fee in LKR */}
              {estimatedCalculation && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-amber-800 font-bold block">Estimated Reservation Fee (LKR)</span>
                    <span className="text-slate-500 text-[11px]">
                      Duration: {estimatedCalculation.duration.formattedText} ({estimatedCalculation.duration.billableHours} hrs)
                    </span>
                  </div>
                  <span className="text-2xl font-black text-amber-700 font-mono">
                    {formatLKR(estimatedCalculation.feeData.totalAmount)}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={!isPhoneValid}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm & Lock In Reservation</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
