import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../features/user/userSlice";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { LogIn, User, ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        dispatch(setCurrentUser({
          email: email,
          name: email.split("@")[0],
          role: email.includes("admin") ? "Admin" : "User"
        }));
      } else {
        setError("Please enter valid credentials.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const quickLogin = (type) => {
    setIsLoading(true);
    setTimeout(() => {
      if (type === "admin") {
        dispatch(setCurrentUser({
          email: "admin@zorvyn.com",
          name: "Admin User",
          role: "Super Admin"
        }));
      } else {
        dispatch(setCurrentUser({
          email: "user@zorvyn.com",
          name: "Standard User",
          role: "Member"
        }));
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[120px] bg-indigo-500/30 dark:bg-indigo-500/20" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[120px] bg-purple-500/30 dark:bg-purple-500/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
          <div className="flex gap-3 p-6 pb-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-xl bg-linear-to-br from-indigo-500 to-purple-600 text-white"
            >
              <LogIn size={32} />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-display">
                Welcome Back
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Access your Zorvyn finance dashboard
              </p>
            </div>
          </div>

          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider ml-1 text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-100 dark:bg-slate-800 border-transparent text-slate-900 dark:text-slate-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-100 dark:bg-slate-800 border-transparent text-slate-900 dark:text-slate-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs font-medium p-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    Logging In...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Login <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                  Quick Access Profiles
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => quickLogin("admin")}
                className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 transition-all hover:border-solid hover:bg-indigo-50 dark:hover:bg-indigo-900/10 group bg-slate-50 dark:bg-slate-800/50"
                disabled={isLoading}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-none mb-1 text-slate-900 dark:text-slate-50">Super Admin</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 opacity-70">Demo full access</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => quickLogin("user")}
                className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 transition-all hover:border-solid hover:bg-slate-100 dark:hover:bg-slate-800 group bg-slate-50 dark:bg-slate-800/50"
                disabled={isLoading}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white">
                  <User size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-none mb-1 text-slate-900 dark:text-slate-50">Normal User</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 opacity-70">Standard member</p>
                </div>
              </button>
            </div>
          </CardContent>
          <p className="text-xs text-center mb-6 text-slate-500 dark:text-slate-400 font-medium">
            &copy; 2026 Zorvyn Finance. All rights reserved.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
