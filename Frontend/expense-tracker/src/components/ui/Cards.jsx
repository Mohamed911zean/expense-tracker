export function StatCard({ title, value, subtitle, icon, trend, className = '', bgImage, bgOverlay }) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-2xl p-6 shadow-malachite transition-smooth hover:shadow-malachite-lg group relative overflow-hidden ${className}`}
      style={bgImage ? { backgroundImage: `url("${bgImage}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {bgImage && <div className={`absolute inset-0 ${bgOverlay || 'bg-surface-container-lowest/80 backdrop-blur-[2px]'}`} />}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-on-surface-variant text-xs font-medium uppercase text-tracking-wide mb-1">
              {title}
            </p>
            <h3 className="text-on-surface text-2xl md:text-3xl font-bold text-tracking-tight">
              {value}
            </h3>
            {subtitle && (
              <p className="text-on-surface-variant text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-surface-container transition-smooth shrink-0 shadow-sm">
              <span className="text-primary text-xl">{icon}</span>
            </div>
          )}
        </div>
      {trend && (
        <div className="flex items-center gap-1.5 mt-auto pt-2">
          <span
            className={`text-xs font-semibold ${
              trend.positive ? 'text-primary' : 'text-error'
            }`}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-on-surface-variant text-xs">vs last month</span>
        </div>
      )}
      </div>
    </div>
  );
}

export function BalanceCard({ balance, income, expenses, variant = 'default' }) {
  const bgStyles = {
    default: 'bg-primary text-on-primary',
    gradient: 'bg-gradient-to-br from-primary to-primary-container text-on-primary',
  };

  return (
    <div className={`rounded-3xl p-6 ${bgStyles[variant]} relative overflow-hidden flex flex-col justify-between group transition-smooth`}>
      <div className="relative z-10">
        <p className="text-white/90 text-xs font-medium uppercase text-tracking-wide mb-2">
          Available Balance
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-tracking-tight mb-6">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </h2>

        <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 md:mt-0">
          <div className="min-w-0">
            <p className="text-white/90 text-[10px] md:text-xs font-medium uppercase text-tracking-wide mb-1 truncate">
              Income
            </p>
            <p className="text-base md:text-lg font-semibold truncate">
              ${income.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div className="min-w-0">
            <p className="text-white/90 text-[10px] md:text-xs font-medium uppercase text-tracking-wide mb-1 truncate">
              Expenses
            </p>
            <p className="text-base md:text-lg font-semibold truncate">
              ${expenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
