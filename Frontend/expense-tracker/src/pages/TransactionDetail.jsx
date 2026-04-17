import { useParams, useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { MdArrowBack, MdTrendingUp, MdTrendingDown, MdDelete, MdReceiptLong, MdCategory, MdInfoOutline } from 'react-icons/md';

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

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, deleteTransaction } = useTransactions();

  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-on-surface mb-4">Transaction Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-malachite-700 font-medium transition-smooth"
        >
          <MdArrowBack /> Go Back
        </button>
      </div>
    );
  }

  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    navigate(-1);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-12">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface font-medium transition-smooth bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-outline-variant/10 cursor-pointer"
        >
          <MdArrowBack className="text-xl" /> 
          <span className="hidden sm:inline">Back to List</span>
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-error hover:bg-error-container hover:text-error px-4 py-2 rounded-xl transition-smooth shadow-sm border border-outline-variant/10 bg-surface-container-lowest cursor-pointer"
        >
          <MdDelete className="text-xl" />
          <span className="hidden sm:inline font-medium">Delete Record</span>
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-10 shadow-malachite-lg relative overflow-hidden">
        {/* Background Accent */}
        <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full opacity-30 pointer-events-none ${isIncome ? 'bg-primary' : 'bg-on-surface'}`} />

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          {/* Icon/Avatar Large */}
          <div
            className={`w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center shrink-0 overflow-hidden shadow-md border border-outline-variant/10 text-5xl sm:text-7xl font-extrabold ${
              isIncome ? 'bg-surface-container text-primary' : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {transaction.title.charAt(0).toUpperCase()}
          </div>

          {/* Core Info */}
          <div className="flex-1 space-y-4 w-full">
            <div>
              <span className={`inline-block text-xs font-bold uppercase text-tracking-wide px-3 py-1 rounded-full mb-3 ${getCategoryColor(transaction.category)}`}>
                {transaction.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight leading-tight break-words">
                {transaction.title}
              </h1>
              <p className="text-on-surface-variant text-base sm:text-lg mt-2 break-words">
                {transaction.description || `${transaction.type} transaction`}
              </p>
            </div>

            <div className="pt-2">
              <p className="text-xs text-on-surface-variant uppercase font-semibold text-tracking-wide mb-1">
                Amount
              </p>
              <h2 className={`text-5xl sm:text-6xl font-black tracking-tighter ${isIncome ? 'text-primary' : 'text-on-surface'} truncate`}>
                {isIncome ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
          </div>
        </div>

        <hr className="my-8 border-outline-variant/20" />

        {/* Extended Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10 w-full">
          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 w-full min-w-0">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <MdReceiptLong className="text-lg shrink-0" />
              <p className="text-xs uppercase font-bold text-tracking-wide truncate">Reference</p>
            </div>
            <p className="text-on-surface font-semibold text-sm truncate">
              TXN-{transaction.id.padStart(8, '0').slice(0, 8)}
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 w-full min-w-0">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <MdInfoOutline className="text-lg shrink-0" />
              <p className="text-xs uppercase font-bold text-tracking-wide truncate">Status</p>
            </div>
            <p className="text-on-surface font-semibold text-sm truncate">
              {transaction.status || 'Processed'}
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 sm:col-span-2 lg:col-span-1 w-full min-w-0">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <MdCategory className="text-lg shrink-0" />
              <p className="text-xs uppercase font-bold text-tracking-wide truncate">Timestamp</p>
            </div>
            <p className="text-on-surface font-semibold text-sm truncate">
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
