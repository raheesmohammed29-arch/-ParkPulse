import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Phone, 
  Mail, 
  Layers, 
  BarChart3, 
  Smartphone, 
  Sparkles,
  Zap,
  Calendar,
  CreditCard,
  Building2,
  Check
} from 'lucide-react';
import { formatLKR } from '../utils/formatters';
import { ParkingSlot } from '../types';

interface LandingPageProps {
  onOpenDashboard: () => void;
  onExploreSlots: () => void;
  slots: ParkingSlot[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenDashboard,
  onExploreSlots,
  slots,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const totalSlots = slots.length;
  const availableSlots = slots.filter((s) => s.status === 'available').length;
  const occupiedSlots = slots.filter((s) => s.status === 'occupied').length;
  const reservedSlots = slots.filter((s) => s.status === 'reserved').length;

  const pricingTiers = [
    {
      name: 'Basic Facility',
      tagline: 'Ideal for single parking lots, retail complexes, and small commercial garages.',
      monthlyFee: 4900,
      features: [
        'Up to 150 parking slots tracking',
        'Vehicle Entry & Exit gate operations',
        'Automated duration & LKR fee calculator',
        'Standard thermal & A4 printable receipts',
        'Daily revenue summary & cash audit',
        'Local encrypted browser persistence',
      ],
      badge: 'Starter',
      popular: false,
    },
    {
      name: 'Professional Enterprise',
      tagline: 'Built for high-traffic multi-level car parks, city malls, and hotel parking.',
      monthlyFee: 9900,
      features: [
        'Up to 500 parking slots with multi-zone layouts',
        'Online advance bookings with overlap protection',
        'Automated Sri Lankan vehicle plate recognition (ANPR)',
        'LankaPay Online, Card & Cash payment receipts',
        'Peak hours analytics & CSV financial exports',
        'Configurable vehicle fee multipliers (Car, Van, Tuk, Bike)',
        'Priority 24/7 Sri Lanka technical support',
      ],
      badge: 'Most Popular in LK',
      popular: true,
    },
    {
      name: 'Multi-Facility Commercial',
      tagline: 'Tailored for airport terminals, hospital networks, and municipal council car parks.',
      monthlyFee: null, // Custom
      features: [
        'Unlimited parking bays across multiple Sri Lankan branches',
        'Automated boom barrier IoT hardware integration',
        'Custom corporate invoicing & VAT/SSCL tax compliance',
        'Centralized Colombo command center telemetry',
        'Dedicated account manager & on-site staff training',
        'Custom SLA guarantee & cloud synchronization',
      ],
      badge: 'Custom Enterprise',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 selection:bg-[#3B82F6] selection:text-white">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#0B1220]/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenDashboard}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#3B82F6] via-[#111C35] to-[#22D3EE] p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#0B1220] rounded-[14px] flex items-center justify-center">
                <Car className="w-6 h-6 text-[#22D3EE]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">SmartPark</span>
                <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#3B82F6] text-white rounded">
                  PRO
                </span>
                <span className="text-[10px] text-cyan-400 font-bold ml-1">🇱🇰 Sri Lanka</span>
              </div>
              <p className="text-[11px] text-slate-400">Intelligent Parking Operations</p>
            </div>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#facility-status" className="hover:text-white transition-colors">120 Slots Live</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">LKR Pricing</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExploreSlots}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 transition-all"
            >
              <span>120 Slots Map</span>
            </button>
            <button
              onClick={onOpenDashboard}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide mb-8 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sri Lanka's Next-Generation Commercial Parking Solution</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Parking Smarter.{' '}
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#22D3EE] to-white bg-clip-text text-transparent">
              Operating Better.
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Eliminate congestion, track 120 slots in real-time, automate vehicle entry & exit billing in Sri Lankan Rupees (LKR), and boost facility revenue with zero overbooking.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenDashboard}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-base shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onClick={onExploreSlots}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#111C35] hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all"
            >
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Explore 120 Parking Slots</span>
            </button>
          </div>

          {/* Live Telemetry Bar */}
          <div className="mt-14 max-w-4xl mx-auto bg-[#111C35]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                  Colombo City Center Facility Live Telemetry
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  137 Galle Road, Colombo 03
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-[#0B1220] px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Timezone: Asia/Colombo</span>
              </div>
            </div>

            {/* 4 Stats Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-left">
              <div className="bg-[#0B1220] p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">Total Capacity</span>
                <span className="text-3xl font-black text-white mt-1 block">{totalSlots}</span>
                <span className="text-[11px] text-slate-500 font-mono">Slots P001 - P120</span>
              </div>

              <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30">
                <span className="text-xs text-emerald-400 block font-medium">Available (Green)</span>
                <span className="text-3xl font-black text-emerald-300 mt-1 block">{availableSlots}</span>
                <span className="text-[11px] text-emerald-400/80 font-mono">Ready for entry</span>
              </div>

              <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-500/30">
                <span className="text-xs text-rose-400 block font-medium">Occupied (Red)</span>
                <span className="text-3xl font-black text-rose-300 mt-1 block">{occupiedSlots}</span>
                <span className="text-[11px] text-rose-400/80 font-mono">Actively parked</span>
              </div>

              <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-500/30">
                <span className="text-xs text-amber-400 block font-medium">Reserved (Yellow)</span>
                <span className="text-3xl font-black text-amber-300 mt-1 block">{reservedSlots}</span>
                <span className="text-[11px] text-amber-400/80 font-mono">Advance bookings</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE MODULE FEATURES */}
      <section id="features" className="py-24 bg-[#111C35]/50 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">Engine Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Everything Your Sri Lankan Parking Facility Demands
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Built ground-up with Sri Lankan vehicle categories, standard license plate recognition, and strict LKR billing logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#0B1220] border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-[#22D3EE] border border-blue-500/30 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">120 Slot Visual Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Color-coded floor layout from P001 to P120 across Ground, Level 1, and Level 2. Instant visual identification of available, occupied, and reserved bays.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#0B1220] border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-[#22D3EE] border border-cyan-500/30 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Vehicle Entry & Exit Gate</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Record Sri Lankan plates (e.g. WP CAB-1234). Automatic duration calculation in hours & minutes, and duplicate entry blocking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0B1220] border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Online Advance Bookings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customers book specific bays ahead of time. Automated overlap guard ensures two drivers never reserve the same bay during overlapping intervals.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#0B1220] border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">LKR Billing & Printable Receipts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configurable Sri Lankan rates (Rs. 100 1st hour, Rs. 100 subsequent, Rs. 1,000 daily max). Printable thermal receipts with transaction QR codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Streamlined Process</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">How SmartPark Pro Operates</h2>
          <p className="text-slate-400 text-sm mt-3">
            Effortless gate operations designed for Sri Lankan parking attendants and automated barriers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#111C35] border border-slate-800 rounded-3xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-lg font-black mx-auto">
              1
            </div>
            <h4 className="font-bold text-white text-base">Vehicle Arrival</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Driver arrives at gate. Staff records plate number & vehicle category (Car, Van, Three-Wheeler, Motorbike).
            </p>
          </div>

          <div className="bg-[#111C35] border border-slate-800 rounded-3xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-lg font-black mx-auto">
              2
            </div>
            <h4 className="font-bold text-white text-base">Slot Assignment</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              System assigns an available slot (P001 - P120) or confirms an online reservation pass. Slot turns Red (Occupied).
            </p>
          </div>

          <div className="bg-[#111C35] border border-slate-800 rounded-3xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-lg font-black mx-auto">
              3
            </div>
            <h4 className="font-bold text-white text-base">Automated LKR Fee</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upon exit, system automatically calculates exact duration and fee in Rs. based on configured parking rules.
            </p>
          </div>

          <div className="bg-[#111C35] border border-slate-800 rounded-3xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-lg font-black mx-auto">
              4
            </div>
            <h4 className="font-bold text-white text-base">Receipt & Slot Release</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Driver pays via Cash, Card, or LankaPay. Instant receipt is generated, and slot immediately becomes Green (Available).
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRICING PLANS IN SRI LANKAN RUPEES (LKR) */}
      <section id="pricing" className="py-24 bg-[#111C35]/50 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">Software Subscription</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Transparent SaaS Plans in Sri Lankan Rupees</h2>
            <p className="text-slate-400 text-sm mt-3">
              Straightforward pricing tailored for local parking operators, malls, and commercial properties.
            </p>
            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
              Proposed demo subscription rates for market demonstration &bull; Not actual offers
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`bg-[#0B1220] rounded-3xl p-8 flex flex-col justify-between relative transition-all ${
                  tier.popular
                    ? 'border-2 border-[#3B82F6] shadow-2xl shadow-blue-500/20 ring-4 ring-blue-500/20'
                    : 'border border-slate-800 hover:border-slate-700'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 uppercase tracking-wider shadow-md">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 min-h-[36px]">{tier.tagline}</p>

                  <div className="mt-6 mb-8 flex items-baseline gap-2">
                    {tier.monthlyFee ? (
                      <>
                        <span className="text-3xl sm:text-4xl font-black text-white">
                          {formatLKR(tier.monthlyFee)}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">/ month</span>
                      </>
                    ) : (
                      <span className="text-3xl font-black text-cyan-400">Custom Quote</span>
                    )}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={onOpenDashboard}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                      tier.popular
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 font-black shadow-lg shadow-blue-500/25 hover:scale-[1.01]'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    Select Plan & Explore Demo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Colombo Operations Hub</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Ready to Modernize Your Parking Business?</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Whether you manage a 50-car commercial garage in Pettah, a hospital parking area in Kandy, or an enterprise multi-level mall in Colombo, our local implementation team is ready to assist.
            </p>

            <div className="space-y-4 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Main Facility & Operations</p>
                  <p className="font-bold text-white">137 Galle Road, Kollupitiya, Colombo 03, Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Direct Support Hotline</p>
                  <p className="font-bold text-white">011 234 5678 / 077 123 4567 (Demo Numbers)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Business Inquiries</p>
                  <p className="font-bold text-white">contact@smartparkpro.lk</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Launch Card */}
          <div className="bg-[#111C35] border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#22D3EE] p-0.5 mx-auto">
              <div className="w-full h-full bg-[#0B1220] rounded-[14px] flex items-center justify-center">
                <Building2 className="w-8 h-8 text-[#22D3EE]" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Experience the Live Prototype</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                Test the 120 slots interactive map, process sample Sri Lankan vehicle entries and exits, and test real-time LKR fee calculations.
              </p>
            </div>

            <button
              onClick={onOpenDashboard}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>Launch SmartPark Pro Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-8 bg-[#0B1220] border-t border-slate-900 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">SmartPark Pro (Pvt) Ltd</span>
            <span>&copy; {new Date().getFullYear()} Colombo, Sri Lanka. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Currency: LKR (Rs.)</span>
            <span className="text-slate-400">Timezone: Asia/Colombo</span>
            <button onClick={onOpenDashboard} className="text-cyan-400 hover:underline">
              Operator Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
