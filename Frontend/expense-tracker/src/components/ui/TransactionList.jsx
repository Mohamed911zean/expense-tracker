import { MdDelete, MdTrendingUp, MdTrendingDown } from 'react-icons/md';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getCategoryColor(category) {
  const colors = {
    Salary: 'bg-malachite-100 text-malachite-800',
    Freelance: 'bg-malachite-50 text-malachite-700',
    Investment: 'bg-malachite-200/50 text-malachite-900',
    Lifestyle: 'bg-surface-container-high text-on-surface-variant',
    Entertainment: 'bg-tertiary-container/30 text-tertiary',
    Housing: 'bg-surface-container text-on-surface-variant',
    Dining: 'bg-surface-container-high text-on-surface-variant',
    'Home Decor': 'bg-surface-container text-on-surface-variant',
    Transport: 'bg-surface-container-low text-on-surface-variant',
    Groceries: 'bg-malachite-50 text-malachite-800',
    Subscriptions: 'bg-surface-container-highest text-on-surface-variant',
  };
  return colors[category] || 'bg-surface-container text-on-surface-variant';
}

import { useNavigate } from 'react-router-dom';

export function TransactionItem({ transaction, onDelete, showDelete = true }) {
  const isIncome = transaction.type === 'income';
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/transaction/${transaction.id}`)}
      className="flex items-start sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 group transition-smooth hover:bg-surface-container/50 -mx-1 sm:-mx-2 px-1 sm:px-2 rounded-xl cursor-pointer"
    >
      <div
        className={`hidden sm:flex w-10 h-10 rounded-xl items-center justify-center shrink-0 overflow-hidden font-bold text-lg ${
          isIncome ? 'shadow-sm border border-outline-variant/10 bg-surface-container-low text-primary' : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        {transaction.title.charAt(0).toUpperCase()}
      </div>

      {/* Structured Card Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Header: Title on left, Amount on right */}
        <div className="flex justify-between items-start gap-2 w-full overflow-hidden">
          <p className="text-on-surface text-sm font-semibold truncate flex-1 min-w-0">
            {transaction.title}
          </p>
          <p
            className={`text-sm font-bold shrink-0 ${
              isIncome ? 'text-primary' : 'text-on-surface'
            }`}
          >
            {isIncome ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Body: Description / category */}
        <div className="w-full overflow-hidden">
          <p className="text-on-surface-variant text-xs truncate">
            {transaction.description || transaction.category}
          </p>
        </div>

        {/* Footer: Status badge on left, Date on right */}
        <div className="flex justify-between items-center sm:pt-0.5 w-full overflow-hidden">
          <div className="min-w-0 shrink-0">
            {transaction.status ? (
              <span className={`inline-block text-[9px] sm:text-[10px] font-medium uppercase text-tracking-wide px-2 py-0.5 rounded-full ${getCategoryColor(transaction.category)}`}>
                {transaction.status}
              </span>
            ) : (
              <div className="h-4" />
            )}
          </div>
          <p className="text-on-surface-variant text-[10px] sm:text-xs shrink-0 ml-2">
            {formatDate(transaction.date)}
          </p>
        </div>
      </div>

      {/* Delete Action Wrapper */}
      {showDelete && onDelete && (
        <div className="shrink-0 self-center flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(transaction.id);
            }}
            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 sm:p-1.5 rounded-xl sm:hover:bg-error-container text-outline hover:text-error transition-smooth"
            aria-label="Delete transaction"
          >
            <MdDelete className="text-[20px] sm:text-[18px]" />
          </button>
        </div>
      )}
    </div>
  );
}

export function TransactionList({ transactions, onDelete, title, emptyMessage = 'No transactions yet', showDelete = true }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-malachite">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-on-surface text-base font-bold">{title}</h3>
          <span className="text-on-surface-variant text-xs font-medium">
            {transactions.length} entries
          </span>
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mx-auto mb-4">
            <MdTrendingDown className="text-2xl text-on-surface-variant" />
          </div>
          <p className="text-on-surface-variant text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="divide-y-0 space-y-0">
          {transactions.map((t, index) => (
            <div
              key={t.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TransactionItem
                transaction={t}
                onDelete={onDelete}
                showDelete={showDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TransactionSkeleton({ count = 3 }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-malachite">
      <div className="skeleton h-5 w-40 rounded-lg mb-6" />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start sm:items-center gap-3 sm:gap-4 py-4">
          <div className="skeleton w-10 h-10 rounded-xl shrink-0 hidden sm:block" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex justify-between items-center gap-2">
              <div className="skeleton h-4 w-1/2 rounded-lg" />
              <div className="skeleton h-4 w-16 rounded-lg shrink-0" />
            </div>
            <div className="skeleton h-3 w-3/4 rounded-lg" />
            <div className="flex justify-between items-center gap-2 pt-1">
              <div className="skeleton h-4 w-12 rounded-full shrink-0" />
              <div className="skeleton h-3 w-16 rounded-lg shrink-0" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
