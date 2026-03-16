import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Send, TimerReset } from "lucide-react";

import type { CampaignInput, CampaignPayload, TemplatePayload } from "../lib/api";

interface Props {
  templates: TemplatePayload[];
  campaigns: CampaignPayload[];
  loading: boolean;
  onCreate: (input: CampaignInput) => Promise<void>;
  onLaunch: (campaignId: string) => Promise<void>;
}

function formatTime(value: string | null) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusClass(status: CampaignPayload["status"]) {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "processing":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "failed":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

export default function CampaignLaunchpad({ templates, campaigns, loading, onCreate, onLaunch }: Props) {
  const defaultTemplateId = useMemo(() => templates[0]?.id ?? "", [templates]);
  const [form, setForm] = useState({
    name: "Monthly Product Update",
    templateId: defaultTemplateId,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  useEffect(() => {
    setForm((current) => current.templateId ? current : { ...current, templateId: defaultTemplateId });
  }, [defaultTemplateId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onCreate(form);
      setForm((current) => ({ ...current, name: `${current.name} Draft` }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLaunch(campaignId: string) {
    setLaunchingId(campaignId);
    setError(null);

    try {
      await onLaunch(campaignId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to launch campaign");
    } finally {
      setLaunchingId(null);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-10 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]"
    >
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Campaign Launchpad</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Prepare a send</h2>
          </div>
          <div className="rounded-2xl bg-fuchsia-50 p-3 text-fuchsia-600">
            <Send size={20} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-fuchsia-400 focus:bg-white focus:ring-4 focus:ring-fuchsia-100"
            placeholder="Campaign name"
          />
          <select
            value={form.templateId}
            onChange={(event) => setForm((current) => ({ ...current, templateId: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-fuchsia-400 focus:bg-white focus:ring-4 focus:ring-fuchsia-100"
          >
            <option value="">Select template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting || !form.templateId}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <TimerReset size={16} />
            {submitting ? "Creating..." : "Create Campaign"}
          </button>
        </form>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Campaign Queue</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Drafts and launches</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {loading ? "Loading..." : `${campaigns.length} campaigns`}
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {campaigns.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">No campaigns yet.</p>
          ) : (
            campaigns.slice(0, 6).map((campaign) => (
              <div key={campaign.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{campaign.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                      recipients {campaign.recipientCount} • {formatTime(campaign.scheduledAt ?? campaign.launchedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass(campaign.status)}`}>
                      {campaign.status}
                    </span>
                    <button
                      onClick={() => void handleLaunch(campaign.id)}
                      disabled={launchingId === campaign.id || !["draft", "scheduled"].includes(campaign.status)}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Play size={14} />
                      {launchingId === campaign.id ? "Launching..." : "Launch"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}
