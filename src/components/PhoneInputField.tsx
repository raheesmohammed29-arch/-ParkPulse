import React, { useState } from 'react';
import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { validateSriLankanPhone, sanitizeSriLankanPhone } from '../utils/phoneValidation';

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  label = 'Sri Lankan Phone No *',
  required = true,
  placeholder = '0771234567',
  id = 'phone-input',
  disabled = false,
  className = '',
  autoFocus = false,
}) => {
  const [touched, setTouched] = useState(false);

  const validation = validateSriLankanPhone(value);
  const isFilled = value.length > 0;
  const showError = (touched || isFilled) && !validation.isValid;
  const showSuccess = validation.isValid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strictly filter out non-digit characters and clamp to 10
    const rawVal = e.target.value;
    const sanitized = sanitizeSriLankanPhone(rawVal);
    const result = validateSriLankanPhone(sanitized);
    setTouched(true);
    onChange(sanitized, result.isValid);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigation, delete, and control keys
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }

    // Reject non-numeric characters immediately
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      setTouched(true);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const sanitized = sanitizeSriLankanPhone(pastedText);
    const result = validateSriLankanPhone(sanitized);
    setTouched(true);
    onChange(sanitized, result.isValid);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>{label}</span>
          {value.length > 0 && (
            <span
              className={`text-[10px] font-mono font-bold ${
                showSuccess ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {value.length}/10 digits
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Phone
            className={`w-4 h-4 transition-colors ${
              showSuccess
                ? 'text-emerald-500'
                : showError
                ? 'text-rose-500'
                : 'text-slate-400'
            }`}
          />
        </div>

        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          required={required}
          maxLength={10}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => setTouched(true)}
          className={`w-full pl-10 pr-10 py-2 text-xs font-mono font-bold rounded-xl transition-all outline-none border ${
            showSuccess
              ? 'bg-emerald-50/40 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
              : showError
              ? 'bg-rose-50/40 border-rose-400 text-rose-950 ring-2 ring-rose-400/20'
              : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          }`}
        />

        {/* Status Checkmark / Alert Icon */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          {showSuccess ? (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 animate-in zoom-in-50 duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          ) : showError ? (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-600 animate-in zoom-in-50 duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
          ) : null}
        </div>
      </div>

      {/* Validation Message Below Field */}
      {showSuccess ? (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 pt-0.5 animate-in fade-in duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span>Valid Sri Lankan mobile number</span>
        </div>
      ) : showError ? (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 pt-0.5 animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
          <span>{validation.errorMessage}</span>
        </div>
      ) : (
        <p className="text-[10px] text-slate-400 pt-0.5 font-medium">
          Format: 10 digits starting with 0 (e.g., 0771234567)
        </p>
      )}
    </div>
  );
};
