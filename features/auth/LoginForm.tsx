'use client'

import { useState } from 'react'
import { signInWithEmail } from '@/server/actions/auth.actions'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signInWithEmail(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <span className="text-[16px] font-bold text-white">P</span>
        </div>
        <h1 className="text-[20px] font-bold text-white">Sign in to Postra</h1>
        <p className="text-[13px] text-slate-400">Enterprise Social Content Platform</p>
      </div>

      {/* Form */}
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[12px] font-medium text-slate-300" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-sidebar-border bg-sidebar-surface px-3 py-2.5 text-[13px] text-white placeholder-slate-500 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30"
            placeholder="you@company.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-medium text-slate-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-sidebar-border bg-sidebar-surface px-3 py-2.5 text-[13px] text-white placeholder-slate-500 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-status-error-bg px-3 py-2.5 text-[12px] text-status-error-text">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
