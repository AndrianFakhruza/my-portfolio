"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pesan.");

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", body: "" });
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 sm:p-10 rounded-3xl border border-amber-200 dark:border-amber-900/40 bg-amber-500/5 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-paper-950 dark:text-paper-50">
          Pesan Berhasil Terkirim!
        </h3>
        <p className="text-sm text-paper-600 dark:text-paper-400 max-w-md mx-auto leading-relaxed">
          Terima kasih telah menghubungi saya. Saya biasanya membalas setiap pesan masuk dalam waktu 1×24 jam kerja.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="btn-modern-secondary mt-2"
        >
          Kirim Pesan Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {error && (
        <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-500/8 flex items-center gap-3 text-sm text-rose-600 dark:text-rose-400 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-paper-600 dark:text-paper-400">
            Nama Lengkap <span className="text-accent-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="mis. Budi Santoso"
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-paper-900/60 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 transition-all shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-paper-600 dark:text-paper-400">
            Alamat Email <span className="text-accent-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="mis. budi@perusahaan.com"
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-paper-900/60 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-paper-600 dark:text-paper-400">
          Topik / Jenis Proyek
        </label>
        <input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="mis. Proyek Website atau Konsultasi UI/UX"
          className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-paper-900/60 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 transition-all shadow-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="body" className="block text-xs font-semibold uppercase tracking-wider text-paper-600 dark:text-paper-400">
          Detail Kebutuhan atau Pertanyaan <span className="text-accent-500">*</span>
        </label>
        <textarea
          id="body"
          rows={5}
          required
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          placeholder="Ceritakan tentang proyek Anda, target waktu, dan ruang lingkup yang direncanakan..."
          className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-paper-900/60 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 transition-all resize-y shadow-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto btn-modern-accent disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Mengirim Pesan...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Kirim Pesan Sekarang
          </>
        )}
      </button>
    </form>
  );
}
