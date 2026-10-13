import { 
  ParkingSlot, 
  VehicleEntryRecord, 
  ParkingBooking, 
  PaymentTransaction, 
  FacilityConfig, 
  VehicleType, 
  SlotStatus 
} from '../types';
import { 
  DEFAULT_RATE_RULES, 
  calculateParkingDuration, 
  calculateParkingFee 
} from '../utils/formatters';
import { validateSriLankanPhone } from '../utils/phoneValidation';

const STORAGE_KEYS = {
  SLOTS: 'smartpark_lk_slots_v1',
  ENTRIES: 'smartpark_lk_entries_v1',
  BOOKINGS: 'smartpark_lk_bookings_v1',
  TRANSACTIONS: 'smartpark_lk_transactions_v1',
  CONFIG: 'smartpark_lk_config_v1',
};

export const DEFAULT_FACILITY_CONFIG: FacilityConfig = {
  facilityName: 'SmartPark Pro - Colombo City Center Car Park',
  businessRegNumber: 'PV-109283-LK',
  locationAddress: '137 Galle Road, Kollupitiya, Colombo 03, Sri Lanka',
  contactPhone: '011 234 5678 / 077 123 4567',
  contactEmail: 'operations@smartparkpro.lk',
  rateRules: DEFAULT_RATE_RULES,
  currency: 'LKR',
  currencySymbol: 'Rs.',
  timezone: 'Asia/Colombo',
};

// Seed 120 Slots: P001 to P120
// Target distribution: 75 Available, 35 Occupied, 10 Reserved
function generateInitial120Slots(): {
  slots: ParkingSlot[];
  entries: VehicleEntryRecord[];
  bookings: ParkingBooking[];
  transactions: PaymentTransaction[];
} {
  const slots: ParkingSlot[] = [];
  const entries: VehicleEntryRecord[] = [];
  const bookings: ParkingBooking[] = [];
  const transactions: PaymentTransaction[] = [];

  const sriLankanNames = [
    'Kasun Perera', 'Dinuka Fernando', 'Shanaka Silva', 'Anura Jayasuriya',
    'Chathura Wickramasinghe', 'Nimali Senanayake', 'Mahesh Mendis', 'Ruwan Gunasekara',
    'Fathima Rameez', 'Priyantha Bandara', 'Sachintha De Silva', 'Gayan Alwis',
    'Kavinda Rajapaksha', 'Dilshan Madushanka', 'Tharindu Rathnayake', 'Hasitha Fonseka',
    'Nadeeka Samaraweera', 'Suresh Kumar', 'Mithun Cooray', 'Buddhika Abeysekara',
    'Lakmal Jayawardena', 'Pradeep Kumara', 'Roshan Dissanayake', 'Manjula Hettiarachchi',
    'Sandun Weerasinghe', 'Nipuna Gamage', 'Damith Wijesinghe', 'Asanka Karunaratne',
    'Vimukthi Ranasinghe', 'Isuru Pathirana', 'Janaka Mallawarachchi', 'Kusal Thirimanne',
    'Angelo Mathews', 'Charith Asalanka', 'Wanindu Hasaranga'
  ];

  const sriLankanPlates = [
    'WP CAB-1234', 'WP CAR-8921', 'SP BCD-4512', 'CP KA-9012', 'WP BIKE-7721',
    'WP TUK-3312', 'WP CAD-6745', 'WP KT-4412', 'WP KX-9182', 'SP CAH-2201',
    'CP BAX-8812', 'WP KU-1190', 'WP CAC-5541', 'WP CBA-7823', 'WP CAJ-9043',
    'WP KY-3341', 'SP BAA-1290', 'CP KB-6671', 'WP CBF-3109', 'WP CAG-8420',
    'WP BIKE-1029', 'WP TUK-9943', 'WP CAL-4819', 'WP CBK-7012', 'SP BB-8129',
    'WP CAM-6120', 'CP KC-4421', 'WP CBM-1920', 'WP CAN-5091', 'WP CBN-3310',
    'WP BIKE-5521', 'WP TUK-4419', 'WP CAP-8012', 'SP BBD-7712', 'WP CBR-6601'
  ];

  // Specific slot indexes for Occupied (35 slots)
  const occupiedIndices = new Set([
    2, 4, 7, 9, 11, 14, 18, 21, 23, 26, 29, 32, 35, 38,
    42, 45, 48, 51, 54, 57, 60, 63, 67, 71, 75, 78,
    82, 85, 88, 92, 96, 100, 105, 110, 115
  ]);

  // Specific slot indexes for Reserved (10 slots)
  const reservedIndices = new Set([
    5, 12, 25, 36, 49, 65, 80, 94, 108, 118
  ]);

  const now = new Date();

  for (let i = 1; i <= 120; i++) {
    const id = `P${i.toString().padStart(3, '0')}`;
    let zone = 'Zone A (Ground)';
    let floorLevel = 'Ground';

    if (i > 80) {
      zone = 'Zone C (Level 2)';
      floorLevel = 'Level 2';
    } else if (i > 40) {
      zone = 'Zone B (Level 1)';
      floorLevel = 'Level 1';
    }

    // Vehicle compatibility distribution
    let supported: VehicleType[] = ['car', 'van', 'suv'];
    if (i <= 6 || (i >= 41 && i <= 44)) {
      supported = ['motorcycle', 'three_wheeler'];
    } else if (i === 10 || i === 20 || i === 50 || i === 90) {
      supported = ['car', 'suv']; // EV priority
    } else if (i >= 30 && i <= 40) {
      supported = ['car', 'van', 'suv', 'bus'];
    }

    const hasEv = i === 10 || i === 20 || i === 50 || i === 90;
    const isCovered = floorLevel !== 'Level 2';

    let status: SlotStatus = 'available';
    let occupant: any = null;
    let activeBooking: any = null;

    if (occupiedIndices.has(i)) {
      status = 'occupied';
      const personIdx = (i * 7) % sriLankanNames.length;
      const plateIdx = (i * 5) % sriLankanPlates.length;

      const name = sriLankanNames[personIdx];
      const plate = sriLankanPlates[plateIdx];
      const phone = `077${Math.floor(1000000 + ((i * 12345) % 8999999)).toString().padStart(7, '0')}`;

      // Entry time between 30 mins to 4 hours ago
      const hoursAgo = ((i % 5) + 1) * 0.7;
      const entryTime = new Date(now.getTime() - hoursAgo * 3600 * 1000).toISOString();
      const entryId = `ENT-LK-2026-${(1000 + i).toString()}`;

      let vType: VehicleType = 'car';
      if (plate.includes('BIKE')) vType = 'motorcycle';
      else if (plate.includes('TUK')) vType = 'three_wheeler';
      else if (plate.includes('CAR') || plate.includes('CAB')) vType = 'car';
      else vType = 'van';

      occupant = {
        vehicleRegNumber: plate,
        vehicleType: vType,
        customerName: name,
        customerPhone: phone,
        entryTime,
        entryRecordId: entryId,
      };

      entries.push({
        id: entryId,
        vehicleRegNumber: plate,
        vehicleType: vType,
        customerName: name,
        customerPhone: phone,
        slotId: id,
        entryTime,
        exitTime: null,
        status: 'active',
      });
    } else if (reservedIndices.has(i)) {
      status = 'reserved';
      const bkgIdx = (i * 3) % sriLankanNames.length;
      const name = sriLankanNames[bkgIdx];
      const plate = `WP CBA-${(2000 + i).toString()}`;
      const phone = `071${Math.floor(1000000 + ((i * 54321) % 8999999)).toString().padStart(7, '0')}`;
      const bkgId = `BKG-LK-${(5000 + i).toString()}`;

      const arrivalTime = new Date(now.getTime() + (i % 4 + 1) * 3600 * 1000).toISOString();
      const departureTime = new Date(now.getTime() + (i % 4 + 5) * 3600 * 1000).toISOString();

      activeBooking = {
        bookingId: bkgId,
        customerName: name,
        vehicleRegNumber: plate,
        startTime: arrivalTime,
        endTime: departureTime,
      };

      bookings.push({
        id: bkgId,
        customerName: name,
        customerPhone: phone,
        vehicleRegNumber: plate,
        vehicleType: 'car',
        slotId: id,
        arrivalDateTime: arrivalTime,
        departureDateTime: departureTime,
        estimatedHours: 4,
        totalFeeLKR: 400,
        status: 'confirmed',
        createdAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
        notes: 'VIP reservation via SmartPark Pro Online',
      });
    }

    slots.push({
      id,
      slotNumber: i,
      zone,
      floorLevel,
      status,
      supportedVehicleTypes: supported,
      hasEvCharging: hasEv,
      isCovered,
      currentOccupant: occupant,
      activeBooking,
    });
  }

  // Generate completed historical vehicle entries & transactions today to reach ~Rs. 24,500.00
  const paymentMethods: ('Cash' | 'Card' | 'LankaPay Online')[] = ['Cash', 'Card', 'LankaPay Online'];
  let currentTotalRev = 0;

  for (let j = 1; j <= 45; j++) {
    const hours = (j % 5) + 1;
    const fee = hours * 100;
    currentTotalRev += fee;

    const exitOffset = Math.floor(j * 15 * 60 * 1000); // spread across today
    const exitTime = new Date(now.getTime() - exitOffset).toISOString();
    const entryTime = new Date(new Date(exitTime).getTime() - hours * 3600 * 1000).toISOString();

    const regNo = `WP CA-${Math.floor(1000 + j * 77)}`;
    const custName = sriLankanNames[j % sriLankanNames.length];
    const entId = `ENT-LK-2026-${(8000 + j).toString()}`;
    const txnId = `TXN-LK-2026-${(3000 + j).toString()}`;
    const method = paymentMethods[j % paymentMethods.length];

    entries.push({
      id: entId,
      vehicleRegNumber: regNo,
      vehicleType: 'car',
      customerName: custName,
      customerPhone: `077${Math.floor(1000000 + ((j * 67891) % 8999999)).toString().padStart(7, '0')}`,
      slotId: `P${((j % 80) + 1).toString().padStart(3, '0')}`,
      entryTime,
      exitTime,
      status: 'exited',
      durationMinutes: hours * 60,
      billableHours: hours,
      feeAmountLKR: fee,
      paymentMethod: method,
      paymentStatus: 'paid',
      receiptNumber: `RCPT-LK-${(9000 + j).toString()}`,
    });

    transactions.push({
      id: txnId,
      referenceId: entId,
      vehicleRegNumber: regNo,
      customerName: custName,
      amountLKR: fee,
      paymentMethod: method,
      status: 'Completed',
      timestamp: exitTime,
      cashierName: 'Gate Operator 01 (Colombo Center)',
      slotId: `P${((j % 80) + 1).toString().padStart(3, '0')}`,
    });

    if (currentTotalRev >= 24500) break;
  }

  // Adjust last transaction so exact sample today's revenue equals Rs. 24,500.00
  if (transactions.length > 0) {
    const currentSum = transactions.reduce((s, t) => s + t.amountLKR, 0);
    const diff = 24500 - currentSum;
    transactions[0].amountLKR += diff;
  }

  return { slots, entries, bookings, transactions };
}

// Local Storage Helper
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    return JSON.parse(val);
  } catch (e) {
    console.warn(`Error loading key ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving key ${key} to storage:`, e);
  }
}

export const storage = {
  // Check and initialize data
  init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.SLOTS)) {
      this.resetDemoData();
    }
  },

  getSlots(): ParkingSlot[] {
    this.init();
    return loadFromStorage(STORAGE_KEYS.SLOTS, []);
  },

  saveSlots(slots: ParkingSlot[]): void {
    saveToStorage(STORAGE_KEYS.SLOTS, slots);
  },

  getEntries(): VehicleEntryRecord[] {
    this.init();
    return loadFromStorage(STORAGE_KEYS.ENTRIES, []);
  },

  saveEntries(entries: VehicleEntryRecord[]): void {
    saveToStorage(STORAGE_KEYS.ENTRIES, entries);
  },

  getBookings(): ParkingBooking[] {
    this.init();
    return loadFromStorage(STORAGE_KEYS.BOOKINGS, []);
  },

  saveBookings(bookings: ParkingBooking[]): void {
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  },

  getTransactions(): PaymentTransaction[] {
    this.init();
    return loadFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
  },

  saveTransactions(transactions: PaymentTransaction[]): void {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  },

  getConfig(): FacilityConfig {
    return loadFromStorage(STORAGE_KEYS.CONFIG, DEFAULT_FACILITY_CONFIG);
  },

  saveConfig(config: FacilityConfig): void {
    saveToStorage(STORAGE_KEYS.CONFIG, config);
  },

  // Vehicle Entry Operation
  createVehicleEntry(params: {
    vehicleRegNumber: string;
    vehicleType: VehicleType;
    customerName: string;
    customerPhone: string;
    slotId: string;
    entryTime?: string;
    notes?: string;
  }): { entry: VehicleEntryRecord; slot: ParkingSlot } {
    const cleanReg = params.vehicleRegNumber.trim().toUpperCase();

    // Validate phone number
    const phoneVal = validateSriLankanPhone(params.customerPhone);
    if (!phoneVal.isValid) {
      throw new Error(phoneVal.errorMessage || 'Please enter all 10 digits of your phone number.');
    }
    const entries = this.getEntries();
    const slots = this.getSlots();

    // 1. Prevent duplicate active entries for the same vehicle
    const alreadyParked = entries.find(
      (e) => e.status === 'active' && e.vehicleRegNumber === cleanReg
    );
    if (alreadyParked) {
      throw new Error(
        `Vehicle ${cleanReg} is already parked in Slot ${alreadyParked.slotId}. Please complete its exit first.`
      );
    }

    // 2. Validate selected slot availability
    const slotIdx = slots.findIndex((s) => s.id === params.slotId);
    if (slotIdx === -1) {
      throw new Error(`Slot ${params.slotId} does not exist.`);
    }

    const slot = slots[slotIdx];
    if (slot.status === 'occupied') {
      throw new Error(
        `Slot ${slot.id} is already occupied by vehicle ${slot.currentOccupant?.vehicleRegNumber || 'another vehicle'}.`
      );
    }

    const entryId = `ENT-LK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const entryTime = params.entryTime || new Date().toISOString();

    const newEntry: VehicleEntryRecord = {
      id: entryId,
      vehicleRegNumber: cleanReg,
      vehicleType: params.vehicleType,
      customerName: params.customerName.trim(),
      customerPhone: params.customerPhone.trim(),
      slotId: params.slotId,
      entryTime,
      exitTime: null,
      status: 'active',
      notes: params.notes,
    };

    // Update slot status
    slot.status = 'occupied';
    slot.currentOccupant = {
      vehicleRegNumber: cleanReg,
      vehicleType: params.vehicleType,
      customerName: params.customerName.trim(),
      customerPhone: params.customerPhone.trim(),
      entryTime,
      entryRecordId: entryId,
    };

    // If slot had an active booking for this vehicle, clear or update it
    if (slot.activeBooking && slot.activeBooking.vehicleRegNumber === cleanReg) {
      slot.activeBooking = null;
    }

    slots[slotIdx] = slot;
    entries.unshift(newEntry);

    this.saveSlots(slots);
    this.saveEntries(entries);

    return { entry: newEntry, slot };
  },

  // Vehicle Exit Operation
  completeVehicleExit(params: {
    entryId: string;
    exitTime?: string;
    paymentMethod: 'Cash' | 'Card' | 'LankaPay Online';
    cashierName?: string;
  }): {
    entry: VehicleEntryRecord;
    transaction: PaymentTransaction;
    slot: ParkingSlot;
    feeBreakdown: any;
  } {
    const entries = this.getEntries();
    const slots = this.getSlots();
    const transactions = this.getTransactions();
    const config = this.getConfig();

    const entryIdx = entries.findIndex((e) => e.id === params.entryId);
    if (entryIdx === -1) {
      throw new Error('Vehicle entry record not found.');
    }

    const entry = entries[entryIdx];
    if (entry.status === 'exited') {
      throw new Error(`Vehicle ${entry.vehicleRegNumber} has already exited.`);
    }

    const exitTime = params.exitTime || new Date().toISOString();
    const duration = calculateParkingDuration(entry.entryTime, exitTime);
    const feeData = calculateParkingFee(
      duration.billableHours,
      entry.vehicleType,
      config.rateRules
    );

    const txnId = `TXN-LK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const rcptNumber = `RCPT-LK-${Math.floor(10000 + Math.random() * 90000)}`;

    entry.status = 'exited';
    entry.exitTime = exitTime;
    entry.durationMinutes = duration.totalMinutes;
    entry.billableHours = duration.billableHours;
    entry.feeAmountLKR = feeData.totalAmount;
    entry.paymentMethod = params.paymentMethod;
    entry.paymentStatus = 'paid';
    entry.receiptNumber = rcptNumber;

    // Free the parking slot
    const slotIdx = slots.findIndex((s) => s.id === entry.slotId);
    let freedSlot: ParkingSlot;

    if (slotIdx !== -1) {
      const s = slots[slotIdx];
      s.status = 'available';
      s.currentOccupant = null;
      slots[slotIdx] = s;
      freedSlot = s;
    } else {
      freedSlot = {
        id: entry.slotId,
        slotNumber: parseInt(entry.slotId.replace(/\D/g, '')) || 1,
        zone: 'Zone A',
        floorLevel: 'Ground',
        status: 'available',
        supportedVehicleTypes: ['car'],
        hasEvCharging: false,
        isCovered: true,
      };
    }

    // Create Payment Transaction
    const newTxn: PaymentTransaction = {
      id: txnId,
      referenceId: entry.id,
      vehicleRegNumber: entry.vehicleRegNumber,
      customerName: entry.customerName,
      amountLKR: feeData.totalAmount,
      paymentMethod: params.paymentMethod,
      status: 'Completed',
      timestamp: exitTime,
      cashierName: params.cashierName || 'Gate Cashier (SmartPark Pro)',
      slotId: entry.slotId,
    };

    entries[entryIdx] = entry;
    transactions.unshift(newTxn);

    this.saveEntries(entries);
    this.saveSlots(slots);
    this.saveTransactions(transactions);

    return {
      entry,
      transaction: newTxn,
      slot: freedSlot,
      feeBreakdown: feeData,
    };
  },

  // Online Booking Operation
  createBooking(params: {
    customerName: string;
    customerPhone: string;
    vehicleRegNumber: string;
    vehicleType: VehicleType;
    slotId: string;
    arrivalDateTime: string;
    departureDateTime: string;
    notes?: string;
  }): { booking: ParkingBooking; slot: ParkingSlot } {
    const cleanReg = params.vehicleRegNumber.trim().toUpperCase();

    // Validate phone number
    const phoneVal = validateSriLankanPhone(params.customerPhone);
    if (!phoneVal.isValid) {
      throw new Error(phoneVal.errorMessage || 'Please enter all 10 digits of your phone number.');
    }

    const bookings = this.getBookings();
    const slots = this.getSlots();
    const config = this.getConfig();

    const arrTime = new Date(params.arrivalDateTime).getTime();
    const depTime = new Date(params.departureDateTime).getTime();

    if (isNaN(arrTime) || isNaN(depTime) || depTime <= arrTime) {
      throw new Error('Departure date and time must be after arrival date and time.');
    }

    // Prevent overlapping bookings for the same slot
    const slotIdx = slots.findIndex((s) => s.id === params.slotId);
    if (slotIdx === -1) {
      throw new Error(`Slot ${params.slotId} not found.`);
    }

    const hasConflict = bookings.some((b) => {
      if (b.slotId !== params.slotId) return false;
      if (b.status === 'cancelled' || b.status === 'completed') return false;

      const bArr = new Date(b.arrivalDateTime).getTime();
      const bDep = new Date(b.departureDateTime).getTime();

      return arrTime < bDep && depTime > bArr;
    });

    if (hasConflict) {
      throw new Error(
        `Slot ${params.slotId} already has a confirmed reservation during this selected time window. Please pick another slot or adjust times.`
      );
    }

    const duration = calculateParkingDuration(params.arrivalDateTime, params.departureDateTime);
    const feeData = calculateParkingFee(
      duration.billableHours,
      params.vehicleType,
      config.rateRules
    );

    const bkgId = `BKG-LK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: ParkingBooking = {
      id: bkgId,
      customerName: params.customerName.trim(),
      customerPhone: params.customerPhone.trim(),
      vehicleRegNumber: cleanReg,
      vehicleType: params.vehicleType,
      slotId: params.slotId,
      arrivalDateTime: params.arrivalDateTime,
      departureDateTime: params.departureDateTime,
      estimatedHours: duration.billableHours,
      totalFeeLKR: feeData.totalAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      notes: params.notes,
    };

    // Mark slot as reserved if currently available
    const slot = slots[slotIdx];
    if (slot.status === 'available') {
      slot.status = 'reserved';
      slot.activeBooking = {
        bookingId: bkgId,
        customerName: params.customerName.trim(),
        vehicleRegNumber: cleanReg,
        startTime: params.arrivalDateTime,
        endTime: params.departureDateTime,
      };
      slots[slotIdx] = slot;
    }

    bookings.unshift(newBooking);
    this.saveBookings(bookings);
    this.saveSlots(slots);

    return { booking: newBooking, slot };
  },

  // Cancel Booking
  cancelBooking(bookingId: string): void {
    const bookings = this.getBookings();
    const slots = this.getSlots();

    const idx = bookings.findIndex((b) => b.id === bookingId);
    if (idx === -1) return;

    const bkg = bookings[idx];
    bkg.status = 'cancelled';
    bookings[idx] = bkg;

    // Release slot if marked reserved for this booking
    const slotIdx = slots.findIndex((s) => s.id === bkg.slotId);
    if (slotIdx !== -1) {
      const s = slots[slotIdx];
      if (s.status === 'reserved' && s.activeBooking?.bookingId === bookingId) {
        s.status = 'available';
        s.activeBooking = null;
        slots[slotIdx] = s;
      }
    }

    this.saveBookings(bookings);
    this.saveSlots(slots);
  },

  // Reset demo dataset
  resetDemoData(): void {
    const { slots, entries, bookings, transactions } = generateInitial120Slots();
    saveToStorage(STORAGE_KEYS.SLOTS, slots);
    saveToStorage(STORAGE_KEYS.ENTRIES, entries);
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    saveToStorage(STORAGE_KEYS.CONFIG, DEFAULT_FACILITY_CONFIG);
  },

  // Export complete facility data as JSON
  exportFacilityDataJson(): string {
    const data = {
      facilityConfig: this.getConfig(),
      slots: this.getSlots(),
      entries: this.getEntries(),
      bookings: this.getBookings(),
      transactions: this.getTransactions(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Export vehicle entries as CSV
  exportEntriesCsv(): string {
    const entries = this.getEntries();
    const headers = [
      'Record ID',
      'Vehicle Registration',
      'Vehicle Type',
      'Customer Name',
      'Phone Number',
      'Slot ID',
      'Entry Time (UTC)',
      'Exit Time (UTC)',
      'Status',
      'Duration (Mins)',
      'Billable Hours',
      'Fee Paid (LKR)',
      'Payment Method',
    ];
    const rows = entries.map((e) => [
      `"${e.id}"`,
      `"${e.vehicleRegNumber}"`,
      `"${e.vehicleType}"`,
      `"${e.customerName}"`,
      `"${e.customerPhone}"`,
      `"${e.slotId}"`,
      `"${e.entryTime}"`,
      `"${e.exitTime || ''}"`,
      `"${e.status}"`,
      e.durationMinutes ?? '',
      e.billableHours ?? '',
      e.feeAmountLKR ?? '',
      `"${e.paymentMethod || ''}"`,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },

  // Export payments ledger as CSV
  exportTransactionsCsv(): string {
    const txns = this.getTransactions();
    const headers = [
      'Transaction ID',
      'Reference ID',
      'Vehicle Plate',
      'Customer Name',
      'Slot ID',
      'Amount (LKR)',
      'Payment Method',
      'Status',
      'Timestamp (UTC)',
      'Cashier',
    ];
    const rows = txns.map((t) => [
      `"${t.id}"`,
      `"${t.referenceId}"`,
      `"${t.vehicleRegNumber}"`,
      `"${t.customerName}"`,
      `"${t.slotId || ''}"`,
      t.amountLKR,
      `"${t.paymentMethod}"`,
      `"${t.status}"`,
      `"${t.timestamp}"`,
      `"${t.cashierName}"`,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};
