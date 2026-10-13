import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  DollarSign, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  RotateCcw, 
  Download, 
  Check, 
  ShieldCheck, 
  AlertTriangle,
  Car,
  FileSpreadsheet,
  Globe
} from 'lucide-react';
import { FacilityConfig } from '../types';
import { formatLKR } from '../utils/formatters';

interface SettingsViewProps {
  config: FacilityConfig;
  onSaveConfig: (newConfig: FacilityConfig) => void;
  onResetDemoData: () => void;
  onExportJson: () => void;
  onExportEntriesCsv: () => void;
  onExportTransactionsCsv: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  onSaveConfig,
  onResetDemoData,
  onExportJson,
  onExportEntriesCsv,
  onExportTransactionsCsv,
}) => {
  const [facilityName, setFacilityName] = useState(config.facilityName);
  const [businessReg, setBusinessReg] = useState(config.businessRegNumber);
  const [address, setAddress] = useState(config.locationAddress);
  const [phone, setPhone] = useState(config.contactPhone);
  const [email, setEmail] = useState(config.contactEmail);

  // Rate Rules
  const [firstHourRate, setFirstHourRate] = useState(config.rateRules.firstHourRate);
  const [addHourRate, setAddHourRate] = useState(config.rateRules.additionalHourRate);
  const [dailyMax, setDailyMax] = useState(config.rateRules.dailyMaxRate);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FacilityConfig = {
      ...config,
      facilityName,
      businessRegNumber: businessReg,
      locationAddress: address,
      contactPhone: phone,
      contactEmail: email,
      rateRules: {
        ...config.rateRules,
        firstHourRate: Number(firstHourRate) || 100,
        additionalHourRate: Number(addHourRate) || 100,
        dailyMaxRate: Number(dailyMax) || 1000,
      },
    };
    onSaveConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1220] tracking-tight">
              Facility & Tariff Configuration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Sri Lanka
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage Colombo commercial parking tariffs, regional currency rules, and data operations.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Configuration Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 2. FACILITY IDENTITY & SRI LANKAN REGISTRATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0B1220]">Facility Identification & Details</h2>
              <p className="text-xs text-slate-500">Printed on official cashier gate receipts and booking passes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Facility Commercial Name
              </label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Business Registration (Sri Lanka PV Number)
              </label>
              <input
                type="text"
                value={businessReg}
                onChange={(e) => setBusinessReg(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Physical Location Address (Colombo)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Support Hotline / Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Operations Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                required
              />
            </div>
          </div>
        </div>

        {/* 3. PARKING TARIFF & LKR HOURLY RATES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0B1220]">Sri Lankan Rupee (LKR) Parking Tariffs</h2>
              <p className="text-xs text-slate-500">Automated calculation logic applied during vehicle exit barrier operations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                First Hour Base Rate (LKR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs.</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={firstHourRate}
                  onChange={(e) => setFirstHourRate(Number(e.target.value))}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Default: Rs. 100.00</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Additional Hour Rate (LKR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs.</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={addHourRate}
                  onChange={(e) => setAddHourRate(Number(e.target.value))}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Every additional hour started</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                24-Hour Maximum Cap (LKR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs.</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={dailyMax}
                  onChange={(e) => setDailyMax(Number(e.target.value))}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Default: Rs. 1,000.00 / day</span>
            </div>
          </div>

          {/* Category multipliers guide */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Vehicle Category Multipliers Applied:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">Car: 1.0x</span>
                <span className="text-slate-500 text-[11px]">Rs. {firstHourRate}/hr</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">Van / SUV: 1.2x</span>
                <span className="text-slate-500 text-[11px]">Rs. {Math.round(firstHourRate * 1.2)}/hr</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">Three Wheeler: 0.7x</span>
                <span className="text-slate-500 text-[11px]">Rs. {Math.round(firstHourRate * 0.7)}/hr</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">Motorcycle: 0.5x</span>
                <span className="text-slate-500 text-[11px]">Rs. {Math.round(firstHourRate * 0.5)}/hr</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">Bus: 2.0x</span>
                <span className="text-slate-500 text-[11px]">Rs. {Math.round(firstHourRate * 2.0)}/hr</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-emerald-700 block">Grace Period</span>
                <span className="text-slate-500 text-[11px]">First 15 mins free</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              Save Tariff & Facility Settings
            </button>
          </div>
        </div>
      </form>

      {/* 4. DATA MANAGEMENT & DEMO RESTORATION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#0B1220]">Data Export & Demo Reset</h2>
            <p className="text-xs text-slate-500">Backup live operations data or reset back to clean demo benchmark.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={onExportJson}
            className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-white text-left transition-all group"
          >
            <Download className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-slate-900 block">Export Workspace (JSON)</span>
            <span className="text-[11px] text-slate-500">Download complete facility state and bay layouts</span>
          </button>

          <button
            onClick={onExportEntriesCsv}
            className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-white text-left transition-all group"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-slate-900 block">Export Vehicle Log (CSV)</span>
            <span className="text-[11px] text-slate-500">Download all check-in & check-out records</span>
          </button>

          <button
            onClick={onExportTransactionsCsv}
            className="p-4 rounded-2xl border border-slate-200 hover:border-cyan-400 bg-slate-50 hover:bg-white text-left transition-all group"
          >
            <FileSpreadsheet className="w-5 h-5 text-cyan-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-slate-900 block">Export Revenue Ledger (CSV)</span>
            <span className="text-[11px] text-slate-500">Download all settled LKR payments & receipts</span>
          </button>
        </div>

        {/* Reset Warning Box */}
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-xs text-amber-900 block">
                Reset Demo Benchmark Dataset
              </span>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Restores the facility to the initial commercial benchmark of 120 slots (75 Available, 35 Occupied, 10 Reserved) and Rs. 24,500.00 today revenue.
              </p>
            </div>
          </div>

          <button
            onClick={onResetDemoData}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors shrink-0"
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
