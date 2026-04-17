export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const variants = {
    primary: 'gradient-primary text-on-primary hover:opacity-90 shadow-malachite',
    secondary: 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high',
    ghost: 'bg-transparent text-primary hover:bg-surface-container-low',
    danger: 'bg-error-container text-error hover:opacity-90',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-smooth cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-on-surface text-sm font-medium">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-xl bg-surface-container-lowest text-on-surface text-sm placeholder:text-outline transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          error
            ? 'border border-error/30'
            : 'border border-outline-variant/20 focus:border-primary'
        }`}
        {...props}
      />
      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
}

export function Select({ label, options, error, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-on-surface text-sm font-medium">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 rounded-xl bg-surface-container-lowest text-on-surface text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer ${
          error
            ? 'border border-error/30'
            : 'border border-outline-variant/20 focus:border-primary'
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
}

import { createPortal } from 'react-dom';

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#002202]/60 backdrop-blur-md animate-backdrop-in cursor-pointer"
        onClick={onClose}
      />
      {/* Content */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-malachite-lg p-6 md:p-8 animate-scale-in max-h-[90vh] flex flex-col z-10">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h2 className="text-on-surface text-lg font-bold text-tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-smooth cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto px-1 -mx-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
