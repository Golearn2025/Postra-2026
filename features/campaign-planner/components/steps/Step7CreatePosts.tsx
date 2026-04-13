'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, PartyPopper, AlertCircle, XCircle } from 'lucide-react'
import type { AIDraftPost } from '../../schemas/planner.schema'
import type { CreateDraftPostsResult } from '@/server/actions/campaign-planner.actions'

interface Step7Props {
  drafts: AIDraftPost[]
  onPrevious: () => void
  onCreatePosts: () => Promise<CreateDraftPostsResult>
}

export function Step7CreatePosts({ drafts, onPrevious, onCreatePosts }: Step7Props) {
  const [creating, setCreating] = useState(false)
  const [result, setResult] = useState<CreateDraftPostsResult | null>(null)

  const handleCreate = async () => {
    setCreating(true)
    try {
      const res = await onCreatePosts()
      setResult(res)
    } catch (error) {
      setResult({
        success: false,
        postsCreated: 0,
        slotsCreated: 0,
        errors: [],
        error: error instanceof Error ? error.message : 'Unexpected error',
      })
    } finally {
      setCreating(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (result?.success) {
    return (
      <div className="space-y-6">
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <PartyPopper className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Posts Created Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            Your campaign content has been added to the planner.
          </p>

          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{result.postsCreated}</p>
              <p className="text-sm text-muted-foreground">draft posts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{result.slotsCreated}</p>
              <p className="text-sm text-muted-foreground">calendar slots</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left mb-6 max-w-md mx-auto">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900 mb-1">{result.errors.length} item{result.errors.length !== 1 ? 's' : ''} had issues</p>
                  <ul className="text-amber-700 space-y-0.5 list-disc list-inside">
                    {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <a href="/calendar">View Calendar</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/posts">View Posts</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/campaign-planner">Create Another Plan</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Pre-create screen ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Create Draft Posts</h2>
        <p className="text-muted-foreground">
          Ready to create your draft posts? This will write them to the database and add them to your content calendar.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h3 className="font-semibold mb-3 text-blue-900">What will be created:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <span><strong>{drafts.length}</strong> draft content posts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <span><strong>{drafts.length}</strong> calendar slots (status: planned)</span>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Posts are created as <strong>drafts</strong>. Review and edit them in the Posts page before scheduling or publishing.
        </p>
      </div>

      {/* Fatal error */}
      {result && !result.success && (result.error || result.errors.length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-2">
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-900 mb-1">
                {result.postsCreated === 0 ? 'No posts were created' : `Only ${result.postsCreated}/${drafts.length} posts created`}
              </p>
              {result.error && <p className="text-red-700">{result.error}</p>}
              {result.errors.length > 0 && (
                <ul className="text-red-700 space-y-0.5 list-disc list-inside mt-1">
                  {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onPrevious} disabled={creating}>
          Previous
        </Button>
        <Button onClick={handleCreate} disabled={creating || drafts.length === 0} size="lg" className="gap-2">
          {creating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Posts...
            </>
          ) : (
            `Create ${drafts.length} Draft Posts`
          )}
        </Button>
      </div>
    </div>
  )
}
