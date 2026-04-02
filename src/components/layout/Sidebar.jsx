import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ArrowLeftRight, PieChart, LogOut, X, ShieldCheck, User,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/user/userSlice";
import useRole from "../../hooks/useRole";

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const location = useLocation();
  const { isAdmin, role } = useRole();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { name: "Insights", path: "/insights", icon: PieChart },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen flex flex-col
          w-[260px] border-r border-slate-200 dark:border-slate-800
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          bg-white dark:bg-slate-900
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-3 h-16">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-2xl bg-linear-to-tl from-indigo-500 to-purple-500 rotate-135 shadow-md group hover:rotate-180 transition-transform">
              <span className="rotate-45 group-hover:rotate-0 transition-transform delay-400">Z</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-display">
              Zorvyn
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-3 border-t border-slate-200 dark:border-slate-800" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
