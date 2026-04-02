import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTransactions } from "../../hooks/useTransactions";

const Layout = () => {
  const { loading, error } = useTransactions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef(null);
  
  // Let's get the theme ready—checks storage first, then system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("zorvyn-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const location = useLocation();

  // Apply the dark class to the root element for Tailwind v4
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("zorvyn-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Clean up: make sure sidebar is closed and we're at the top when switching routes
  useEffect(() => {
    setSidebarOpen(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Handle window resize logic—hide sidebar if we jump back to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin mx-auto border-indigo-600 dark:border-indigo-400" />
          <p className="text-sm font-medium animate-pulse text-slate-500 dark:text-slate-400">
            Loading Zorvyn...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center p-8 rounded-2xl border max-w-md mx-4 bg-white dark:bg-slate-900 border-red-500/50">
          <h2 className="text-xl font-bold mb-2 text-red-500">
            Error Loading Data
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex transition-colors duration-300 overflow-hidden h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 w-full">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <main className="flex-1">
          <div 
            ref={scrollRef}
            className="max-w-7xl p-4 sm:p-6 lg:p-8 mx-auto animate-fade-in h-[calc(100vh-60px)] overflow-y-auto"
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
