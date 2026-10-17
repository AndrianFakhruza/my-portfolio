"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Dashboard", href: "/" },
  { name: "Karya", href: "/projects" },
  { name: "Tentang", href: "/about" },
  { name: "Kontak", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Do not show public navbar on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        className={cn(
          "pointer-events-auto w-full max-w-4xl rounded-full px-4 sm:px-6 py-2.5 transition-all duration-300 flex items-center justify-between",
          scrolled
            ? "bg-white/85 dark:bg-paper-950/85 backdrop-blur-xl border border-paper-200/80 dark:border-paper-800/80 shadow-xl shadow-black/5"
            : "bg-white/70 dark:bg-paper-950/70 backdrop-blur-lg border border-paper-200/60 dark:border-paper-800/60 shadow-md shadow-black/5"
        )}
      >
        {/* Brand Logo & Name + Role */}
        <Link
          href="/"
          className="group flex items-center gap-3 py-1 text-paper-900 dark:text-paper-100"
        >
          <div className="relative w-8 sm:w-9 h-8 sm:h-9 rounded-full overflow-hidden border-2 border-[#F59E0B]/60 shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Image
              src="/profile.png"
              alt="Andrian Fakhruza"
              fill
              className="object-cover"
              sizes="36px"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm sm:text-base tracking-tight leading-none group-hover:text-accent-500 transition-colors">
              Andrian Fakhruza
            </span>
            <span className="text-[10px] sm:text-[11px] font-sans font-medium text-paper-500 dark:text-paper-400 tracking-wide mt-0.5 leading-none">
              Web Developer &amp; UI Designer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-paper-100/70 dark:bg-paper-900/60 rounded-full border border-paper-200/50 dark:border-paper-800/50 text-xs font-medium">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-1.5 rounded-full transition-all duration-200",
                  isActive
                    ? "bg-white dark:bg-paper-800 text-paper-900 dark:text-white shadow-sm font-semibold"
                    : "text-paper-600 dark:text-paper-400 hover:text-paper-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-paper-800/50"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Theme toggle + Let's Talk CTA */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-accent-500 text-[#18181B] hover:bg-accent-600 hover:text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Mulai Diskusi</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-paper-700 dark:text-paper-300 hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Modal */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-16 inset-x-4 max-w-sm mx-auto rounded-3xl p-5 border border-paper-200/80 dark:border-paper-800/80 bg-white/95 dark:bg-paper-950/95 backdrop-blur-2xl shadow-2xl space-y-4 md:hidden animate-in fade-in zoom-in-95 duration-200">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-2xl text-sm font-medium transition-colors flex items-center justify-between",
                    isActive
                      ? "bg-accent-50 dark:bg-accent-500/15 text-accent-500 dark:text-accent-400 font-bold"
                      : "text-paper-700 dark:text-paper-300 hover:bg-paper-100 dark:hover:bg-paper-800"
                  )}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-paper-100 dark:border-paper-800">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-accent-500 text-[#18181B] hover:bg-accent-600 hover:text-white shadow-lg shadow-amber-500/25 transition-all"
            >
              Mulai Diskusi Proyek
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
