import { createSelector } from "@reduxjs/toolkit";

export const selectAllTransactions = (state) => state.transactions.items;
export const selectFilters = (state) => state.filters;

export const selectFilteredTransactions = createSelector(
  [selectAllTransactions, selectFilters],
  (transactions, filters) => {
    const { category, type, searchText, dateRange } = filters;

    return transactions
      .filter((txn) => {
        const matchCategory = category === "All" || txn.category === category;
        const matchType = type === "All" || txn.type === type;
        const matchSearch =
          txn.note.toLowerCase().includes(searchText.toLowerCase()) ||
          txn.category.toLowerCase().includes(searchText.toLowerCase());

        let matchDate = true;
        if (dateRange.start && dateRange.end) {
          const txnDate = new Date(txn.date);
          matchDate =
            txnDate >= new Date(dateRange.start) &&
            txnDate <= new Date(dateRange.end);
        }

        return matchCategory && matchType && matchSearch && matchDate;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
);

export const selectTransactionStats = createSelector(
  [selectFilteredTransactions],
  (transactions) => {
    return transactions.reduce(
      (acc, txn) => {
        if (txn.type === "income") {
          acc.income += txn.amount;
        } else {
          acc.expense += txn.amount;
        }
        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }
);
