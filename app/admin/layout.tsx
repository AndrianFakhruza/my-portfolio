"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  FileText,
  Image as ImageIcon,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, desc: "Ringkasan & metrik" },
  { name: "Tentang", href: "/admin/about", icon: UserCircle, desc: "Edit halaman tentang" },
  { name: "Proyek", href: "/admin/projects", icon: FolderKanban, desc: "Kelola karya" },
  { name: "Kategori", href: "/admin/categories", icon: Tags, desc: "Kelola kategori" },
  { name: "Artikel Blog", href: "/admin/posts", icon: FileText, desc: "Tulis & edit artikel" },
  { name: "Media", href: "/admin/media", icon: ImageIcon, desc: "Pustaka file" },
  { name: "Pesan Masuk", href: "/admin/messages", icon: Mail, desc: "Kontak & pesan" },
];

// Batas waktu tidak aktif (inaktivitas): 30 Menit
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const isLoggingOutRef = useRef(false);

  const handleLogout = useCallback(
    async (reason?: string) => {
      if (isLoggingOutRef.current) return;
      isLoggingOutRef.current = true;
      setLoggingOut(true);

      const target = reason ? `/admin/login?reason=${reason}` : "/admin/login";

      // Fallback timer: navigasi paksa jika ada hambatan dalam 1.2 detik
      const fallbackTimer = setTimeout(() => {
        window.location.href = target;
      }, 1200);

      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_last_activity");
        }
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        // Beri jeda singkat untuk transisi animasi fade-out
        await new Promise((resolve) => setTimeout(resolve, 350));
        clearTimeout(fallbackTimer);
        window.location.href = target;
      } catch (e) {
        console.error("Logout error", e);
        clearTimeout(fallbackTimer);
        window.location.href = target;
      }
    },
    []
  );

  // Inactivity tracking (Auto-logout jika tidak ada aktivitas selama 30 menit)
  useEffect(() => {
    if (pathname === "/admin/login") return;

    const updateActivity = () => {
      localStorage.setItem("admin_last_activity", Date.now().toString());
    };

    // PENTING: Selalu set waktu aktivitas terbaru saat halaman admin aktif dimuat
    updateActivity();

    const checkInactivity = () => {
      if (isLoggingOutRef.current) return;
      const last = localStorage.getItem("admin_last_activity");
      if (last) {
        const elapsed = Date.now() - parseInt(last, 10);
        if (elapsed > INACTIVITY_TIMEOUT_MS) {
          handleLogout("inactive");
        }
      } else {
        updateActivity();
      }
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    const handleUserActivity = () => {
      updateActivity();
    };

    events.forEach((evt) =>
      window.addEventListener(evt, handleUserActivity, { passive: true })
    );

    // Cek berkala setiap 15 detik
    const interval = setInterval(checkInactivity, 15000);

    // Cek juga saat tab aktif kembali
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkInactivity();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", checkInactivity);

    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, handleUserActivity)
      );
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", checkInactivity);
    };
  }, [pathname, handleLogout]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const currentPage = NAV_ITEMS.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#F8F8F8] dark:bg-[#18181B] text-[#18181B] dark:text-[#F8F8F8]">
      {/* ─── Sidebar Desktop (Fixed, Tidak ikut scroll halaman) ─── */}
      <aside className="hidden lg:flex w-60 flex-col flex-shrink-0 h-full bg-white dark:bg-[#18181B] border-r border-[#E4E4E7] dark:border-[#27272A] z-20">
        {/* Logo & Profil Brand */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[#E4E4E7] dark:border-[#27272A] flex-shrink-0">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-500/40 shadow-sm shadow-amber-500/20 flex-shrink-0">
            <Image
              src="/profile.png"
              alt="Andrian Fakhruza"
              fill
              sizes="32px"
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-sm tracking-tight text-[#18181B] dark:text-[#F8F8F8] truncate">
              Andrian Fakhruza
            </p>
            <p className="text-[10px] text-paper-400 dark:text-paper-500 font-medium">
              CMS Panel
            </p>
          </div>
        </div>

        {/* Navigasi (Dapat di-scroll internal jika layar pendek) */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-paper-400 dark:text-paper-500">
            Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-amber-500/15 text-amber-600 dark:text-[#F59E0B] font-semibold"
                    : "text-paper-600 dark:text-paper-400 hover:bg-paper-100 dark:hover:bg-[#27272A] hover:text-[#18181B] dark:hover:text-[#F8F8F8]"
                )}
              >
                <span
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    isActive
                      ? "bg-amber-500/20 text-amber-600 dark:text-[#F59E0B]"
                      : "bg-paper-100 dark:bg-[#27272A] text-paper-500 dark:text-paper-400 group-hover:bg-paper-200 dark:group-hover:bg-[#3F3F46]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 text-[#F59E0B]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bagian Bawah (Logout & Live site) */}
        <div className="p-3 border-t border-[#E4E4E7] dark:border-[#27272A] space-y-1 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-paper-500 dark:text-paper-400 hover:bg-paper-100 dark:hover:bg-[#27272A] hover:text-[#18181B] dark:hover:text-[#F8F8F8] transition-all group"
          >
            <span className="w-8 h-8 rounded-lg bg-paper-100 dark:bg-[#27272A] flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-4 h-4" />
            </span>
            <span>Lihat Situs</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer group"
          >
            <span className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-4 h-4" />
            </span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area (Scroll internal mandiri) ─── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar (Fixed di atas konten) */}
        <header className="h-16 flex-shrink-0 bg-white/80 dark:bg-[#18181B]/80 backdrop-blur-md border-b border-[#E4E4E7] dark:border-[#27272A] px-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-paper-600 dark:text-paper-400 hover:bg-paper-100 dark:hover:bg-[#27272A] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-paper-400 dark:text-paper-500 hidden sm:inline">Admin</span>
              {currentPage && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-paper-300 dark:text-paper-600 hidden sm:inline" />
                  <span className="font-semibold text-paper-800 dark:text-paper-200">
                    {currentPage.name}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E4E4E7] dark:border-[#27272A] text-paper-600 dark:text-paper-400 hover:border-[#F59E0B] hover:text-[#F59E0B] dark:hover:text-[#F59E0B] transition-all"
            >
              Live Site
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* Avatar Profil Foto User */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-paper-200 dark:border-paper-700 shadow-sm flex-shrink-0" title="Andrian Fakhruza">
              <Image
                src="/profile.png"
                alt="Andrian Fakhruza"
                fill
                sizes="32px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </header>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#18181B] border-b border-[#E4E4E7] dark:border-[#27272A] p-3 space-y-0.5 shadow-lg flex-shrink-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-amber-500/15 text-amber-600 dark:text-[#F59E0B] font-semibold"
                      : "text-paper-600 dark:text-paper-400 hover:bg-paper-100 dark:hover:bg-[#27272A]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutModal(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        )}

        {/* Area Konten Utama (Scrollable secara mandiri) */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait" initial={true}>
            <motion.div
              key={pathname}
              className="max-w-7xl w-full mx-auto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ─── Full-page fade-out overlay saat logout ─── */}
      <AnimatePresence>
        {loggingOut && (
          <motion.div
            className="fixed inset-0 z-[999] bg-[#18181B] flex flex-col items-center justify-center gap-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.3, ease: "easeOut" }}
              className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center"
            >
              <LogOut className="w-5 h-5 text-rose-400" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="text-xs font-mono text-paper-400 tracking-widest uppercase"
            >
              Keluar dari sesi…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Modal Konfirmasi Keluar ─── */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop blur */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowLogoutModal(false)}
            />

            {/* Dialog card */}
            <motion.div
              className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-[#1f1f23] border border-paper-200 dark:border-paper-800 p-6 shadow-2xl space-y-4"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0"
                  initial={{ rotate: -12, scale: 0.7 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3, ease: "backOut" }}
                >
                  <LogOut className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="font-display font-bold text-base text-paper-900 dark:text-paper-100">
                    Konfirmasi Keluar
                  </h3>
                  <p className="text-xs text-paper-500 dark:text-paper-400">
                    Panel Administrator
                  </p>
                </div>
              </div>

              <p className="text-sm text-paper-600 dark:text-paper-300 leading-relaxed">
                Apakah Anda yakin ingin keluar dari panel admin? Anda harus memasukkan kredensial lagi untuk login kembali.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-paper-200 dark:border-paper-700 text-paper-700 dark:text-paper-300 hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutModal(false);
                    handleLogout();
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Ya, Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
