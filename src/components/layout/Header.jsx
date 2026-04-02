import { useState, useEffect, useRef } from "react";
import { Menu, Moon, Sun, Bell, ShieldCheck, User, Info, DollarSign, AlertCircle, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useRole from "../../hooks/useRole";

const pageTitles = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/insights": "Insights",
};
// Uncomment the objects below to see how the notification system looks!
const notifications = [
  // { id: 1, title: "Salary Credited", message: "Your salary for March has been credited.", type: "income", time: "2h ago", icon: DollarSign },
  // { id: 2, title: "Budget Alert", message: "You've spent 80% of your Food budget.", type: "alert", time: "5h ago", icon: AlertCircle },
  // { id: 3, title: "Security Login", message: "New login detected from Mumbai, IN.", type: "info", time: "1d ago", icon: Info },
];

const Header = ({ onMenuClick, isDarkMode, onToggleDarkMode }) => {
  const user = useSelector((state) => state.user.currentUser);
  const { pathname } = useLocation();
  const { isAdmin, role } = useRole();
  const [showNotify, setShowNotify] = useState(false);
  const notifyRef = useRef(null);

  // Tidy up: close notifications if we click outside the panel
  useEffect(() => {
    const handle = (e) => {
      if (notifyRef.current && !notifyRef.current.contains(e.target)) {
        setShowNotify(false);
      }
    };
    if (showNotify) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showNotify]);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 border-b backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800"
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <div className="flex items-center gap-2 mx-3">

          <button
            onClick={onToggleDarkMode}
            className="relative p-2.5 rounded-xl transition-all duration-300 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500 dark:text-amber-400 group"
            aria-label="Toggle dark mode"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun size={18} className="transition-transform duration-300 group-hover:rotate-45" />
            ) : (
              <Moon size={18} className="transition-transform duration-300 group-hover:rotate-10" />
            )}
          </button>

          <div className="relative" ref={notifyRef}>
            <button
              onClick={() => setShowNotify(!showNotify)}
              className={`relative p-2.5 rounded-xl transition-all duration-300 ${showNotify
                ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                }`}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {showNotify && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-3 w-72 sm:w-80 rounded-2xl shadow-2xl border overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">Notifications</h3>
                    <button onClick={() => setShowNotify(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => {
                        const Icon = n.icon;
                        return (
                          <div
                            key={n.id}
                            className="p-4 flex gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-slate-100 last:border-0 dark:border-slate-800"
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                              n.type === 'alert' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                              }`}>
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-slate-50 truncate">{n.title}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{n.message}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">{n.time}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-10 text-center text-slate-400 dark:text-slate-500">
                        <Bell size={24} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No new notifications</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                    <button className="w-full py-1.5 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
                      Mark all as read
                    </button>
                  </div>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm("Reset all app data to defaults? This will clear your current session and reload the latest mock data.")) {
              localStorage.removeItem("zorvyn-store");
              localStorage.removeItem("zorvyn-theme");
              window.location.reload();
            }
          }}
          className="p-2.5 rounded-xl transition-all duration-300 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 transition-colors"
          title="Reset Data to Defaults"
          aria-label="Reset Data"
        >
          <RotateCcw size={18} />
        </button>

        {/* Quick User Identity Toggle */}
        <div>
          <div className="flex items-center gap-2 p-1 rounded-xl">
            <div className="flex flex-col text-right">
              <p className="text-sm font-semibold leading-tight truncate text-slate-900 dark:text-slate-50">
                {user?.name || "User"}
              </p>
              {/* Email address */}
              <span className="text-[11px] leading-tight text-slate-500/70 dark:text-slate-400/70">
                {user?.email}
              </span>
            </div>
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-md shrink-0 bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-sm">
              {user?.name?.split(" ")?.[0]?.[0]?.toUpperCase() + user?.name?.split(" ")?.[1]?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
