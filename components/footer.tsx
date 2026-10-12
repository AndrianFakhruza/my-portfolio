"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, Github, Linkedin } from "lucide-react";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-paper-200/80 dark:border-paper-800/80 bg-white dark:bg-paper-950 transition-colors">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-8">
        {/* Top: Headline + Email */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-10 border-b border-paper-200/80 dark:border-paper-800/80">
          <div className="lg:col-span-6 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-paper-100 dark:bg-paper-800 text-[#18181B] dark:text-[#F8F8F8] border border-paper-200/80 dark:border-paper-700/80">
              Tersedia untuk kolaborasi
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-paper-900 dark:text-paper-100 leading-tight">
              Mengembangkan solusi web modern, antarmuka intuitif, dan teknologi cerdas bersama.
            </h2>
            <a
              href="mailto:fakhruzaandrian561@gmail.com"
              className="inline-flex items-center gap-2.5 text-base sm:text-lg font-semibold text-accent-500 hover:text-accent-600 transition-colors group pt-1"
            >
              <Mail className="w-5 h-5 shrink-0" />
              <span className="underline decoration-2 decoration-accent-500/30 underline-offset-4 group-hover:decoration-accent-500 transition-all">
                fakhruzaandrian561@gmail.com
              </span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-8">
            {/* Navigation Column */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-paper-400">
                Navigasi
              </h3>
              <ul className="space-y-2.5 text-sm font-medium">
                {[
                  { name: "Koleksi Karya", href: "/projects" },
                  { name: "Tentang Andrian", href: "/about" },
                  { name: "Hubungi Saya", href: "/contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-paper-600 dark:text-paper-400 hover:text-accent-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Column */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-paper-400">
                Kanal
              </h3>
              <ul className="space-y-2.5 text-sm font-medium">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-paper-600 dark:text-paper-400 hover:text-accent-500 transition-colors group"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{social.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-paper-500 font-medium">
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#F59E0B]/40 shrink-0">
              <Image
                src="/profile.jpg"
                alt="Andrian Fakhruza"
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <span>© {new Date().getFullYear()} Andrian Fakhruza. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-accent-500 transition-colors cursor-pointer"
            >
              ↑ Kembali ke atas
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
