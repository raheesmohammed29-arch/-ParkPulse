import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Globe, 
  Car, 
  Plus, 
  LogOut, 
  RotateCcw, 
  X,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { FacilityConfig } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLanding: () => void;
  onOpenEntryModal: () => void;
  onOpenExitModal: () => void;
  onResetData: () => void;
  activeEntriesCount: number;
  confirmedBookingsCount: number;
  availableSlotsCount: number;
  totalSlotsCount: number;
  config: FacilityConfig;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLanding,
  onOpenEntryModal,
  onOpenExitModal,
  onResetData,
  activeEntriesCount,
  confirmedBookingsCount,
  availableSlotsCount,
  totalSlotsCount,
  config,
  mobileOpen,
  setMobileOpen,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Facility Dashboard', icon: LayoutDashboard },
    { id: 'slots', label: '120 Slots Visual Grid', icon: Layers, badge: totalSlotsCount },
    { id: 'gate', label: 'Gate Operations', icon: ShieldCheck, badge: activeEntriesCount },
    { id: 'bookings', label: 'Online Bookings', icon: Calendar, badge: confirmedBookingsCount },
    { id: 'payments', label: 'Payments & Receipts', icon: CreditCard },
    { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Tariff & Facility', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const occupancyRate = totalSlotsCount > 0
    ? Math.round(((totalSlotsCount - availableSlotsCount) / totalSlotsCount) * 100)
    : 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B1220] border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B82F6] via-[#111C35] to-[#22D3EE] p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#0B1220] rounded-[14px] flex items-center justify-center">
                <Car className="w-5 h-5 text-[#22D3EE]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">SmartPark</span>
                <span className="px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-[#3B82F6] text-white rounded">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                <span>🇱🇰 Sri Lanka Hub</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Gate Action Buttons */}
        <div className="px-5 pt-4 pb-2 space-y-2">
          <button
            onClick={() => {
              onOpenEntryModal();
              setMobileOpen(false);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Vehicle Entry</span>
          </button>

          <button
            onClick={() => {
              onOpenExitModal();
              setMobileOpen(false);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-black text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>Process Vehicle Exit</span>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-3 overflow-y-auto space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
            Operations Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-blue-500/30 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Facility Status & Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#070C16] space-y-3">
          {/* Occupancy Mini Gauge */}
          <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400">Occupancy Rate</span>
              <span className="text-cyan-400">{occupancyRate}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1.5">
              <div
                style={{ width: `${occupancyRate}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
              <span className="text-emerald-400 font-semibold">{availableSlotsCount} Free</span>
              <span className="text-slate-500">120 Total Bays</span>
            </div>
          </div>

          {/* Public Landing Link & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLanding}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Public Site</span>
            </button>

            <button
              onClick={onResetData}
              title="Reset Demo Dataset"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[10px] text-slate-500 text-center font-mono">
            {config.timezone} &bull; LKR (Rs.)
          </div>
        </div>
      </aside>
    </>
  );
};
