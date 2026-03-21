import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, ShieldCheck, UserCog, UserPlus, Users2 } from "lucide-react";

import type { ManagedUserInput, ManagedUserPayload } from "../lib/api";

interface Props {
  users: ManagedUserPayload[];
  loading: boolean;
  onCreate: (input: ManagedUserInput) => Promise<void>;
  onUpdate: (userId: string, input: { role: ManagedUserInput["role"]; isActive: boolean }) => Promise<void>;
  onResetPassword: (userId: string, password: string) => Promise<void>;
}

const roles: Array<ManagedUserInput["role"]> = ["admin", "sender", "viewer"];

export default function UserManagement({ users, loading, onCreate, onUpdate, onResetPassword }: Props) {
  const [form, setForm] = useState<ManagedUserInput>({
    fullName: "",
    email: "",
    password: "",
    role: "viewer",
  });
  const [draftRoles, setDraftRoles] = useState<Record<string, ManagedUserInput["role"]>>({});
  const [passwordDrafts, setPasswordDrafts] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [rowNotice, setRowNotice] = useState<string | null>(null);

  useEffect(() => {
    setDraftRoles(Object.fromEntries(users.map((user) => [user.id, user.role])));
  }, [users]);

  const sortedUsers = useMemo(() => users, [users]);

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

  async function handleSaveUser(user: ManagedUserPayload) {
    setSavingUserId(user.id);
    setRowError(null);
    setRowNotice(null);

    try {
      await onUpdate(user.id, {
        role: draftRoles[user.id] ?? user.role,
        isActive: user.isActive,
      });
      setRowNotice(`Updated ${user.fullName}`);
    } catch (err) {
      setRowError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSavingUserId(null);
    }
  }

  async function handleToggleActive(user: ManagedUserPayload) {
    setSavingUserId(user.id);
    setRowError(null);
    setRowNotice(null);

    try {
      await onUpdate(user.id, {
        role: draftRoles[user.id] ?? user.role,
        isActive: !user.isActive,
      });
      setRowNotice(`${user.fullName} is now ${user.isActive ? "inactive" : "active"}`);
    } catch (err) {
      setRowError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSavingUserId(null);
    }
  }

  async function handleResetPassword(user: ManagedUserPayload) {
    const password = passwordDrafts[user.id]?.trim();

    if (!password) {
      setRowError("Enter a new password before resetting it");
      return;
    }

    setResettingUserId(user.id);
    setRowError(null);
    setRowNotice(null);

    try {
      await onResetPassword(user.id, password);
      setPasswordDrafts((current) => ({ ...current, [user.id]: "" }));
      setRowNotice(`Password reset for ${user.fullName}`);
    } catch (err) {
      setRowError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setResettingUserId(null);
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
            <h2 className="mt-2 text-2xl font-black text-slate-900">Manage existing accounts</h2>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-slate-600">
            <Users2 size={20} />
          </div>
        </div>

        {rowError ? <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{rowError}</p> : null}
        {rowNotice ? <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{rowNotice}</p> : null}

        <div className="mt-6 space-y-3">
          {loading ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">Loading users...</p>
          ) : sortedUsers.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">No users available.</p>
          ) : (
            sortedUsers.map((user) => {
              const roleChanged = (draftRoles[user.id] ?? user.role) !== user.role;

              return (
                <div key={user.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                        <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${user.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-200/70 text-slate-600 ring-slate-300"}`}>
                          {user.isActive ? "active" : "inactive"}
                        </span>
                        <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 ring-1 ring-indigo-200">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[minmax(0,0.8fr)_auto_auto] lg:items-center">
                      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                        <UserCog size={16} className="text-slate-400" />
                        <select
                          value={draftRoles[user.id] ?? user.role}
                          onChange={(event) => setDraftRoles((current) => ({ ...current, [user.id]: event.target.value as ManagedUserInput["role"] }))}
                          className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </label>

                      <button
                        type="button"
                        onClick={() => void handleSaveUser(user)}
                        disabled={savingUserId === user.id || !roleChanged}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <ShieldCheck size={16} />
                        {savingUserId === user.id ? "Saving..." : "Save Role"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleToggleActive(user)}
                        disabled={savingUserId === user.id}
                        className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${user.isActive ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
                      >
                        {savingUserId === user.id ? "Saving..." : user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                        <KeyRound size={16} className="text-slate-400" />
                        <input
                          type="password"
                          value={passwordDrafts[user.id] ?? ""}
                          onChange={(event) => setPasswordDrafts((current) => ({ ...current, [user.id]: event.target.value }))}
                          placeholder="New password"
                          className="w-full bg-transparent text-sm text-slate-900 outline-none"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => void handleResetPassword(user)}
                        disabled={resettingUserId === user.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <KeyRound size={16} />
                        {resettingUserId === user.id ? "Resetting..." : "Reset Password"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.section>
  );
}
