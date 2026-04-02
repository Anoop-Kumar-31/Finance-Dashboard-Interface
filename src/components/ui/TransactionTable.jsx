import React from "react";
import { Card, CardContent } from "./Card";
import Button from "./Button";
import { formatCurrency, formatDate } from "../../utils/format";
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2, Filter } from "lucide-react";

const TransactionTable = ({ 
  transactions, 
  isAdmin, 
  canEdit, 
  canDelete, 
  openEdit, 
  handleDelete, 
  dispatch, 
  resetFilters 
}) => {
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
                {transactions.length > 0 ? (
                  transactions.map((txn) => (
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
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
                            txn.type === "income"
                              ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                              : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {txn.type === "income" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {txn.type.toUpperCase()}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-right text-sm font-bold ${
                          txn.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
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
        </Card>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {transactions.length > 0 ? (
          transactions.map((txn) => (
            <Card key={txn.id}>
              <CardContent className="p-4!">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        txn.type === "income"
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
                      className={`text-sm font-bold ${
                        txn.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
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
      </div>
    </>
  );
};

export default TransactionTable;
