import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";

import type { TemplateInput, TemplatePayload } from "../lib/api";

interface Props {
  templates: TemplatePayload[];
  loading: boolean;
  onCreate: (input: TemplateInput) => Promise<void>;
}

export default function TemplateStudio({ templates, loading, onCreate }: Props) {
  const [form, setForm] = useState({
    name: "Welcome Sequence",
    subject: "InfoPulse update for {{name}}",
    bodyHtml: "<p>Hello {{name}},</p><p>This is your latest InfoPulse update.</p>",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onCreate({ ...form, variables: ["name"] });
      setForm((current) => ({ ...current, name: `${current.name} Copy` }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create template");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"
    >
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Template Studio</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Create an email template</h2>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
            <FileText size={20} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            placeholder="Template name"
          />
          <input
            value={form.subject}
            onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            placeholder="Email subject"
          />
          <textarea
            value={form.bodyHtml}
            onChange={(event) => setForm((current) => ({ ...current, bodyHtml: event.target.value }))}
            className="min-h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            placeholder="Email HTML body"
          />
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles size={16} />
            {submitting ? "Saving..." : "Create Template"}
          </button>
        </form>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Saved Templates</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Ready to reuse</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {loading ? "Loading..." : `${templates.length} templates`}
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {templates.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">No templates created yet.</p>
          ) : (
            templates.slice(0, 5).map((template) => (
              <div key={template.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                <p className="mt-1 text-sm text-slate-500">{template.subject}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Variables: {template.variables.length > 0 ? template.variables.join(", ") : "none"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}
