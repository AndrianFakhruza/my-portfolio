"use client";

import { useState, useEffect, useCallback } from "react";
import {
  User, Briefcase, Wrench, Save, Plus, Trash2, Edit3,
  CheckCircle, XCircle, Loader2, GripVertical, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────── */
interface Profile {
  id?: string;
  name: string;
  tagline: string;
  bio1: string;
  bio2: string;
  location: string;
  cvUrl: string;
}

interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
  order: number;
}

interface Capability {
  id: string;
  title: string;
  skills: string;
  order: number;
}

type Tab = "profile" | "experience" | "capability";
type SaveState = "idle" | "saving" | "success" | "error";

/* ─── Toast helper ───────────────────────────────────── */
function Toast({ state, msg }: { state: SaveState; msg?: string }) {
  if (state === "idle") return null;
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold border transition-all",
      state === "saving" && "bg-white dark:bg-paper-800 border-paper-200 dark:border-paper-700 text-paper-700 dark:text-paper-300",
      state === "success" && "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
      state === "error" && "bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400",
    )}>
      {state === "saving" && <Loader2 className="w-4 h-4 animate-spin" />}
      {state === "success" && <CheckCircle className="w-4 h-4" />}
      {state === "error" && <XCircle className="w-4 h-4" />}
      {state === "saving" ? "Menyimpan..." : state === "success" ? (msg ?? "Tersimpan!") : "Gagal menyimpan"}
    </div>
  );
}

/* ─── Input / Textarea helpers ───────────────────────── */
const inputCls = "w-full px-3 py-2 text-sm rounded-xl border border-paper-200 dark:border-paper-700 bg-white dark:bg-paper-900 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all";
const labelCls = "block text-xs font-semibold text-paper-500 dark:text-paper-400 mb-1.5 uppercase tracking-wider";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════ */
export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMsg, setSaveMsg] = useState("");

  const showSave = (state: SaveState, msg?: string) => {
    setSaveState(state);
    setSaveMsg(msg ?? "");
    if (state === "success" || state === "error") {
      setTimeout(() => setSaveState("idle"), 2500);
    }
  };

  /* ─── Profile Tab ─────────────────────────────────── */
  const [profile, setProfile] = useState<Profile>({
    name: "", tagline: "", bio1: "", bio2: "", location: "", cvUrl: "",
  });

  useEffect(() => {
    fetch("/api/about").then(r => r.json()).then(d => { if (d) setProfile(d); });
  }, []);

  const saveProfile = async () => {
    showSave("saving");
    try {
      const r = await fetch("/api/about", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
      if (!r.ok) throw new Error();
      showSave("success", "Profil berhasil disimpan!");
    } catch { showSave("error"); }
  };

  /* ─── Experience Tab ──────────────────────────────── */
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [newExp, setNewExp] = useState(false);
  const blankExp = (): Experience => ({ id: "", period: "", role: "", company: "", description: "", order: 0 });

  useEffect(() => {
    fetch("/api/experiences").then(r => r.json()).then(setExperiences);
  }, []);

  const saveExp = async (exp: Experience) => {
    showSave("saving");
    try {
      const isNew = !exp.id;
      const r = await fetch(isNew ? "/api/experiences" : `/api/experiences/${exp.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exp),
      });
      if (!r.ok) throw new Error();
      const saved = await r.json();
      setExperiences(prev => isNew ? [...prev, saved] : prev.map(e => e.id === saved.id ? saved : e));
      setEditingExp(null);
      setNewExp(false);
      showSave("success", isNew ? "Pengalaman ditambahkan!" : "Pengalaman diperbarui!");
    } catch { showSave("error"); }
  };

  const deleteExp = async (id: string) => {
    if (!confirm("Hapus pengalaman ini?")) return;
    showSave("saving");
    try {
      await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      setExperiences(prev => prev.filter(e => e.id !== id));
      showSave("success", "Dihapus");
    } catch { showSave("error"); }
  };

  /* ─── Capability Tab ──────────────────────────────── */
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [editingCap, setEditingCap] = useState<Capability | null>(null);
  const [newCap, setNewCap] = useState(false);
  const blankCap = (): Capability => ({ id: "", title: "", skills: "", order: 0 });

  useEffect(() => {
    fetch("/api/capabilities").then(r => r.json()).then(setCapabilities);
  }, []);

  const saveCap = async (cap: Capability) => {
    showSave("saving");
    try {
      const isNew = !cap.id;
      const r = await fetch(isNew ? "/api/capabilities" : `/api/capabilities/${cap.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cap),
      });
      if (!r.ok) throw new Error();
      const saved = await r.json();
      setCapabilities(prev => isNew ? [...prev, saved] : prev.map(c => c.id === saved.id ? saved : c));
      setEditingCap(null);
      setNewCap(false);
      showSave("success", isNew ? "Kapabilitas ditambahkan!" : "Kapabilitas diperbarui!");
    } catch { showSave("error"); }
  };

  const deleteCap = async (id: string) => {
    if (!confirm("Hapus kapabilitas ini?")) return;
    showSave("saving");
    try {
      await fetch(`/api/capabilities/${id}`, { method: "DELETE" });
      setCapabilities(prev => prev.filter(c => c.id !== id));
      showSave("success", "Dihapus");
    } catch { showSave("error"); }
  };

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "profile", label: "Profil & Bio", icon: User },
    { key: "experience", label: "Pengalaman", icon: Briefcase },
    { key: "capability", label: "Kapabilitas", icon: Wrench },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-widest mb-1">Halaman Tentang</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper-900 dark:text-paper-50">
            Edit Tentang Saya
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-paper-100 dark:bg-paper-900 rounded-2xl w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              activeTab === key
                ? "bg-white dark:bg-paper-800 text-paper-900 dark:text-paper-100 shadow-sm"
                : "text-paper-500 dark:text-paper-400 hover:text-paper-800 dark:hover:text-paper-200",
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Profile Tab ─────────────────────────────────── */}
      {activeTab === "profile" && (
        <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-paper-200/80 dark:border-paper-800/80 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-paper-800 dark:text-paper-200 text-base flex items-center gap-2">
            <User className="w-4 h-4 text-[#F59E0B]" /> Informasi Profil
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama">
              <input className={inputCls} value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Nama lengkap" />
            </Field>
            <Field label="Lokasi">
              <input className={inputCls} value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} placeholder="Kota, Provinsi" />
            </Field>
          </div>

          <Field label="Tagline (kalimat pembuka singkat)">
            <input className={inputCls} value={profile.tagline} onChange={e => setProfile(p => ({ ...p, tagline: e.target.value }))} placeholder="Web Developer & UI Designer berbasis di..." />
          </Field>

          <Field label="Bio — Paragraf 1">
            <textarea rows={3} className={inputCls} value={profile.bio1} onChange={e => setProfile(p => ({ ...p, bio1: e.target.value }))} placeholder="Deskripsi diri singkat..." />
          </Field>

          <Field label="Bio — Paragraf 2">
            <textarea rows={3} className={inputCls} value={profile.bio2} onChange={e => setProfile(p => ({ ...p, bio2: e.target.value }))} placeholder="Kalimat tambahan tentang diri Anda..." />
          </Field>

          <Field label="URL / Path File CV (contoh: /cv-andrian-resume.pdf)">
            <input className={inputCls} value={profile.cvUrl ?? ""} onChange={e => setProfile(p => ({ ...p, cvUrl: e.target.value }))} placeholder="/cv-andrian-resume.pdf" />
          </Field>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={saveProfile}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] shadow-md shadow-amber-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              Simpan Profil
            </button>
          </div>
        </div>
      )}

      {/* ── Experience Tab ────────────────────────────────── */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-paper-500 dark:text-paper-400">{experiences.length} entri pengalaman</p>
            <button
              type="button"
              onClick={() => { setNewExp(true); setEditingExp(blankExp()); }}
              disabled={newExp}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {/* New Experience Form */}
          {newExp && editingExp && !editingExp.id && (
            <ExpForm exp={editingExp} onChange={setEditingExp} onSave={() => saveExp(editingExp)} onCancel={() => { setNewExp(false); setEditingExp(null); }} isNew />
          )}

          {experiences.map(exp => (
            <div key={exp.id}>
              {editingExp?.id === exp.id ? (
                <ExpForm exp={editingExp} onChange={setEditingExp} onSave={() => saveExp(editingExp)} onCancel={() => setEditingExp(null)} />
              ) : (
                <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-paper-200/80 dark:border-paper-800/80 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-paper-900 dark:text-paper-100 text-sm">{exp.role}</h3>
                      <p className="text-xs text-[#F59E0B] font-medium mt-0.5">{exp.company}</p>
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-paper-100 dark:bg-paper-800 text-paper-600 dark:text-paper-400 border border-paper-200 dark:border-paper-700">
                        {exp.period}
                      </span>
                      <p className="text-xs text-paper-500 dark:text-paper-400 mt-2 leading-relaxed">{exp.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button type="button" onClick={() => setEditingExp({ ...exp })} className="p-2 rounded-lg text-paper-400 hover:text-[#F59E0B] hover:bg-amber-500/10 transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => deleteExp(exp.id)} className="p-2 rounded-lg text-paper-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Capability Tab ────────────────────────────────── */}
      {activeTab === "capability" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-paper-500 dark:text-paper-400">{capabilities.length} kategori kapabilitas</p>
            <button
              type="button"
              onClick={() => { setNewCap(true); setEditingCap(blankCap()); }}
              disabled={newCap}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {/* New Capability Form */}
          {newCap && editingCap && !editingCap.id && (
            <CapForm cap={editingCap} onChange={setEditingCap} onSave={() => saveCap(editingCap)} onCancel={() => { setNewCap(false); setEditingCap(null); }} isNew />
          )}

          {capabilities.map(cap => (
            <div key={cap.id}>
              {editingCap?.id === cap.id ? (
                <CapForm cap={editingCap} onChange={setEditingCap} onSave={() => saveCap(editingCap)} onCancel={() => setEditingCap(null)} />
              ) : (
                <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-paper-200/80 dark:border-paper-800/80 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-paper-900 dark:text-paper-100 text-sm mb-2">{cap.title}</h3>
                      <ul className="space-y-1">
                        {cap.skills.split("\n").filter(Boolean).map((s, i) => (
                          <li key={i} className="text-xs text-paper-500 dark:text-paper-400 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#F59E0B] shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button type="button" onClick={() => setEditingCap({ ...cap })} className="p-2 rounded-lg text-paper-400 hover:text-[#F59E0B] hover:bg-amber-500/10 transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => deleteCap(cap.id)} className="p-2 rounded-lg text-paper-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Toast state={saveState} msg={saveMsg} />
    </div>
  );
}

/* ─── Experience Form ─────────────────────────────────── */
function ExpForm({
  exp, onChange, onSave, onCancel, isNew,
}: {
  exp: Experience;
  onChange: (e: Experience) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}) {
  const inputCls = "w-full px-3 py-2 text-sm rounded-xl border border-paper-200 dark:border-paper-700 bg-white dark:bg-paper-900 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all";
  return (
    <div className="bg-amber-50/60 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800/60 p-5 space-y-4">
      <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest">{isNew ? "Tambah Pengalaman Baru" : "Edit Pengalaman"}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-paper-500 mb-1.5">Jabatan / Role</label>
          <input className={inputCls} value={exp.role} onChange={e => onChange({ ...exp, role: e.target.value })} placeholder="Web Developer" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-paper-500 mb-1.5">Perusahaan / Institusi</label>
          <input className={inputCls} value={exp.company} onChange={e => onChange({ ...exp, company: e.target.value })} placeholder="PT. Contoh" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-paper-500 mb-1.5">Periode / Label</label>
          <input className={inputCls} value={exp.period} onChange={e => onChange({ ...exp, period: e.target.value })} placeholder="Jan 2023 – Des 2024" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-paper-500 mb-1.5">Urutan Tampil</label>
          <input type="number" className={inputCls} value={exp.order} onChange={e => onChange({ ...exp, order: Number(e.target.value) })} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-paper-500 mb-1.5">Deskripsi</label>
        <textarea rows={3} className={inputCls} value={exp.description} onChange={e => onChange({ ...exp, description: e.target.value })} placeholder="Deskripsi singkat pekerjaan atau kegiatan..." />
      </div>
      <div className="flex items-center gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-xl border border-paper-200 dark:border-paper-700 text-paper-600 dark:text-paper-400 hover:border-paper-400 transition-all">
          Batal
        </button>
        <button type="button" onClick={onSave} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] transition-all">
          <Save className="w-3.5 h-3.5" /> Simpan
        </button>
      </div>
    </div>
  );
}

/* ─── Capability Form ─────────────────────────────────── */
function CapForm({
  cap, onChange, onSave, onCancel, isNew,
}: {
  cap: Capability;
  onChange: (c: Capability) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}) {
  const inputCls = "w-full px-3 py-2 text-sm rounded-xl border border-paper-200 dark:border-paper-700 bg-white dark:bg-paper-900 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all";
  return (
    <div className="bg-amber-50/60 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800/60 p-5 space-y-4">
      <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest">{isNew ? "Tambah Kapabilitas Baru" : "Edit Kapabilitas"}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-paper-500 mb-1.5">Judul Kategori</label>
          <input className={inputCls} value={cap.title} onChange={e => onChange({ ...cap, title: e.target.value })} placeholder="Web Development" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-paper-500 mb-1.5">Urutan Tampil</label>
          <input type="number" className={inputCls} value={cap.order} onChange={e => onChange({ ...cap, order: Number(e.target.value) })} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-paper-500 mb-1.5">
          Daftar Skill <span className="normal-case font-normal text-paper-400">(satu baris = satu skill)</span>
        </label>
        <textarea
          rows={6}
          className={inputCls + " font-mono text-xs"}
          value={cap.skills}
          onChange={e => onChange({ ...cap, skills: e.target.value })}
          placeholder={"Next.js & React\nTypeScript\nTailwind CSS"}
        />
      </div>
      <div className="flex items-center gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-xl border border-paper-200 dark:border-paper-700 text-paper-600 dark:text-paper-400 hover:border-paper-400 transition-all">
          Batal
        </button>
        <button type="button" onClick={onSave} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] transition-all">
          <Save className="w-3.5 h-3.5" /> Simpan
        </button>
      </div>
    </div>
  );
}

