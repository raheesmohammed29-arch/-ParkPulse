import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SlotsView } from './components/SlotsView';
import { GateOperationsView } from './components/GateOperationsView';
import { BookingsView } from './components/BookingsView';
import { PaymentsView } from './components/PaymentsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { VehicleEntryModal } from './components/VehicleEntryModal';
import { VehicleExitModal } from './components/VehicleExitModal';
import { ReceiptModal } from './components/ReceiptModal';
import { storage } from './services/storage';
import { 
  ParkingSlot, 
  VehicleEntryRecord, 
  ParkingBooking, 
  PaymentTransaction, 
  FacilityConfig, 
  VehicleType 
} from './types';
import { 
  formatSriLankanDateTime, 
  formatSriLankanTimeOnly, 
  calculateParkingDuration 
} from './utils/formatters';
import { 
  Menu, 
  Car, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Clock, 
  Plus, 
  LogOut, 
  Calendar,
  Layers,
  MapPin,
  Bell
} from 'lucide-react';

export default function App() {
  // Main View: Landing Page vs Application Workspace
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('app');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Storage Data States
  const [slots, setSlots] = useState<ParkingSlot[]>(() => storage.getSlots());
  const [entries, setEntries] = useState<VehicleEntryRecord[]>(() => storage.getEntries());
  const [bookings, setBookings] = useState<ParkingBooking[]>(() => storage.getBookings());
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => storage.getTransactions());
  const [config, setConfig] = useState<FacilityConfig>(() => storage.getConfig());

  // UI Modal States
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [preselectedSlotId, setPreselectedSlotId] = useState<string | undefined>(undefined);
  const [preselectedEntryId, setPreselectedEntryId] = useState<string | undefined>(undefined);
  const [receiptData, setReceiptData] = useState<any | null>(null);

  // Live Sri Lanka Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Toast Notification State
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Reload all storage items into state
  const reloadFromStorage = useCallback(() => {
    setSlots(storage.getSlots());
    setEntries(storage.getEntries());
    setBookings(storage.getBookings());
    setTransactions(storage.getTransactions());
    setConfig(storage.getConfig());
  }, []);

  // View Navigation Handlers
  const handleEnterApp = (targetTab: string = 'dashboard') => {
    setActiveTab(targetTab);
    setCurrentView('app');
  };

  const handleOpenLanding = () => {
    setCurrentView('landing');
  };

  // Entry Modal
  const handleOpenEntryModal = (slotId?: string) => {
    setPreselectedSlotId(slotId);
    setIsEntryModalOpen(true);
  };

  // Exit Modal
  const handleOpenExitModal = (entryId?: string) => {
    setPreselectedEntryId(entryId);
    setIsExitModalOpen(true);
  };

  // Booking Modal / Tab
  const handleOpenBookingModal = (slotId?: string) => {
    setPreselectedSlotId(slotId);
    setActiveTab('bookings');
  };

  // ==========================================
  // OPERATIONAL ACTIONS (with validation & persistence)
  // ==========================================

  // 1. Check-In New Vehicle
  const handleConfirmEntry = (data: {
    vehicleRegNumber: string;
    vehicleType: VehicleType;
    customerName: string;
    customerPhone: string;
    slotId: string;
    entryTime?: string;
    notes?: string;
  }) => {
    try {
      const res = storage.createVehicleEntry(data);
      reloadFromStorage();
      setIsEntryModalOpen(false);
      setPreselectedSlotId(undefined);
      showToast(
        'success',
        `Vehicle ${res.entry.vehicleRegNumber} successfully checked in to Slot ${res.slot.id}.`
      );
    } catch (err: any) {
      showToast('error', err.message || 'Failed to check in vehicle.');
    }
  };

  // 2. Process Vehicle Exit & Issue Receipt
  const handleConfirmExit = (params: {
    entryId: string;
    exitTime?: string;
    paymentMethod: 'Cash' | 'Card' | 'LankaPay Online';
  }) => {
    try {
      const res = storage.completeVehicleExit(params);
      reloadFromStorage();
      setIsExitModalOpen(false);
      setPreselectedEntryId(undefined);

      // Open printable receipt modal immediately
      const duration = calculateParkingDuration(res.entry.entryTime, res.entry.exitTime || new Date());
      setReceiptData({
        receiptNumber: res.entry.receiptNumber || `RCPT-LK-${Math.floor(10000 + Math.random() * 90000)}`,
        transactionId: res.transaction.id,
        vehicleRegNumber: res.entry.vehicleRegNumber,
        vehicleType: res.entry.vehicleType,
        customerName: res.entry.customerName,
        customerPhone: res.entry.customerPhone,
        slotId: res.entry.slotId,
        entryTime: res.entry.entryTime,
        exitTime: res.entry.exitTime || new Date().toISOString(),
        durationText: duration.formattedText,
        billableHours: duration.billableHours,
        amountLKR: res.transaction.amountLKR,
        paymentMethod: res.transaction.paymentMethod,
        facilityName: config.facilityName,
        facilityAddress: config.locationAddress,
      });

      showToast(
        'success',
        `Vehicle ${res.entry.vehicleRegNumber} exited. Settled Rs. ${res.transaction.amountLKR.toLocaleString()} via ${res.transaction.paymentMethod}.`
      );
    } catch (err: any) {
      showToast('error', err.message || 'Failed to process vehicle exit.');
    }
  };

  // 3. Online Advance Booking
  const handleCreateBooking = (params: {
    customerName: string;
    customerPhone: string;
    vehicleRegNumber: string;
    vehicleType: VehicleType;
    slotId: string;
    arrivalDateTime: string;
    departureDateTime: string;
    notes?: string;
  }) => {
    try {
      const res = storage.createBooking(params);
      reloadFromStorage();
      showToast(
        'success',
        `Booking ${res.booking.id} confirmed for slot ${res.booking.slotId} (${res.booking.vehicleRegNumber}).`
      );
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create booking reservation.');
    }
  };

  // 4. Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    try {
      storage.cancelBooking(bookingId);
      reloadFromStorage();
      showToast('info', `Booking reservation ${bookingId} has been cancelled.`);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to cancel booking.');
    }
  };

  // 5. Check-In Pre-Booked Customer
  const handleCheckInBooking = (booking: ParkingBooking) => {
    try {
      const res = storage.createVehicleEntry({
        vehicleRegNumber: booking.vehicleRegNumber,
        vehicleType: booking.vehicleType,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        slotId: booking.slotId,
        notes: `Checked in from Online Booking ${booking.id}`,
      });
      // Update booking to completed
      const allBookings = storage.getBookings();
      const bIdx = allBookings.findIndex((b) => b.id === booking.id);
      if (bIdx !== -1) {
        allBookings[bIdx].status = 'completed';
        storage.saveBookings(allBookings);
      }
      reloadFromStorage();
      showToast(
        'success',
        `Pre-booked vehicle ${booking.vehicleRegNumber} checked in to Slot ${booking.slotId}.`
      );
    } catch (err: any) {
      showToast('error', err.message || 'Check-in failed.');
    }
  };

  // 6. Save Facility Tariff Config
  const handleSaveConfig = (newConfig: FacilityConfig) => {
    storage.saveConfig(newConfig);
    setConfig(newConfig);
    showToast('success', 'Facility and tariff settings updated.');
  };

  // 7. Reset Benchmark Demo Dataset (120 slots: 75 Available, 35 Occupied, 10 Reserved)
  const handleResetDemoData = () => {
    if (window.confirm('Reset facility data to standard commercial demo benchmark (120 slots, Rs. 24,500.00 today revenue)?')) {
      storage.resetDemoData();
      reloadFromStorage();
      showToast('success', 'Reset complete: 120 slots loaded (75 Available, 35 Occupied, 10 Reserved).');
    }
  };

  // 8. Data Exports
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(storage.exportFacilityDataJson());
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `smartpark_lk_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('success', 'Full facility JSON downloaded.');
  };

  const handleExportEntriesCsv = () => {
    const csvStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(storage.exportEntriesCsv());
    const a = document.createElement('a');
    a.href = csvStr;
    a.download = `smartpark_vehicle_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('success', 'Vehicle check-in log CSV downloaded.');
  };

  const handleExportTransactionsCsv = () => {
    const csvStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(storage.exportTransactionsCsv());
    const a = document.createElement('a');
    a.href = csvStr;
    a.download = `smartpark_revenue_ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('success', 'Revenue transactions CSV downloaded.');
  };

  const availableSlotsList = slots.filter((s) => s.status === 'available');
  const activeEntriesList = entries.filter((e) => e.status === 'active');
  const confirmedBookingsList = bookings.filter((b) => b.status === 'confirmed');

  // IF CURRENT VIEW IS PUBLIC MARKETING LANDING PAGE
  if (currentView === 'landing') {
    return (
      <LandingPage
        onOpenDashboard={() => handleEnterApp('dashboard')}
        onExploreSlots={() => handleEnterApp('slots')}
        slots={slots}
      />
    );
  }

  // COMMERCIAL FACILITY OPERATIONAL WORKSPACE
  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-800 flex font-sans selection:bg-[#3B82F6] selection:text-white">
      {/* Toast Alert Notification */}
      {toast && (
        <div className="fixed top-6 right-4 sm:right-8 z-50 animate-in slide-in-from-top duration-300 max-w-md">
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border text-xs sm:text-sm font-semibold backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40'
                : toast.type === 'error'
                ? 'bg-slate-900/95 border-rose-500/50 text-rose-300 shadow-rose-950/40'
                : 'bg-slate-900/95 border-blue-500/50 text-blue-300 shadow-blue-950/40'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLanding={handleOpenLanding}
        onOpenEntryModal={() => handleOpenEntryModal()}
        onOpenExitModal={() => handleOpenExitModal()}
        onResetData={handleResetDemoData}
        activeEntriesCount={activeEntriesList.length}
        confirmedBookingsCount={confirmedBookingsList.length}
        availableSlotsCount={availableSlotsList.length}
        totalSlotsCount={slots.length}
        config={config}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-[#0B1220] tracking-tight">
                  {config.facilityName}
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                  Colombo 03
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Reg: {config.businessRegNumber} &bull; Hotline: {config.contactPhone.split('/')[0]}
              </p>
            </div>
          </div>

          {/* Right Header Status Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Sri Lanka Clock & Timezone Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <Clock className="w-4 h-4 text-cyan-600" />
              <div className="text-right">
                <span className="font-mono font-bold text-slate-800 block leading-tight">
                  {formatSriLankanTimeOnly(currentTime)}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight">
                  Asia/Colombo (LKR)
                </span>
              </div>
            </div>

            {/* Quick Header Entry Action */}
            <button
              onClick={() => handleOpenEntryModal()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Vehicle Entry</span>
              <span className="sm:hidden">Entry</span>
            </button>

            {/* Quick Header Exit Action */}
            <button
              onClick={() => handleOpenExitModal()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-black text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Vehicle Exit</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </header>

        {/* View Routing */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              slots={slots}
              entries={entries}
              bookings={bookings}
              transactions={transactions}
              onOpenEntryModal={() => handleOpenEntryModal()}
              onOpenExitModal={() => handleOpenExitModal()}
              onOpenBookingModal={() => handleOpenBookingModal()}
              onNavigateToSlots={() => setActiveTab('slots')}
              onNavigateToReports={() => setActiveTab('analytics')}
            />
          )}

          {activeTab === 'slots' && (
            <SlotsView
              slots={slots}
              onSelectSlotForEntry={(slotId) => handleOpenEntryModal(slotId)}
              onSelectSlotForExit={(slotId) => {
                const parkedEntry = entries.find((e) => e.status === 'active' && e.slotId === slotId);
                handleOpenExitModal(parkedEntry?.id);
              }}
              onSelectSlotForBooking={(slotId) => handleOpenBookingModal(slotId)}
            />
          )}

          {activeTab === 'gate' && (
            <GateOperationsView
              entries={entries}
              slots={slots}
              config={config}
              onOpenEntryModal={() => handleOpenEntryModal()}
              onOpenExitModal={(entryId) => handleOpenExitModal(entryId)}
              onOpenReceipt={(rcpt) => setReceiptData(rcpt)}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsView
              bookings={bookings}
              slots={slots}
              config={config}
              preselectedSlotId={preselectedSlotId}
              onCreateBooking={handleCreateBooking}
              onCancelBooking={handleCancelBooking}
              onCheckInBooking={handleCheckInBooking}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsView
              transactions={transactions}
              entries={entries}
              onOpenReceipt={(rcpt) => setReceiptData(rcpt)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              transactions={transactions}
              entries={entries}
              slots={slots}
              config={config}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              config={config}
              onSaveConfig={handleSaveConfig}
              onResetDemoData={handleResetDemoData}
              onExportJson={handleExportJson}
              onExportEntriesCsv={handleExportEntriesCsv}
              onExportTransactionsCsv={handleExportTransactionsCsv}
            />
          )}
        </main>
      </div>

      {/* Vehicle Entry Modal */}
      <VehicleEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => {
          setIsEntryModalOpen(false);
          setPreselectedSlotId(undefined);
        }}
        availableSlots={availableSlotsList}
        preselectedSlotId={preselectedSlotId}
        onConfirmEntry={handleConfirmEntry}
      />

      {/* Vehicle Exit Modal */}
      <VehicleExitModal
        isOpen={isExitModalOpen}
        onClose={() => {
          setIsExitModalOpen(false);
          setPreselectedEntryId(undefined);
        }}
        activeEntries={activeEntriesList}
        preselectedEntryId={preselectedEntryId}
        config={config}
        onConfirmExit={handleConfirmExit}
      />

      {/* Printable Receipt Modal with Thermal Layout and QR Matrix */}
      <ReceiptModal
        isOpen={Boolean(receiptData)}
        onClose={() => setReceiptData(null)}
        receiptData={receiptData}
      />
    </div>
  );
}
