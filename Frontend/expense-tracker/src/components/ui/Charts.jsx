import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const CHART_COLORS = ['#026e00', '#1dde13', '#0fa60a', '#6df561', '#a4fb9b', '#d0fdca', '#8f4959', '#bbccb1'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-surface-container-lowest rounded-xl px-4 py-3 shadow-malachite-lg">
      <p className="text-on-surface text-xs font-semibold mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: ${entry.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function SpendingChart({ data }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-malachite">
      <div className="mb-6">
        <h3 className="text-on-surface text-base font-bold">Spending Trends</h3>
        <p className="text-on-surface-variant text-xs mt-1">Visualizing your monthly cash flow</p>
      </div>
      <div className="h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#026e00" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#026e00" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8f4959" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#8f4959" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#bbccb1" strokeOpacity={0.3} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#6c7c65' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6c7c65' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#026e00"
              strokeWidth={2}
              fill="url(#incomeGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#026e00', stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expenses"
              stroke="#8f4959"
              strokeWidth={2}
              fill="url(#expenseGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#8f4959', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategoryChart({ data, title = 'Spending by Category', subtitle = 'Visualizing your lifestyle flow' }) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-malachite">
      <div className="mb-6">
        <h3 className="text-on-surface text-base font-bold">{title}</h3>
        <p className="text-on-surface-variant text-xs mt-1">{subtitle}</p>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-48 h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 34, 2, 0.08)',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 w-full space-y-3">
          {data.map((cat, index) => (
            <div key={cat.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface text-xs font-medium truncate">{cat.name}</span>
                  <span className="text-on-surface-variant text-xs font-semibold">
                    ${cat.amount.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${total ? (cat.amount / total) * 100 : 0}%`,
                      backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
