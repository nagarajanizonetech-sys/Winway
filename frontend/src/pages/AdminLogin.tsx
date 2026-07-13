import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import logo from "../assets/winway1.webp";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await api.post("/admin/login", formData);
      localStorage.setItem("adminToken", response.data.access_token);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#5B4636] flex items-center justify-center py-16 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,185,140,0.15),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(214,185,140,0.08),transparent_30%)]" />
      <div className="relative max-w-md w-full rounded-[2rem] border border-[rgba(214,185,140,0.3)] bg-[#F3E9DC]/60 p-10 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white p-2 shadow-sm shadow-[#5B4636]/10">
            <img src={logo} alt="Winway Logo" className="h-16 w-16 object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-[#5B4636]">Admin Login</h2>
          <p className="text-sm text-[#7a6153] mt-2">
            Access the inventory and manage products with ease.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-semibold text-[#5B4636] mb-2">
              Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#D6B98C]">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-3xl border border-[rgba(214,185,140,0.3)] bg-white py-3 pl-12 pr-4 text-[#5B4636] placeholder-[#7a6153]/50 outline-none transition focus:border-[#D6B98C] focus:ring-2 focus:ring-[#D6B98C]/20"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#5B4636] mb-2">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#D6B98C]">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-3xl border border-[rgba(214,185,140,0.3)] bg-white py-3 pl-12 pr-12 text-[#5B4636] placeholder-[#7a6153]/50 outline-none transition focus:border-[#D6B98C] focus:ring-2 focus:ring-[#D6B98C]/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#D6B98C] hover:text-[#5B4636] transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-gradient-to-r from-[#D6B98C] to-[#b8936a] px-6 py-3 text-sm font-semibold text-[#5B4636] shadow-lg shadow-[#D6B98C]/15 transition hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
