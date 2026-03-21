import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, UserPlus, Users2 } from "lucide-react";

import type { ManagedUserInput, ManagedUserPayload } from "../lib/api";

interface Props {
  users: ManagedUserPayload[];
  loading: boolean;
  onCreate: (input: ManagedUserInput) => Promise<void>;
}

const roles: Array<ManagedUserInput["role"]> = ["admin", "sender", "viewer"];

export default function UserManagement({ users, loading, onCreate }: Props) {
  const [form, setForm] = useState<ManagedUserInput>({
    fullName: "",
    email: "",
    password: "",
    role: "viewer",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onCreate(form);
      setForm({ fullName: "", email: "", password: "", role: "viewer" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="mb-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Admin Users</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Create a new account</h2>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
            <UserPlus size={20} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            placeholder="Full name"
          />
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            placeholder="Email"
          />
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            placeholder="Password"
          />
          <select
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as ManagedUserInput["role"] }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          >
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShieldCheck size={16} />
            {submitting ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">User Directory</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Existing accounts</h2>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-slate-600">
            <Users2 size={20} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {loading ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">No users available.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                    <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 ring-1 ring-indigo-200">
                    {user.role}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}
