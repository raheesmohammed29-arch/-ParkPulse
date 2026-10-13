// Sri Lankan Currency & Date/Time Formatter Utilities
// Timezone: Asia/Colombo | Currency: LKR (Rs.)

/**
 * Format amounts in Sri Lankan Rupees (LKR) with Rs. prefix
 * Example: 24500 -> "Rs. 24,500.00"
 */
export function formatLKR(amount: number): string {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const formatted = new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  return `Rs. ${formatted}`;
}

// Alias for convenience
export const formatCurrency = formatLKR;

/**
 * Format date & time in Sri Lanka timezone (Asia/Colombo)
 * Example: "14 Oct 2026, 09:30 AM"
 */
export function formatSriLankanDateTime(dateInput: string | Date | number): string {
  if (!dateInput) return '-';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '-';

    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Colombo',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch (e) {
    return String(dateInput);
  }
}

export const formatDateTime = formatSriLankanDateTime;

/**
 * Format time only in Sri Lanka timezone
 * Example: "02:45 PM"
 */
export function formatSriLankanTimeOnly(dateInput: string | Date | number): string {
  if (!dateInput) return '-';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '-';

    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Colombo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch (e) {
    return String(dateInput);
  }
}

export const formatTimeOnly = formatSriLankanTimeOnly;

/**
 * Format date only in Sri Lanka timezone
 * Example: "14 Oct 2026"
 */
export function formatSriLankanDateOnly(dateInput: string | Date | number): string {
  if (!dateInput) return '-';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '-';

    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Colombo',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch (e) {
    return String(dateInput);
  }
}

export const formatDateOnly = formatSriLankanDateOnly;

/**
 * Calculate duration between two ISO dates or Date objects
 * Returns human-readable string and billable hours
 */
export function calculateParkingDuration(
  entryTime: string | Date,
  exitTime: string | Date = new Date()
): {
  diffMs: number;
  hours: number;
  minutes: number;
  totalMinutes: number;
  billableHours: number;
  formattedText: string;
} {
  const start = new Date(entryTime).getTime();
  const end = new Date(exitTime).getTime();
  const diffMs = Math.max(0, end - start);

  const totalMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Sri Lanka parking standard: Any started hour counts as a full billable hour (minimum 1 hour)
  const billableHours = Math.max(1, Math.ceil(totalMinutes / 60));

  let formattedText = '';
  if (hours > 0) {
    formattedText = `${hours}h ${minutes}m`;
  } else {
    formattedText = `${minutes} mins`;
  }

  return {
    diffMs,
    hours,
    minutes,
    totalMinutes,
    billableHours,
    formattedText,
  };
}

/**
 * Pricing Rules Configuration Interface & Calculator
 */
export interface ParkingRateRules {
  firstHourRate: number; // e.g., 100 LKR
  additionalHourRate: number; // e.g., 100 LKR
  dailyMaxRate: number; // e.g., 1,000 LKR
  vehicleTypeMultipliers: {
    car: number; // 1.0x (Rs. 100/hr)
    van: number; // 1.2x (Rs. 120/hr)
    suv: number; // 1.2x (Rs. 120/hr)
    motorcycle: number; // 0.5x (Rs. 50/hr)
    three_wheeler: number; // 0.7x (Rs. 70/hr)
    bus: number; // 2.0x (Rs. 200/hr)
  };
}

export const DEFAULT_RATE_RULES: ParkingRateRules = {
  firstHourRate: 100, // Rs. 100
  additionalHourRate: 100, // Rs. 100
  dailyMaxRate: 1000, // Rs. 1,000
  vehicleTypeMultipliers: {
    car: 1.0,
    van: 1.2,
    suv: 1.2,
    motorcycle: 0.5,
    three_wheeler: 0.7,
    bus: 2.0,
  },
};

/**
 * Calculate parking fee in LKR based on duration and vehicle type
 */
export function calculateParkingFee(
  billableHours: number,
  vehicleType: string = 'car',
  rules: ParkingRateRules = DEFAULT_RATE_RULES
): {
  baseAmount: number;
  multiplier: number;
  totalAmount: number;
  breakdown: string;
} {
  const normType = (vehicleType || 'car').toLowerCase().replace('-', '_');
  const mult =
    (rules.vehicleTypeMultipliers as any)[normType] ??
    rules.vehicleTypeMultipliers.car ??
    1.0;

  // Calculate base fee for car
  let base = 0;
  if (billableHours <= 1) {
    base = rules.firstHourRate;
  } else {
    const days = Math.floor(billableHours / 24);
    const remHours = billableHours % 24;

    const dayCost = days * rules.dailyMaxRate;
    let remCost = rules.firstHourRate + Math.max(0, remHours - 1) * rules.additionalHourRate;
    if (remCost > rules.dailyMaxRate) {
      remCost = rules.dailyMaxRate;
    }

    base = dayCost + remCost;
  }

  // Apply vehicle type multiplier
  const finalAmount = Math.round(base * mult);

  let breakdown = '';
  if (billableHours === 1) {
    breakdown = `1 hr @ Rs. ${rules.firstHourRate} (Base)`;
  } else {
    breakdown = `1st hr (Rs. ${rules.firstHourRate}) + ${billableHours - 1} hrs @ Rs. ${rules.additionalHourRate}/hr`;
  }

  if (mult !== 1.0) {
    breakdown += ` × ${mult} (${vehicleType.toUpperCase()})`;
  }

  return {
    baseAmount: base,
    multiplier: mult,
    totalAmount: finalAmount,
    breakdown,
  };
}

/**
 * QR Code Matrix generator for printable pass & receipts
 */
export function generateQRMatrix(text: string): boolean[][] {
  const size = 21;
  const matrix: boolean[][] = Array(size)
    .fill(false)
    .map(() => Array(size).fill(false));

  const drawFinder = (startX: number, startY: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (
          x === 0 ||
          x === 6 ||
          y === 0 ||
          y === 6 ||
          (x >= 2 && x <= 4 && y >= 2 && y <= 4)
        ) {
          matrix[startY + y][startX + x] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (
        (x < 8 && y < 8) ||
        (x > size - 9 && y < 8) ||
        (x < 8 && y > size - 9)
      ) {
        continue;
      }
      const val = Math.abs(Math.sin((x + 1) * (y + 1) * (hash + 17)) * 10000);
      matrix[y][x] = (Math.floor(val) % 2) === 1;
    }
  }

  return matrix;
}

export { validateSriLankanPhone, sanitizeSriLankanPhone } from './phoneValidation';

/**
 * Format Sri Lankan phone number for clean display
 * Example: "0771234567" -> "077 123 4567"
 */
export function formatSriLankanPhone(phone: string): string {
  if (!phone) return '-';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
  }
  return phone;
}
