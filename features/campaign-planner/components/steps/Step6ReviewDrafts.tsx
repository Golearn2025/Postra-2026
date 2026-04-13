'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, AlertCircle, Pencil, X, Image as ImageIcon } from 'lucide-react'
import type { AIDraftPost } from '../../schemas/planner.schema'

interface Step6Props {
  drafts: AIDraftPost[]
  mediaUrlMap?: Record<string, string>   // original_filename → file_url
  onUpdateDrafts: (drafts: AIDraftPost[]) => void
  onNext: () => void
  onPrevious: () => void
}

export function Step6ReviewDrafts({
  drafts,
  mediaUrlMap = {},
  onUpdateDrafts,
  onNext,
  onPrevious,
}: Step6Props) {
  const [localDrafts, setLocalDrafts] = useState<AIDraftPost[]>(drafts)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editBuffer, setEditBuffer] = useState<AIDraftPost | null>(null)

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditBuffer({ ...localDrafts[index] })
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditBuffer(null)
  }

  const saveEdit = (index: number) => {
    if (!editBuffer) return
    const updated = localDrafts.map((d, i) => (i === index ? editBuffer : d))
    setLocalDrafts(updated)
    onUpdateDrafts(updated)
    setEditingIndex(null)
    setEditBuffer(null)
  }

  const patchBuffer = (patch: Partial<AIDraftPost>) => {
    if (!editBuffer) return
    setEditBuffer({ ...editBuffer, ...patch })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Review Drafts</h2>
        <p className="text-muted-foreground">
          Review and edit the generated content for each campaign day. All fields are editable before creating posts.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-900">{localDrafts.length} days ready</p>
            <p className="text-green-700">Review and adjust any content before creating posts. Click Edit on any day card to make changes.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {localDrafts.map((draft, index) => {
          const isEditing = editingIndex === index
          const current = isEditing && editBuffer ? editBuffer : draft
          const imageUrl = mediaUrlMap[current.mediaFilename]

          return (
            <div key={index} className="border-2 rounded-xl overflow-hidden transition-all border-border">
              {/* Card header */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b">
                <div className="flex items-center gap-3">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-md">
                    Day {current.day}
                  </span>
                  <span className="text-sm text-muted-foreground">{current.date}</span>
                  {current.primaryTopic && (
                    <Badge variant="secondary" className="text-xs">{current.primaryTopic}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" variant="outline" onClick={cancelEdit} className="gap-1 h-7 text-xs">
                        <X className="h-3 w-3" /> Cancel
                      </Button>
                      <Button size="sm" onClick={() => saveEdit(index)} className="gap-1 h-7 text-xs">
                        <CheckCircle2 className="h-3 w-3" /> Save
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => startEdit(index)} className="gap-1 h-7 text-xs">
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4">
                {/* Media preview */}
                <div className="flex-shrink-0">
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={current.mediaFilename}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                        <span className="text-[10px] text-center px-1 break-all">{current.mediaFilename}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 text-center truncate">{current.mediaFilename}</p>
                </div>

                {/* Content fields */}
                <div className="space-y-3">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Primary Topic</Label>
                          <Input
                            value={editBuffer?.primaryTopic ?? ''}
                            onChange={(e) => patchBuffer({ primaryTopic: e.target.value })}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Target Goal</Label>
                          <Input
                            value={editBuffer?.targetGoal ?? ''}
                            onChange={(e) => patchBuffer({ targetGoal: e.target.value })}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Title</Label>
                        <Input
                          value={editBuffer?.title ?? ''}
                          onChange={(e) => patchBuffer({ title: e.target.value })}
                          className="h-8 text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Hook</Label>
                        <Input
                          value={editBuffer?.hook ?? ''}
                          onChange={(e) => patchBuffer({ hook: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Caption</Label>
                        <Textarea
                          value={editBuffer?.caption ?? ''}
                          onChange={(e) => patchBuffer({ caption: e.target.value })}
                          rows={3}
                          className="text-sm resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">CTA</Label>
                          <Input
                            value={editBuffer?.cta ?? ''}
                            onChange={(e) => patchBuffer({ cta: e.target.value })}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Hashtags (space-separated)</Label>
                          <Input
                            value={(editBuffer?.hashtags ?? []).join(' ')}
                            onChange={(e) => patchBuffer({ hashtags: e.target.value.split(/\s+/).filter(Boolean) })}
                            className="h-8 text-sm font-mono"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-base leading-tight">{current.title}</h3>
                      {current.hook && (
                        <div className="text-sm">
                          <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Hook</span>
                          <p className="mt-0.5 italic text-foreground/80">{current.hook}</p>
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Caption</span>
                        <p className="mt-0.5 text-foreground/90 whitespace-pre-line">{current.caption}</p>
                      </div>
                      {current.cta && (
                        <div className="text-sm">
                          <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">CTA</span>
                          <p className="mt-0.5 font-medium">{current.cta}</p>
                        </div>
                      )}
                      {current.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {current.hashtags.map((tag, i) => (
                            <span key={i} className="text-xs text-primary font-medium">{tag}</span>
                          ))}
                        </div>
                      )}
                      {current.targetGoal && (
                        <div className="text-xs text-muted-foreground border-t pt-2 mt-1">
                          <span className="font-medium">Goal:</span> {current.targetGoal}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {localDrafts.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No drafts to review. Go back and validate your AI output first.</p>
        </div>
      )}

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={localDrafts.length === 0}>
          Create Posts
        </Button>
      </div>
    </div>
  )
}
