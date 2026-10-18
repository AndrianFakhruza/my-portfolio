"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, Github, Linkedin } from "lucide-react";

const NAV_LINKS = [
  { name: "Koleksi Karya", href: "/projects" },
  { name: "Tentang Andrian", href: "/about" },
  { name: "Hubungi Saya", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "Email", href: "mailto:fakhruzaandrian561@gmail.com", icon: Mail },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-paper-200/80 dark:border-paper-800/80 bg-white/80 dark:bg-paper-950/80 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Left: Identity */}
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-accent-500/30 shrink-0 shadow-sm">
              <Image
                src="/profile.png"
                alt="Andrian Fakhruza"
                fill
                className="object-cover"
                sizes="28px"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-paper-800 dark:text-paper-200">Andrian Fakhruza</span>
              <span className="text-[11px] text-paper-400 dark:text-paper-500">Web Developer &amp; UI Designer</span>
            </div>
            <span className="hidden sm:inline text-paper-300 dark:text-paper-700 text-xs mx-1">·</span>
            <span className="hidden sm:inline text-[11px] text-paper-400">
              © {new Date().getFullYear()}
            </span>
          </div>

          {/* Center: Nav Links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-semibold text-paper-500 dark:text-paper-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors uppercase tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right: Socials + Scroll to top */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  title={s.label}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-paper-400 dark:text-paper-500 hover:text-accent-500 hover:bg-accent-500/10 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
            <span className="text-paper-200 dark:text-paper-800 text-xs">|</span>
            <button
              type="button"
              onClick={scrollToTop}
              title="Kembali ke atas"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-paper-400 dark:text-paper-500 hover:text-accent-500 hover:bg-accent-500/10 transition-all text-sm font-bold"
            >
              ↑
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
