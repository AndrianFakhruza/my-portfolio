"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, ArrowLeft, Loader2, AlertCircle, Eye, EyeOff, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
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

      // Tampilkan animasi sukses, lalu redirect setelah 750ms
      setLoginSuccess(true);
      const from = searchParams.get("from") || "/admin";
      await new Promise((resolve) => setTimeout(resolve, 700));
      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Email atau kata sandi tidak valid.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-sm space-y-7"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-paper-500 hover:text-[#F59E0B] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Beranda
        </Link>

        <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-lg shadow-amber-500/20 mb-4">
          <Image
            src="/profile.jpg"
            alt="Andrian Fakhruza"
            fill
            sizes="48px"
            className="object-cover"
            priority
          />
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight text-paper-900 dark:text-paper-50">
          Masuk ke Dashboard
        </h1>
        <p className="text-sm text-paper-500 dark:text-paper-400 mt-1">
          Kelola konten portofolio Andrian Fakhruza.
        </p>
      </div>

      {/* Notifikasi jika sesi berakhir karena inaktivitas atau timeout */}
      {reason === "inactive" && (
        <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <Clock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold">Sesi Anda telah berakhir</p>
            <p className="text-[11px] opacity-90 mt-0.5">
              Tidak ada aktivitas selama lebih dari 30 menit. Silakan masuk kembali demi keamanan.
            </p>
          </div>
        </div>
      )}

      {reason === "expired" && (
        <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <Clock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold">Sesi telah kedaluwarsa</p>
            <p className="text-[11px] opacity-90 mt-0.5">
              Batas waktu sesi login telah habis. Silakan masuk kembali.
            </p>
          </div>
        </div>
      )}

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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-400 hover:text-paper-600 dark:hover:text-paper-300 transition-colors cursor-pointer"
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
          {loading || loginSuccess ? (
            <>
              {loginSuccess ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Berhasil masuk!
                </motion.span>
              ) : (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi...
                </>
              )}
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Masuk ke Dashboard
            </>
          )}
        </button>
      </form>

      {/* ─── Full-screen success overlay ─── */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-5 bg-[#18181B]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Amber glow circle */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute w-20 h-20 rounded-full bg-amber-500/20 blur-xl" />
              <div className="relative w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.35, ease: "backOut" }}
                >
                  <CheckCircle2 className="w-7 h-7 text-amber-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="text-center space-y-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
            >
              <p className="text-sm font-semibold text-white">Login berhasil!</p>
              <p className="text-xs font-mono text-paper-500 tracking-widest uppercase">
                Memuat dashboard…
              </p>
            </motion.div>

            {/* Progress dots */}
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-amber-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.18,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex bg-[#F8F8F8] dark:bg-[#18181B] overflow-hidden">
      {/* Left: decorative panel — slides in from left */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative bg-[#18181B] p-12 flex-col justify-between overflow-hidden border-r border-[#27272A]"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
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

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        >
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-lg shadow-amber-500/25">
            <Image
              src="/profile.jpg"
              alt="Andrian Fakhruza"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          className="relative space-y-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-4xl font-bold text-white leading-tight">
            Kelola portofolio<br />dengan mudah.
          </h2>
          <p className="text-paper-400 text-sm leading-relaxed max-w-xs">
            Dashboard terintegrasi untuk mengelola proyek, artikel, media, dan pesan kontak dalam satu panel.
          </p>
        </motion.div>
      </motion.div>

      {/* Right: Login Form — fades + slides up */}
      <motion.div
        className="flex-1 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#F59E0B]" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
