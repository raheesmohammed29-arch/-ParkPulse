import React from 'react';
import { 
  Printer, 
  X, 
  CheckCircle2, 
  Car, 
  Building2, 
  MapPin, 
  Phone, 
  Download,
  Share2
} from 'lucide-react';
import { formatLKR, formatSriLankanDateTime, generateQRMatrix } from '../utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: {
    receiptNumber: string;
    transactionId: string;
    vehicleRegNumber: string;
    vehicleType: string;
    customerName: string;
    customerPhone?: string;
    slotId: string;
    entryTime: string;
    exitTime: string;
    durationText: string;
    billableHours: number;
    amountLKR: number;
    paymentMethod: string;
    facilityName?: string;
    facilityAddress?: string;
  } | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptData,
}) => {
  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  const qrMatrix = generateQRMatrix(receiptData.transactionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Controls (Hidden in print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider">Payment Verified & Settled</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-slate-800 font-sans" id="printable-parking-receipt">
          {/* Header & Logo */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300 space-y-1">
            <div className="inline-flex items-center gap-1.5 font-black text-xl text-[#0B1220]">
              <Car className="w-5 h-5 text-blue-600" />
              <span>SmartPark Pro</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {receiptData.facilityName || 'Colombo City Center Car Park'}
            </p>
            <p className="text-[10px] text-slate-500">
              {receiptData.facilityAddress || '137 Galle Road, Kollupitiya, Colombo 03, Sri Lanka'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Hotline: 011 234 5678 / 077 123 4567 &bull; Reg: PV-109283-LK
            </p>
          </div>

          {/* Receipt & Transaction IDs */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-600 pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Receipt No</span>
              <span className="font-bold text-slate-900">{receiptData.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-sans">Transaction ID</span>
              <span className="font-bold text-blue-700">{receiptData.transactionId}</span>
            </div>
          </div>

          {/* Vehicle & Parking Bay */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Vehicle Number</span>
              <span className="font-mono text-base font-black text-[#0B1220]">
                {receiptData.vehicleRegNumber}
              </span>
              <span className="text-[10px] text-slate-500 capitalize block mt-0.5">
                Category: {receiptData.vehicleType.replace('_', ' ')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Allocated Bay</span>
              <span className="font-mono text-xl font-black text-blue-700">
                {receiptData.slotId}
              </span>
            </div>
          </div>

          {/* Timings */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-800">{receiptData.customerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Arrival (Check-in):</span>
              <span className="font-medium text-slate-800">{formatSriLankanDateTime(receiptData.entryTime)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Departure (Check-out):</span>
              <span className="font-medium text-slate-800">{formatSriLankanDateTime(receiptData.exitTime)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Actual Duration:</span>
              <span className="font-bold text-slate-900">{receiptData.durationText}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Billable Units:</span>
              <span className="font-bold text-slate-900">{receiptData.billableHours} Hours</span>
            </div>
          </div>

          {/* TOTAL IN LKR */}
          <div className="bg-[#0B1220] p-4 rounded-2xl text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 block">Total Amount Paid</span>
              <span className="text-[10px] text-slate-300">Method: {receiptData.paymentMethod}</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white">
                {formatLKR(receiptData.amountLKR)}
              </span>
            </div>
          </div>

          {/* QR Code Matrix */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <div className="grid grid-cols-21 gap-0 w-28 h-28">
                {qrMatrix.map((row, rIdx) => (
                  <div key={rIdx} className="flex">
                    {row.map((cell, cIdx) => (
                      <span
                        key={cIdx}
                        className={`w-[5px] h-[5px] ${cell ? 'bg-[#0B1220]' : 'bg-white'}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-wider">
              Scan for automated barrier exit verification
            </span>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-dashed border-slate-200">
            Thank you for parking with SmartPark Pro! Drive safely.
          </div>
        </div>

        {/* Modal Bottom Print Button (Hidden in print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
          >
            Close
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sri Lankan Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
