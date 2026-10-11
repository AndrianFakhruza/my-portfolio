"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login gagal");

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Email atau kata sandi tidak valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F8F8] dark:bg-[#18181B]">
      {/* Left: decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#18181B] p-12 flex-col justify-between overflow-hidden border-r border-[#27272A]">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-[#F59E0B]/15 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-amber-600/10 blur-2xl" />

        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B] flex items-center justify-center shadow-lg shadow-amber-500/25">
            <span className="text-[#18181B] font-display font-black text-lg">A</span>
          </div>
        </div>

        <div className="relative space-y-4">
          <h2 className="font-display text-4xl font-bold text-white leading-tight">
            Kelola portofolio<br />dengan mudah.
          </h2>
          <p className="text-paper-400 text-sm leading-relaxed max-w-xs">
            Dashboard terintegrasi untuk mengelola proyek, artikel, media, dan pesan kontak dalam satu panel.
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-paper-500 hover:text-[#F59E0B] transition-colors mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Beranda
            </Link>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg shadow-amber-500/25 mb-4">
              <Lock className="w-5 h-5 text-[#18181B]" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-paper-900 dark:text-paper-50">
              Masuk ke Dashboard
            </h1>
            <p className="text-sm text-paper-500 dark:text-paper-400 mt-1">
              Kelola konten portofolio Andrian Fakhruza.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-[#202024] border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-amber-500/15 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 transition-all shadow-sm"
                placeholder="email@domain.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl bg-white dark:bg-[#202024] border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-amber-500/15 text-paper-900 dark:text-paper-100 transition-all shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-400 hover:text-paper-600 dark:hover:text-paper-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-sm font-bold rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Masuk ke Dashboard
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
