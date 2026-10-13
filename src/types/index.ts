import { ParkingRateRules } from '../utils/formatters';

export type SlotStatus = 'available' | 'occupied' | 'reserved';

export type VehicleType =
  | 'car'
  | 'van'
  | 'suv'
  | 'motorcycle'
  | 'three_wheeler'
  | 'bus';

export interface CurrentOccupantInfo {
  vehicleRegNumber: string;
  vehicleType: VehicleType;
  customerName: string;
  customerPhone: string;
  entryTime: string;
  entryRecordId: string;
}

export interface ActiveBookingInfo {
  bookingId: string;
  customerName: string;
  vehicleRegNumber: string;
  startTime: string;
  endTime: string;
}

export interface ParkingSlot {
  id: string; // e.g., 'P001' to 'P120'
  slotNumber: number; // 1 to 120
  zone: string; // 'Zone A (Ground)', 'Zone B (Level 1)', 'Zone C (Level 2)'
  floorLevel: string; // 'Ground', 'Level 1', 'Level 2'
  status: SlotStatus;
  supportedVehicleTypes: VehicleType[];
  hasEvCharging: boolean;
  isCovered: boolean;
  currentOccupant?: CurrentOccupantInfo | null;
  activeBooking?: ActiveBookingInfo | null;
}

export interface VehicleEntryRecord {
  id: string; // e.g. 'ENT-LK-2026-0042'
  vehicleRegNumber: string; // e.g. 'WP CAB-1234'
  vehicleType: VehicleType;
  customerName: string;
  customerPhone: string; // e.g. '077 123 4567'
  slotId: string; // e.g. 'P015'
  entryTime: string; // ISO String
  exitTime?: string | null;
  status: 'active' | 'exited';
  durationMinutes?: number;
  billableHours?: number;
  feeAmountLKR?: number;
  paymentMethod?: 'Cash' | 'Card' | 'LankaPay Online';
  paymentStatus?: 'paid' | 'pending';
  receiptNumber?: string;
  notes?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ParkingBooking {
  id: string; // e.g. 'BKG-LK-8901'
  customerName: string;
  customerPhone: string;
  vehicleRegNumber: string;
  vehicleType: VehicleType;
  slotId: string;
  arrivalDateTime: string;
  departureDateTime: string;
  estimatedHours: number;
  totalFeeLKR: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}

export interface PaymentTransaction {
  id: string; // e.g. 'TXN-LK-2026-0128'
  referenceId: string; // Entry ID or Booking ID
  vehicleRegNumber: string;
  customerName: string;
  amountLKR: number;
  paymentMethod: 'Cash' | 'Card' | 'LankaPay Online';
  status: 'Completed' | 'Refunded';
  timestamp: string;
  cashierName: string;
  slotId?: string;
}

export type UserRole = 'admin' | 'staff';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  facilityName: string;
}

export interface FacilityConfig {
  facilityName: string;
  businessRegNumber: string;
  locationAddress: string;
  contactPhone: string;
  contactEmail: string;
  rateRules: ParkingRateRules;
  currency: 'LKR';
  currencySymbol: 'Rs.';
  timezone: 'Asia/Colombo';
}
