import { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Hubungi Andrian Fakhruza",
  description:
    "Mulai diskusi kolaborasi proyek Web Development, UI Design, Data Science, atau Machine Learning dengan Andrian Fakhruza.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pt-24 sm:pt-28 pb-12 sm:pb-16">
        {/* Ambient glow */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent-500/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="max-w-3xl space-y-4 mb-8">
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-paper-950 dark:text-paper-50 leading-[1.08]">
              Mari Berdiskusi
            </h1>
            <p className="text-base sm:text-lg text-paper-600 dark:text-paper-400 leading-relaxed">
              Apakah Anda memiliki produk yang ingin dibangun dari nol, perlu merombak sistem desain yang usang, atau mencari desainer-engineer untuk tim Anda? Tinggalkan pesan di bawah.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Form — Left / Main */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-3xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-card">
                <h2 className="font-display text-lg sm:text-xl font-bold text-paper-900 dark:text-paper-100 mb-6">
                  Formulir Kontak Langsung
                </h2>
                <ContactForm />
              </div>
            </div>

            {/* Info — Right Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              {/* Contact Info Card */}
              <div className="p-6 sm:p-8 rounded-3xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-soft space-y-5">
                <h3 className="font-display text-base sm:text-lg font-bold text-paper-900 dark:text-paper-100 pb-3 border-b border-paper-100 dark:border-paper-900">
                  Informasi Kontak
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-paper-400 block mb-0.5">Email Langsung</span>
                      <a
                        href="mailto:fakhruzaandrian561@gmail.com"
                        className="text-sm font-semibold text-paper-900 dark:text-paper-100 hover:text-accent-500 transition-colors"
                      >
                        fakhruzaandrian561@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-paper-400 block mb-0.5">Lokasi Utama</span>
                      <p className="text-sm font-medium text-paper-700 dark:text-paper-300">
                        Lhokseumawe, Aceh, Indonesia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
