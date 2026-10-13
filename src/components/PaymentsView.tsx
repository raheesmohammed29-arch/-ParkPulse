import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  Printer, 
  Download, 
  DollarSign, 
  Clock, 
  Car, 
  CheckCircle2, 
  Filter, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PaymentTransaction, VehicleEntryRecord } from '../types';
import { formatLKR, formatSriLankanDateTime } from '../utils/formatters';

interface PaymentsViewProps {
  transactions: PaymentTransaction[];
  entries: VehicleEntryRecord[];
  onOpenReceipt: (receiptData: any) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  transactions,
  entries,
  onOpenReceipt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (methodFilter !== 'all' && t.paymentMethod !== methodFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesPlate = t.vehicleRegNumber.toLowerCase().includes(q);
        const matchesId = t.id.toLowerCase().includes(q);
        const matchesName = t.customerName.toLowerCase().includes(q);
        if (!matchesPlate && !matchesId && !matchesName) return false;
      }
      return true;
    });
  }, [transactions, methodFilter, searchQuery]);

  const totalCollected = transactions.reduce((sum, t) => sum + t.amountLKR, 0);
  const cashTotal = transactions.filter((t) => t.paymentMethod === 'Cash').reduce((sum, t) => sum + t.amountLKR, 0);
  const cardTotal = transactions.filter((t) => t.paymentMethod === 'Card').reduce((sum, t) => sum + t.amountLKR, 0);
  const lankaPayTotal = transactions.filter((t) => t.paymentMethod === 'LankaPay Online').reduce((sum, t) => sum + t.amountLKR, 0);

  const handlePrintTransaction = (txn: PaymentTransaction) => {
    const linkedEntry = entries.find((e) => e.id === txn.referenceId);

    onOpenReceipt({
      receiptNumber: `RCPT-LK-${txn.id.replace(/\D/g, '').slice(-5)}`,
      transactionId: txn.id,
      vehicleRegNumber: txn.vehicleRegNumber,
      vehicleType: linkedEntry?.vehicleType || 'car',
      customerName: txn.customerName,
      customerPhone: linkedEntry?.customerPhone || '077 123 4567',
      slotId: txn.slotId || linkedEntry?.slotId || 'P010',
      entryTime: linkedEntry?.entryTime || new Date(new Date(txn.timestamp).getTime() - 2 * 3600 * 1000).toISOString(),
      exitTime: txn.timestamp,
      durationText: linkedEntry ? `${linkedEntry.billableHours || 2} Hours` : '2 Hours',
      billableHours: linkedEntry?.billableHours || 2,
      amountLKR: txn.amountLKR,
      paymentMethod: txn.paymentMethod,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1220] tracking-tight">
              Payments & Receipt Ledger (LKR)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Sri Lankan Rupees
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete transaction history with Cash, Card, and LankaPay settlements.
          </p>
        </div>
      </div>

      {/* KPI Revenue Summary Cards in LKR */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0B1220] rounded-2xl p-5 text-white shadow-md">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
            Total Revenue Today
          </span>
          <p className="text-2xl font-black text-white mt-1 font-mono">
            {formatLKR(totalCollected)}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {transactions.length} Total Settle Transactions
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Cash Collections
          </span>
          <p className="text-xl font-black text-slate-900 mt-1 font-mono">
            {formatLKR(cashTotal)}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Physical Drawer</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Card POS Machines
          </span>
          <p className="text-xl font-black text-slate-900 mt-1 font-mono">
            {formatLKR(cardTotal)}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Visa / Mastercard LK</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            LankaPay QR / Online
          </span>
          <p className="text-xl font-black text-slate-900 mt-1 font-mono">
            {formatLKR(lankaPayTotal)}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Instant Digital Settled</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transaction ID, plate, or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold">Payment Channel:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700"
          >
            <option value="all">All Channels</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="LankaPay Online">LankaPay Online</option>
          </select>
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Vehicle Reg No</th>
                <th className="py-3 px-4">Allocated Bay</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Timestamp (Asia/Colombo)</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Settled Amount</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{txn.id}</td>
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900">{txn.vehicleRegNumber}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{txn.slotId || 'Bay'}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{txn.customerName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{formatSriLankanDateTime(txn.timestamp)}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {txn.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                    {formatLKR(txn.amountLKR)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handlePrintTransaction(txn)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 ml-auto"
                      title="Print Official Sri Lankan Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
