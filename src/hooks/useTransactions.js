import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTransactions,
  setLoading,
  setError,
} from "../features/transactions/transactionSlice";
import { setCurrentUser, setAllUsers } from "../features/user/userSlice";

export const useTransactions = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.items);
  const loading = useSelector((state) => state.transactions.loading);
  const error = useSelector((state) => state.transactions.error);

  useEffect(() => {
    // Only fetch if we don't have data in Redux (since we use Redux Persist)
    if (transactions.length === 0) {
      const fetchData = async () => {
        dispatch(setLoading(true));
        try {
          // Fetch transactions
          const txnRes = await fetch("/mockData/transactions.json");
          const txnData = await txnRes.json();
          dispatch(setTransactions(txnData));

          // Fetch user
          const userRes = await fetch("/mockData/user.json");
          const userData = await userRes.json();
          dispatch(setAllUsers(userData));
          // Set first user as default current user for simulation
          if (userData.length > 0) {
            dispatch(setCurrentUser(userData[0]));
          }
        } catch (err) {
          dispatch(setError(err.message));
        } finally {
          dispatch(setLoading(false));
        }
      };

      fetchData();
    }
  }, [dispatch, transactions.length]);

  return { transactions, loading, error };
};
