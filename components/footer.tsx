"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Mail, Github, Linkedin, ArrowUp } from "lucide-react";

const NAV_LINKS = [
  { name: "Beranda", href: "/" },
  { name: "Koleksi Karya", href: "/projects" },
  { name: "Tentang Andrian", href: "/about" },
  { name: "Hubungi Saya", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/AndrianFakhruza", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/andrian-fakhruza", icon: Linkedin },
  { label: "Email", href: "mailto:fakhruzaandrian561@gmail.com", icon: Mail },
];

const STACK_ITEMS = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "Figma"];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#18181B] text-white">
      {/* ── CTA Section ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-12 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-accent-500/60 ring-offset-2 ring-offset-[#18181B] shrink-0">
              <Image
                src="/profile.png"
                alt="Andrian Fakhruza"
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div>
              <p className="text-base font-bold text-white font-display">Andrian Fakhruza</p>
              <p className="text-sm text-white/50">Web Developer &amp; UI Designer</p>
            </div>
          </div>

          {/* CTA Text */}
          <div className="md:text-center">
            <p className="text-lg sm:text-xl font-bold text-white font-display leading-snug">
              Mari wujudkan ide digital yang{" "}
              <span className="text-accent-500">berkesan</span>.
            </p>
            <p className="text-sm text-white/50 mt-1">
              Tersedia untuk kolaborasi, freelance, &amp; proyek kreatif.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-3 md:shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Hubungi Saya
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:fakhruzaandrian561@gmail.com"
              className="text-sm text-white/40 hover:text-accent-400 transition-colors hidden sm:inline"
            >
              fakhruzaandrian561@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Link Grid ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          {/* Navigasi */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-4">
              Navigasi
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-accent-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kanal Sosial */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-4">
              Kanal Sosial
            </p>
            <ul className="space-y-2.5">
              {SOCIAL_LINKS.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-accent-400 transition-colors group"
                    >
                      <Icon className="w-3.5 h-3.5 text-white/30 group-hover:text-accent-400 transition-colors" />
                      {s.label}
                      {!s.href.startsWith("mailto") && (
                        <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-accent-400 transition-colors" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Stack & Tools */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-4">
              Stack &amp; Tools
            </p>
            <div className="flex flex-wrap gap-2">
              {STACK_ITEMS.map((item) => (
                <span
                  key={item}
                  className="text-xs text-white/50 border border-white/10 rounded-lg px-2.5 py-1 bg-white/5"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-[12px] text-white/30">
            © {new Date().getFullYear()} Andrian Fakhruza · All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            title="Kembali ke atas"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-[12px] text-white/30 hover:text-accent-400 transition-colors group"
          >
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            Kembali ke atas
          </button>
        </div>
      </div>
    </footer>
  );
}
