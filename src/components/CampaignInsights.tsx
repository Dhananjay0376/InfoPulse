import { motion } from "framer-motion";
import { BarChart3, MailCheck, MailWarning, SendHorizonal } from "lucide-react";

import type { CampaignDeliverySummary, CampaignPayload, DeliveryPayload } from "../lib/api";

interface Props {
  campaign: CampaignPayload | null;
  summary: CampaignDeliverySummary;
  deliveries: DeliveryPayload[];
  loading: boolean;
}

function metric(value: number | undefined) {
  return value ?? 0;
}

export default function CampaignInsights({ campaign, summary, deliveries, loading }: Props) {
  const cards = [
    { label: "Accepted", value: metric(summary.accepted) + metric(summary.delivered), icon: MailCheck, tone: "emerald" },
    { label: "Failed", value: metric(summary.failed) + metric(summary.bounced) + metric(summary.complained), icon: MailWarning, tone: "rose" },
    { label: "Queued", value: metric(summary.queued), icon: SendHorizonal, tone: "amber" },
  ] as const;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24 }}
      className="mt-10 overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
    >
      <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Campaign Insights</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">
              {campaign ? campaign.name : "Select a campaign"}
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-slate-600">
            <BarChart3 size={20} />
          </div>
        </div>
      </div>

      {!campaign ? (
        <div className="px-6 py-10 text-sm text-slate-500 sm:px-8">Choose a campaign from the queue to inspect delivery results.</div>
      ) : (
        <div className="px-6 py-6 sm:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
              <div key={card.label} className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                  <card.icon size={16} className="text-slate-400" />
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full min-w-[720px]">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">Loading campaign insights...</td>
                  </tr>
                ) : deliveries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">No delivery records for this campaign yet.</td>
                  </tr>
                ) : (
                  deliveries.slice(0, 8).map((delivery) => (
                    <tr key={delivery.id}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{delivery.customerId.slice(0, 8)}</td>
                      <td className="px-4 py-3">{delivery.status}</td>
                      <td className="px-4 py-3">{delivery.provider}</td>
                      <td className="px-4 py-3">{delivery.sentAt ? new Date(delivery.sentAt).toLocaleString() : "-"}</td>
                      <td className="px-4 py-3">{delivery.errorMessage ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.section>
  );
}
