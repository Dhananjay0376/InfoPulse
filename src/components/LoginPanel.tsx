import { useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

interface Props {
  isLoading: boolean;
  error: string | null;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function LoginPanel({ isLoading, error, onSubmit }: Props) {
  const [email, setEmail] = useState("admin@infopulse.local");
  const [password, setPassword] = useState("ChangeMe123!");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSubmit(email, password);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.16),_transparent_28%),linear-gradient(160deg,#f8fafc,_#eef2ff_48%,#ffffff)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid w-full overflow-hidden rounded-[2rem] bg-white/90 shadow-[0_40px_120px_rgba(79,70,229,0.18)] ring-1 ring-white/70 backdrop-blur xl:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="relative hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 text-white xl:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(236,72,153,0.22),_transparent_28%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-indigo-200/80">InfoPulse</p>
                <h1 className="mt-6 max-w-sm text-4xl font-black leading-tight">
                  Secure customer operations and campaign control.
                </h1>
                <p className="mt-4 max-w-md text-sm text-slate-300">
                  Sign in to manage customer data, build email campaigns, and track delivery history from a single dashboard.
                </p>
              </div>
              <div className="grid gap-4 text-sm text-slate-200">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <ShieldCheck className="mb-3 text-indigo-300" size={18} />
                  Role-based access for admins, senders, and viewers.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <LockKeyhole className="mb-3 text-pink-300" size={18} />
                  Backend-authenticated customer and campaign workflows.
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">InfoPulse Access</p>
              <h2 className="mt-4 text-3xl font-black text-slate-900">Sign in to continue</h2>
              <p className="mt-2 text-sm text-slate-500">Use your seeded admin account first, then replace it with a real user.</p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Mail size={14} className="text-indigo-500" /> Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    placeholder="admin@infopulse.local"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <LockKeyhole size={14} className="text-indigo-500" /> Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    placeholder="Enter your password"
                  />
                </label>

                {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
