"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2, Send, CheckCircle2, Clock, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteMessageButton } from "./admin-delete-buttons";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  isRead: boolean;
  createdAt: string | Date;
}

export function AdminMessagesView({ initialMessages }: { initialMessages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const toggleReadStatus = async (msg: Message) => {
    try {
      const nextStatus = !msg.isRead;
      const res = await fetch(`/api/messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: nextStatus }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: nextStatus } : m))
        );
        if (selectedMessage?.id === msg.id) {
          setSelectedMessage((prev) => (prev ? { ...prev, isRead: nextStatus } : null));
        }
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openMessageModal = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      toggleReadStatus(msg);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-paper-200 dark:border-paper-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent-500 font-semibold">
            Komunikasi Masuk
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper-950 dark:text-paper-50 mt-1">
            Kotak Pesan Formulir Kontak
          </h1>
          <p className="text-xs font-mono text-paper-500 mt-1">
            Total {messages.length} pesan masuk tersimpan.
          </p>
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="border border-paper-200 dark:border-paper-800 bg-card-bg overflow-x-auto">
        {messages.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-paper-500">
            Kotak pesan masih kosong.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-100/70 dark:bg-paper-900/60 font-mono text-paper-500 uppercase tracking-wider border-b border-paper-200 dark:border-paper-800">
              <tr>
                <th className="py-3 px-4 w-12">Status</th>
                <th className="py-3 px-4">Pengirim & Email</th>
                <th className="py-3 px-4">Subjek / Isi Cuplikan</th>
                <th className="py-3 px-4">Waktu Masuk</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-100 dark:divide-paper-900">
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  onClick={() => openMessageModal(msg)}
                  className={`hover:bg-paper-50/50 dark:hover:bg-paper-900/30 transition-colors cursor-pointer ${
                    !msg.isRead ? "bg-accent-500/5 font-semibold" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    {msg.isRead ? (
                      <span title="Sudah dibaca">
                        <MailOpen className="w-4 h-4 text-paper-400" />
                      </span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-accent-500 block animate-pulse" title="Belum dibaca" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-paper-900 dark:text-paper-100 text-sm">
                      {msg.name}
                    </div>
                    <div className="font-mono text-[11px] text-paper-500">
                      {msg.email}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    {msg.subject && (
                      <div className="text-xs text-accent-500 font-mono">
                        [{msg.subject}]
                      </div>
                    )}
                    <div className="text-xs text-paper-600 dark:text-paper-400 line-clamp-1">
                      {msg.body}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-paper-500 text-[11px]">
                    {formatDate(msg.createdAt)}
                  </td>
                  <td
                    className="py-3 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Diskusi Portofolio Andrian")}`}
                        className="p-1.5 text-paper-600 hover:text-accent-500"
                        title="Balas via Email"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => toggleReadStatus(msg)}
                        className="p-1.5 text-paper-500 hover:text-paper-900 dark:hover:text-paper-100"
                        title={msg.isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                      >
                        {msg.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                      </button>
                      <DeleteMessageButton id={msg.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Message Modal Preview */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl border border-paper-200 dark:border-paper-800 bg-card-bg p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-paper-200 dark:border-paper-800">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-accent-500 font-semibold block">
                  Detail Pesan Masuk
                </span>
                <h2 className="font-display text-xl font-bold text-paper-950 dark:text-paper-50 mt-1">
                  {selectedMessage.subject || "Pesan dari Formulir Web"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-1 text-paper-500 hover:text-paper-900 dark:hover:text-paper-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Metadata */}
            <div className="p-4 bg-paper-100/60 dark:bg-paper-900/40 border border-paper-200/80 dark:border-paper-800 grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-paper-400 block">Pengirim:</span>
                <span className="font-semibold text-paper-900 dark:text-paper-100">{selectedMessage.name}</span>
              </div>
              <div>
                <span className="text-paper-400 block">Email:</span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-semibold text-accent-500 hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div className="col-span-2">
                <span className="text-paper-400 block">Waktu Pengiriman:</span>
                <span className="text-paper-700 dark:text-paper-300">{formatDate(selectedMessage.createdAt)}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-paper-500 block">Isi Pesan:</span>
              <div className="p-4 border border-paper-200 dark:border-paper-800 bg-paper-50 dark:bg-paper-950 text-sm text-paper-800 dark:text-paper-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedMessage.body}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-paper-200 dark:border-paper-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleReadStatus(selectedMessage)}
                className="text-xs font-mono text-paper-600 dark:text-paper-400 hover:text-paper-900 dark:hover:text-paper-100"
              >
                {selectedMessage.isRead ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
              </button>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Diskusi Portofolio Andrian")}`}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-mono uppercase tracking-wider bg-accent-500 hover:bg-accent-600 text-white font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  Balas via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

