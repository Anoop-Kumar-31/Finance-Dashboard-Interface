import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./Card";
import Button from "./Button";
import { formatCurrency, formatDate } from "../../utils/format";
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2, Filter, ChevronLeft, ChevronRight } from "lucide-react";

const TransactionTable = ({
  transactions,
  isAdmin,
  canEdit,
  canDelete,
  openEdit,
  openView,
  handleDelete,
  dispatch,
  resetFilters
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Total pages based on filtered list
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Ensure we're not on a page that doesn't exist (e.g. after filtering)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [transactions.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-slate-50/50 dark:bg-slate-800/10 border-t border-slate-200 dark:border-slate-800">
        {/* Left: Range Info (Hidden on very small mobile) */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing <span className="text-slate-900 dark:text-slate-50">{startIndex + 1}</span> to <span className="text-slate-900 dark:text-slate-50">{Math.min(startIndex + itemsPerPage, transactions.length)}</span> of <span className="text-slate-900 dark:text-slate-50">{transactions.length}</span>
        </div>

        {/* Center/Right: Navigation */}
        <div className="flex-1 sm:flex-initial flex items-center justify-between sm:justify-end gap-3 font-bold">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
            <span className="sm:hidden text-xs">Prev</span>
          </button>

          {/* Detailed numbers for Desktop */}
          <div className="hidden sm:flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (totalPages > 5 && Math.abs(page - currentPage) > 1 && page !== 1 && page !== totalPages) {
                if (page === 2 || page === totalPages - 1) return <span key={page} className="px-1 text-slate-400">...</span>;
                return null;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === page
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Compact indicator for Mobile */}
          <div className="sm:hidden text-xs font-bold text-slate-500 dark:text-slate-400">
            Page <span className="text-slate-900 dark:text-slate-50">{currentPage}</span> of {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            <span className="sm:hidden text-xs">Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };
  return (
    <>
      {/* Table — Desktop */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  {["Date", "Category", "Note", "Type", "Amount"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${i === 4 ? " text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                  {/* Admin action column */}
                  {isAdmin && (
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-center text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentTransactions.length > 0 ? (
                  currentTransactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="transition-colors duration-150 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-50">
                        {formatDate(txn.date)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                          {txn.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm max-w-[200px] truncate text-slate-500 dark:text-slate-400">
                        {txn.note}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${txn.type === "income"
                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                            : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                            }`}
                        >
                          {txn.type === "income" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {txn.type.toUpperCase()}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-right text-sm font-bold ${txn.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                      >
                        {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount)}
                      </td>

                      {/* Admin action buttons */}
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1">
                            {canEdit && (
                              <button
                                onClick={() => openEdit(txn)}
                                title="Edit"
                                className="p-1.5 rounded-md transition-colors text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                              >
                                <Pencil size={14} />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(txn.id)}
                                title="Delete"
                                className="p-1.5 rounded-md transition-colors text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                          <Filter size={32} className="opacity-40" />
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-50">No matches found</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto -mt-1">
                          We couldn't find any transactions for the selected filters. Try adjusting your search query or filters.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => dispatch(resetFilters())}>
                          Reset All Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <PaginationControls />
        </Card>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {currentTransactions.length > 0 ? (
          currentTransactions.map((txn) => (
            <Card key={txn.id}>
              <CardContent className="p-4!">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0" onClick={() => openView(txn)}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${txn.type === "income"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                        : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        }`}
                    >
                      {txn.type === "income" ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
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

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-sm font-bold ${txn.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                    >
                      {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount)}
                    </span>

                    {/* Mobile admin actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        {canEdit && (
                          <button
                            onClick={() => openEdit(txn)}
                            className="p-1.5 rounded-md transition-colors text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          >
                            <Pencil size={13} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(txn.id)}
                            className="p-1.5 rounded-md transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-10!">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Filter size={32} className="text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-50">No results</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => dispatch(resetFilters())}>
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile Pagination */}
        <div className="pt-2 pb-6">
          <PaginationControls />
        </div>
      </div>
    </>
  );
};

export default TransactionTable;
