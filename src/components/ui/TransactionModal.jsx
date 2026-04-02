import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTransaction, updateTransaction } from "../../features/transactions/transactionSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, IndianRupee, Tag, FileText, Calendar, TrendingUp, TrendingDown,
} from "lucide-react";
import Button from "../ui/Button";

const categories = [
  "Salary", "Food", "Shopping", "Transport",
  "Freelance", "Bills", "Entertainment", "Investment",
];

// Standard starter data for a fresh transaction
const emptyForm = {
  type: "income",
  amount: "",
  category: "Salary",
  note: "",
  date: new Date().toISOString().split("T")[0],
};

const Field = ({ label, error, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {Icon && <Icon size={12} />} {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const TransactionModal = ({ isOpen, onClose, editingTransaction = null, viewingTransaction = null, type }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const isEditing = !!editingTransaction;
  const isViewing = !!viewingTransaction;
  const activeTxn = editingTransaction || viewingTransaction;

  // Sync the form state if we're editing an existing record or viewing details
  useEffect(() => {
    if (activeTxn) {
      setForm({
        type: activeTxn.type,
        amount: String(activeTxn.amount),
        category: activeTxn.category,
        note: activeTxn.note || "",
        date: activeTxn.date?.split("T")[0] || new Date().toISOString().split("T")[0],
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [activeTxn, isOpen]);

  // UX Fix: Let users close the modal with the Escape key
  useEffect(() => {
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isOpen, onClose]);

  // Quick sanity check before we try to save
  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = "Enter a valid positive amount.";
    if (!form.date) e.date = "Date is required.";
    if (!form.note.trim()) e.note = "Note / description is required.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      id: isEditing ? editingTransaction.id : `txn-${Date.now()}`,
      type: form.type,
      amount: parseFloat(form.amount),
      category: form.category,
      note: form.note.trim(),
      date: new Date(form.date).toISOString(),
    };

    if (isEditing) {
      dispatch(updateTransaction(payload));
    } else {
      dispatch(addTransaction(payload));
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] w-screen h-screen"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full max-w-md rounded-2xl shadow-2xl pointer-events-auto overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-500 shadow-lg">
                    <IndianRupee size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">
                      {isViewing ? "Transaction Details" : isEditing ? "Edit Transaction" : "Add Transaction"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isViewing ? "View full transaction history." : isEditing ? "Update the transaction details." : "Record a new financial entry."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Type Toggle */}
                <Field label="Type">
                  <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-50 dark:bg-slate-800/50 ${isViewing ? "opacity-70 pointer-events-none" : ""}`}>
                    {["income", "expense"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        disabled={isViewing}
                        onClick={() => setForm((f) => ({ ...f, type: t }))}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${form.type === t
                          ? t === "income"
                            ? "bg-green-500! dark:bg-green-500! text-white! shadow-md"
                            : "bg-red-500! dark:bg-red-500! text-white! shadow-md"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                      >
                        {t === "income" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Amount + Date (side by side) */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Amount" error={errors.amount} icon={IndianRupee}>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 dark:text-slate-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        disabled={isViewing}
                        className={`w-full pl-7 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-100 dark:bg-slate-800 border-transparent text-slate-900 dark:text-slate-50 ${errors.amount ? "ring-2 ring-red-500 focus:ring-red-500" : ""} ${isViewing ? "opacity-70 cursor-not-allowed" : ""}`}
                        value={form.amount}
                        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                      />
                    </div>
                  </Field>
                  <Field label="Date" error={errors.date} icon={Calendar}>
                    <input
                      type="date"
                      disabled={isViewing}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-100 dark:bg-slate-800 border-transparent text-slate-900 dark:text-slate-50 ${errors.date ? "ring-2 ring-red-500 focus:ring-red-500" : ""} ${isViewing ? "opacity-70 cursor-not-allowed" : ""}`}
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    />
                  </Field>
                </div>

                {/* Category */}
                <Field label="Category" icon={Tag}>
                  <select
                    disabled={isViewing}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-100 dark:bg-slate-800 border-transparent text-slate-900 dark:text-slate-50 cursor-pointer appearance-none ${isViewing ? "opacity-70 cursor-not-allowed" : ""}`}
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                {/* Note */}
                <Field label="Note / Description" error={errors.note} icon={FileText}>
                  <textarea
                    rows={2}
                    placeholder="e.g. Monthly salary payment..."
                    disabled={isViewing}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-100 dark:bg-slate-800 border-transparent text-slate-900 dark:text-slate-50 resize-none ${errors.note ? "ring-2 ring-red-500 focus:ring-red-500" : ""} ${isViewing ? "opacity-70 cursor-not-allowed" : ""}`}
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  />
                </Field>

                {/* Actions */}
                {!isViewing && (
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 p-2.5 rounded-xl text-sm font-semibold transition-colors bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <Button type="submit" className="flex-1 py-2! rounded-lg font-bold shadow-lg">
                      {isEditing ? "Save Changes" : "Add Transaction"}
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
