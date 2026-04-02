import { useSelector } from "react-redux";
import { selectFilteredTransactions } from "../../features/transactions/selectors";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../components/ui/Card";
import {
  Target,
  Lightbulb,
  Zap,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Wallet,
  PieChart as PieChartIcon,
  BarChart3,
  Sparkles,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { formatCurrency } from "../../utils/format";
import Button from "../../components/ui/Button";
import { motion } from "framer-motion";

const COLORS = [
  "#6366f1", // indigo
  "#f43f5e", // rose
  "#10b981", // emerald
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Insights = () => {
  const transactions = useSelector(selectFilteredTransactions);

  // Group by category
  const categoryData = transactions.reduce((acc, txn) => {
    if (txn.type === "expense") {
      const existing = acc.find((item) => item.name === txn.category);
      if (existing) existing.value += txn.amount;
      else acc.push({ name: txn.category, value: txn.amount });
    }
    return acc;
  }, []);

  const sortedCategoryData = [...categoryData].sort(
    (a, b) => b.value - a.value
  );
  const totalExpense = sortedCategoryData.reduce((s, c) => s + c.value, 0);

  // Group by month
  const monthlyData = transactions.reduce((acc, txn) => {
    const month = new Date(txn.date).toLocaleDateString("en-US", {
      month: "short",
    });
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

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
      : "0.0";

  // Day of week analysis
  const dayOfWeekData = transactions.reduce((acc, txn) => {
    if (txn.type === 'expense') {
      const day = new Date(txn.date).toLocaleDateString('en-US', { weekday: 'short' });
      const existing = acc.find(item => item.day === day);
      if (existing) existing.amount += txn.amount;
      else acc.push({ day, amount: txn.amount });
    }
    return acc;
  }, []);

  const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const sortedDayData = dayOfWeekData.sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));

  // Spending Distribution (Radar Chart)
  const distributionData = [
    { subject: 'Essential', A: 0, fullMark: 100 },
    { subject: 'Lifestyle', A: 0, fullMark: 100 },
    { subject: 'Health', A: 0, fullMark: 100 },
    { subject: 'Investments', A: 0, fullMark: 100 },
    { subject: 'Other', A: 0, fullMark: 100 },
  ];

  transactions.forEach(txn => {
    if (txn.type === 'expense') {
      if (['Housing', 'Food', 'Bills'].includes(txn.category)) distributionData[0].A += txn.amount;
      else if (['Entertainment', 'Shopping', 'Travel'].includes(txn.category)) distributionData[1].A += txn.amount;
      else if (['Health', 'Fitness'].includes(txn.category)) distributionData[2].A += txn.amount;
      else if (txn.category === 'Investment') distributionData[3].A += txn.amount;
      else distributionData[4].A += txn.amount;
    }
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg text-sm">
        {label && (
          <p className="font-bold mb-1 text-slate-900 dark:text-slate-50">
            {label}
          </p>
        )}
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.payload?.fill }} />
            <span className="text-slate-500 dark:text-slate-400">{item.name}:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-50">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* Header with quick stats */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-display">
            Financial Insights
          </h1>
          <p className="text-sm sm:text-base mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
            A deep-dive analysis of your spending habits and financial health for the current period.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800/50 text-xs font-medium text-slate-600 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>Updated just now</span>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden group hover:border-indigo-500/50 transition-colors duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Top Category
                </CardTitle>
                <div className="p-2 rounded-lg text-rose-500 bg-rose-500/10 ">
                  <Target size={18} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate text-slate-900 dark:text-slate-50">
                {sortedCategoryData[0]?.name || "N/A"}
              </div>
              <div className="flex items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {totalExpense > 0
                    ? `${Math.round(((sortedCategoryData[0]?.value || 0) / totalExpense) * 100)}%`
                    : "0%"}
                </span>
                <span className="ml-1">of total expenses</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden group hover:border-emerald-500/50 transition-colors duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Savings Rate
                </CardTitle>
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                  <Zap size={18} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{savingsRate}%</div>
              <div className="flex items-center mt-1 text-xs">
                {Number(savingsRate) >= 20 ? (
                  <>
                    <TrendingUp size={14} className="text-emerald-500 mr-1" />
                    <span className="text-emerald-500 font-medium">Healthy</span>
                  </>
                ) : (
                  <>
                    <TrendingDown size={14} className="text-amber-500 mr-1" />
                    <span className="text-amber-500 font-medium">Needs Attention</span>
                  </>
                )}
                <span className="ml-1 text-slate-500 dark:text-slate-400">vs target 20%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden group hover:border-blue-500/50 transition-colors duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Avg. Monthly Expense
                </CardTitle>
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <Wallet size={18} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {formatCurrency(totalExpense / (monthlyData.length || 1))}
              </div>
              <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                Based on last {monthlyData.length} months
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/30 relative overflow-hidden group hover:border-indigo-500/50 transition-colors duration-300">
            <div className="absolute -bottom-4 -right-4 text-yellow-500/10 transition-transform group-hover:scale-110">
              <Lightbulb size={120} strokeWidth={2} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb size={16} /> Insight Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                You saved <span className="text-green-600 dark:text-green-400">₹12,400</span> more than last month.
                Move this to your Emergency Fund!
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 bg-transparent hover:bg-transparent text-indigo-600 dark:text-indigo-400 flex items-center gap-2 group/btn"
              >
                Learn How <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Expenditure Donut */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <PieChartIcon size={18} className="text-indigo-500" />
                <CardTitle>Expenditure Breakdown</CardTitle>
              </div>
              <CardDescription>Where your money is going</CardDescription>
            </CardHeader>
            <CardContent className="relative h-[400px]">
              {/* Total indicator in center */}
              <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Spent</p>
                <p className="text-xl font-black text-slate-900 dark:text-slate-50">{formatCurrency(totalExpense)}</p>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sortedCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {sortedCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ paddingTop: "20px", fontSize: "15px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Performance */}
        <motion.div variants={itemVariants} className="xl:col-span-3">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 size={18} className="text-primary" />
                  <CardTitle>Cash Flow History</CardTitle>
                </div>
                <CardDescription>Income vs Expenses monthly view</CardDescription>
              </div>
              <div className="hidden sm:flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-md text-[10px] font-bold text-emerald-500 uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Income
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-500/10 rounded-md text-[10px] font-bold text-rose-500 uppercase">
                  <div className="w-2 h-2 rounded-full bg-rose-500" /> Expense
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[340px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                      width={45}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: 'var(--color-primary)', opacity: 0.05 }}
                    />
                    <Bar
                      dataKey="income"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                      name="Income"
                      animationBegin={500}
                      animationDuration={1500}
                    />
                    <Bar
                      dataKey="expense"
                      fill="#f43f5e"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                      name="Expense"
                      animationBegin={700}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day of Week Analysis */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={18} className="text-orange-500" />
                <CardTitle>Day of Week Analysis</CardTitle>
              </div>
              <CardDescription>Identify your busiest spending days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedDayData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="amount"
                      fill="#f59e0b"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Spending Radar */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <PieChartIcon size={18} className="text-purple-500" />
                <CardTitle>Spending Balance</CardTitle>
              </div>
              <CardDescription>Distribution across life pillars</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={distributionData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Radar
                      name="Spending"
                      dataKey="A"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Advice Section */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/5 p-6 rounded-3xl border border-indigo-500/10 backdrop-blur-sm">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-slate-50">Path to Financial Freedom</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Based on your current spending patterns, you are on track to save approximately
              <span className="font-bold text-slate-900 dark:text-slate-100 mx-1">₹3,45,000</span> by the end of this fiscal year.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Investments</span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Taxes</span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Budgeting</span>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button className="bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-2xl px-8 shadow-lg shadow-indigo-500/20">
              Get Personalized Plan
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Insights;

