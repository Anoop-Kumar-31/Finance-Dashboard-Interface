import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectTransactionStats,
  selectFilteredTransactions,
} from "../../features/transactions/selectors";
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription,
} from "../../components/ui/Card";
import {
  TrendingUp, TrendingDown, Wallet,
  ArrowUpRight, ArrowDownRight, Plus, Lock, ArrowRight,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { formatCurrency, formatDate } from "../../utils/format";
import useRole from "../../hooks/useRole";
import { useState } from "react";
import TransactionModal from "../../components/ui/TransactionModal";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const StatCard = ({ title, value, icon: Icon, color, subtitle, subtitleIcon: SubIcon }) => (
  <Card className="group">
    <CardHeader className="flex flex-row items-center justify-between pb-2!">
      <CardTitle className="text-sm! font-medium! text-slate-500 dark:text-slate-400">
        {title}
      </CardTitle>
      <div
        className="p-2 rounded-lg transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: `${color}15`, color }}
      >
        <Icon size={18} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl sm:text-3xl font-bold" style={{ color }}>
        {value}
      </div>
      <p className="text-xs mt-1.5 flex items-center gap-1 text-slate-500 dark:text-slate-400">
        {SubIcon && <SubIcon size={13} />}
        {subtitle}
      </p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { income, expense, balance } = useSelector(selectTransactionStats);
  const transactions = useSelector(selectFilteredTransactions);
  const { isAdmin, role } = useRole();

  const [modalOpen, setModalOpen] = useState(false);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Grouping by category to see where the money is really going
  const topCategories = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      const existing = acc.find(a => a.name === curr.category);
      if (existing) existing.amount += curr.amount;
      else acc.push({ name: curr.category, amount: curr.amount });
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Simple formula to see what % of income is left over
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  // Let's prep the timeline data for the Cash Flow chart
  const chartData = transactions.reduce((acc, txn) => {
    const month = new Date(txn.date).toLocaleDateString("en-US", { month: "short" });
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      if (txn.type === "income") existing.income += txn.amount;
      else existing.expense += txn.amount;
    } else {
      acc.push({
        month,
        income: txn.type === "income" ? txn.amount : 0,
        expense: txn.type === "expense" ? txn.amount : 0,
      });
    }
    return acc;
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="p-3 rounded-lg border text-sm shadow-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <p className="font-semibold mb-1 text-slate-900 dark:text-slate-50">{label}</p>
        {payload.map((item) => (
          <p key={item.name} className="text-xs font-medium" style={{ color: item.color }}>
            {item.name}: {formatCurrency(item.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <TransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-display">
            Overview
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            Monitor your financial health at a glance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Role indicator */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${isAdmin
              ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
          >
            {isAdmin ? <ArrowUpRight size={12} /> : <Lock size={12} />}
            {role}
          </span>

          {/* Admin quick-add */}
          {isAdmin && (
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus size={14} /> Add Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Income" value={formatCurrency(income)}
          icon={TrendingUp} color="#22c55e"
          subtitle="+12.5% from last month" subtitleIcon={ArrowUpRight}
        />
        <StatCard
          title="Total Expenses" value={formatCurrency(expense)}
          icon={TrendingDown} color="#ef4444"
          subtitle="+8.2% from last month" subtitleIcon={ArrowDownRight}
        />
        <StatCard
          title="Current Balance" value={formatCurrency(balance)}
          icon={Wallet} color="#6366f1"
          subtitle="Updated just now"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Cash Flow Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Income vs expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    tickLine={false} axisLine={false}
                    tickFormatter={(val) => `₹${val / 1000}k`} width={50} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2}
                    fillOpacity={1} fill="url(#gIncome)" />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2}
                    fillOpacity={1} fill="url(#gExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
            <CardDescription>Automated highlights of your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Savings Rate Gauge-like Display */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Savings Rate</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{savingsRate}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                  style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {savingsRate > 20 ? "🎉 You're on track! Great job on your savings." : "💡 Try reducing non-essential expenses to boost savings."}
              </p>
            </div>

            {/* Top Categories */}
            <div className="space-y-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Top Spending Categories</span>
              <div className="space-y-3">
                {topCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{cat.name}</span>
                      <span className="text-slate-500">{formatCurrency(cat.amount)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400 dark:bg-slate-500"
                        style={{ width: `${(cat.amount / totalExpense) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate("/insights")}
              >
                Go to Detailed Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions (Full Width or Grid) */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activities across all categories</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-indigo-600 dark:text-indigo-400"
              onClick={() => navigate("/transactions")}
            >
              View All <ArrowRight className="ml-1" size={14} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              {recentTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-3 rounded-xl transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: txn.type === "income" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: txn.type === "income" ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {txn.type === "income" ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-50">
                        {txn.category}
                      </p>
                      <p className="text-xs truncate text-slate-500 dark:text-slate-400">
                        {formatDate(txn.date)} · {txn.note}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p
                      className="text-sm font-bold"
                      style={{ color: txn.type === "income" ? "#22c55e" : "#ef4444" }}
                    >
                      {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount)}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{txn.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t sm:hidden border-slate-200 dark:border-slate-800">
            <Button
              variant="ghost" size="sm" className="w-full text-indigo-600 dark:text-indigo-400"
              onClick={() => navigate("/transactions")}
            >
              View All Transactions
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
