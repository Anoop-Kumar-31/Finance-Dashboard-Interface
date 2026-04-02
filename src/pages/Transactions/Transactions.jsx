import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectFilteredTransactions } from "../../features/transactions/selectors";
import { deleteTransaction } from "../../features/transactions/transactionSlice";
import { exportCSV, exportJSON } from "../../utils/export";
import {
  setSearchText,
  setCategory,
  setType,
  resetFilters,
} from "../../features/filters/filterSlice";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TransactionModal from "../../components/ui/TransactionModal";
import TransactionTable from "../../components/ui/TransactionTable";
import useRole from "../../hooks/useRole";
import {
  Search, Filter, X, ArrowUpRight,
  Download, Plus, Lock, RotateCcw
} from "lucide-react";

const categories = [
  "All", "Salary", "Food", "Shopping", "Transport",
  "Freelance", "Bills", "Entertainment", "Investment",
];
const types = ["All", "income", "expense"];

const Transactions = () => {
  const dispatch = useDispatch();
  const { canAdd, canEdit, canDelete, isAdmin, role } = useRole();
  const transactions = useSelector(selectFilteredTransactions);
  const filters = useSelector((state) => state.filters);

  useEffect(() => {
    // Done this becuase the home page will show the filted data if we don't and i want the home dashboard to show full data summary!  \(+_+)/
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [viewingTxn, setViewingTxn] = useState(null);

  const openAdd = () => { setEditingTxn(null); setModalOpen(true); };
  const openEdit = (txn) => { setEditingTxn(txn); setModalOpen(true); };
  const openView = (txn) => { setViewingTxn(txn); setModalOpen(true); };
  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) dispatch(deleteTransaction(id));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingTransaction={editingTxn}
        viewingTransaction={viewingTxn}
        type={editingTxn ? "edit" : viewingTxn ? "view" : "add"}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-display">
            Transactions
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            {isAdmin ? "Manage and edit your financial history." : "View your financial history."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Role badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${isAdmin
              ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
          >
            {isAdmin ? <ArrowUpRight size={12} /> : <Lock size={12} />}
            {role}
          </span>

          <Button variant="outline" size="sm" onClick={() => exportJSON(transactions)}>
            <Download size={14} /> JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportCSV(transactions)}>
            <Download size={14} /> CSV
          </Button>

          <Button
            onClick={() => {
              if (confirm("Reset all app data to defaults? This will clear your current session and reload the latest mock data.")) {
                localStorage.removeItem("zorvyn-store");
                localStorage.removeItem("zorvyn-theme");
                window.location.reload();
              }
            }}
            size="sm"
            title="Reset Data to Defaults"
            aria-label="Reset Data"
          >
            <RotateCcw size={14} /> Reset Data
          </Button>

          {/* Admin-only: Add Transaction */}
          {canAdd && (
            <Button size="sm" onClick={openAdd}>
              <Plus size={14} /> Add Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Viewer read-only notice */}
      {!isAdmin && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
          <Lock size={14} className="shrink-0" />
          <span>
            You're viewing as <strong>{role}</strong>. Only Admins can add, edit, or delete transactions.
          </span>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4! sm:p-6!">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-100 dark:bg-slate-800 border-transparent text-slate-900 dark:text-slate-50"
                value={filters.searchText}
                onChange={(e) => dispatch(setSearchText(e.target.value))}
              />
            </div>

            {/* Category */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500" size={16} />
              <select
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer bg-slate-100 dark:bg-slate-800 border-transparent text-slate-900 dark:text-slate-50"
                value={filters.category}
                onChange={(e) => dispatch(setCategory(e.target.value))}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="relative">
              <ArrowUpRight className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500" size={16} />
              <select
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer bg-slate-100 dark:bg-slate-800 border-transparent text-slate-900 dark:text-slate-50"
                value={filters.type}
                onChange={(e) => dispatch(setType(e.target.value))}
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset & Results */}
            <div className="flex items-center justify-between gap-3 px-1">
              <button
                onClick={() => dispatch(resetFilters())}
                className="flex items-center gap-1 text-slate-500 cursor-pointer rounded-2xl p-2 text-xs font-semibold hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <X size={14} /> Reset
              </button>
              <div className="text-sm font-medium whitespace-nowrap text-slate-500 dark:text-slate-400">
                {transactions.length} result{transactions.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TransactionTable
        transactions={transactions}
        isAdmin={isAdmin}
        canEdit={canEdit}
        canDelete={canDelete}
        openEdit={openEdit}
        openView={openView}
        handleDelete={handleDelete}
        dispatch={dispatch}
        resetFilters={resetFilters}
      />
    </div>
  );
};

export default Transactions;
