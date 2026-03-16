import { motion } from "framer-motion";
import { MailCheck, MailWarning, Server, TimerReset } from "lucide-react";

import type { DeliveryPayload } from "../lib/api";

interface Props {
  deliveries: DeliveryPayload[];
  loading: boolean;
}

function formatTimestamp(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusStyles(status: DeliveryPayload["status"]) {
  switch (status) {
    case "accepted":
    case "delivered":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "failed":
    case "bounced":
    case "complained":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-amber-50 text-amber-700 ring-amber-200";
  }
}

export default function DeliveryHistory({ deliveries, loading }: Props) {
  const acceptedCount = deliveries.filter((delivery) => ["accepted", "delivered"].includes(delivery.status)).length;
  const failedCount = deliveries.filter((delivery) => ["failed", "bounced", "complained"].includes(delivery.status)).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mt-10 overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
    >
      <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Delivery History</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Latest message outcomes</h2>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
              <MailCheck size={14} /> {acceptedCount} accepted
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-rose-700">
              <MailWarning size={14} /> {failedCount} failed
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-slate-50/80 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4 sm:px-8">Provider</th>
              <th className="px-6 py-4">Campaign</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Sent</th>
              <th className="px-6 py-4">Message Id</th>
              <th className="px-6 py-4 sm:px-8">Error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400 sm:px-8">
                  Loading delivery history...
                </td>
              </tr>
            ) : deliveries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400 sm:px-8">
                  No deliveries recorded yet.
                </td>
              </tr>
            ) : (
              deliveries.slice(0, 8).map((delivery) => (
                <tr key={delivery.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-semibold text-slate-800 sm:px-8">
                    <span className="inline-flex items-center gap-2">
                      <Server size={14} className="text-indigo-400" />
                      {delivery.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{delivery.campaignId.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2">
                      <TimerReset size={14} className="text-slate-400" />
                      {formatTimestamp(delivery.sentAt ?? delivery.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{delivery.providerMessageId ?? '-'}</td>
                  <td className="px-6 py-4 sm:px-8">{delivery.errorMessage ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
