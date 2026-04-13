'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mediaMetadataSchema, MEDIA_TYPES, MEDIA_SOURCES, MEDIA_STATUSES, FORMAT_GROUPS, formatTags } from '../schemas/media-asset.schema'
import type { MediaMetadataFormValues } from '../schemas/media-asset.schema'
import type { AppMediaAssetDetail } from '@/types/views'

interface MediaMetadataFormProps {
  asset: AppMediaAssetDetail
  onSubmit: (values: MediaMetadataFormValues) => Promise<{ error?: string }>
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export function MediaMetadataForm({ asset, onSubmit }: MediaMetadataFormProps) {
  const form = useForm<MediaMetadataFormValues>({
    resolver: zodResolver(mediaMetadataSchema),
    defaultValues: {
      title: asset.title ?? '',
      description: asset.description ?? '',
      campaign_id: asset.campaign_id ?? null,
      type: asset.type,
      source: asset.source,
      status: asset.status,
      format_group: asset.format_group ?? null,
      alt_text: asset.alt_text ?? '',
      hook_text: asset.hook_text ?? '',
      transcript: asset.transcript ?? '',
      tags: formatTags(asset.tags ?? []),
    },
  })

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = form
  const selectedType = watch('type')

  const handleFormSubmit = async (values: MediaMetadataFormValues) => {
    const result = await onSubmit(values)
    if (result?.error) form.setError('root', { message: result.error })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {errors.root && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errors.root.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select defaultValue={asset.type} onValueChange={(v) => setValue('type', v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MEDIA_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Source</Label>
          <Select defaultValue={asset.source} onValueChange={(v) => setValue('source', v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MEDIA_SOURCES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select defaultValue={asset.status} onValueChange={(v) => setValue('status', v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MEDIA_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title')} />
          <FieldError message={errors.title?.message} />
        </div>
        <div className="space-y-1.5">
          <Label>Format Group</Label>
          <Select
            defaultValue={asset.format_group ?? 'none'}
            onValueChange={(v) => setValue('format_group', v === 'none' ? null : v as any)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {FORMAT_GROUPS.map((g) => <SelectItem key={g} value={g} className="capitalize">{g.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="alt_text">Alt Text</Label>
          <Input id="alt_text" {...register('alt_text')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" {...register('tags')} placeholder="hotel, luxury, exterior" />
          <p className="text-[11px] text-muted-foreground">Comma-separated</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} rows={2} />
      </div>

      {selectedType === 'video' && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="hook_text">Hook Text</Label>
            <Input id="hook_text" {...register('hook_text')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="transcript">Transcript</Label>
            <Textarea id="transcript" {...register('transcript')} rows={3} />
          </div>
        </>
      )}

      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  )
}
