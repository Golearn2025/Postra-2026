'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { campaignSchema, slugifyName, CAMPAIGN_STATUSES, CAMPAIGN_PILLARS } from '../schemas/campaign.schema'
import type { CampaignFormValues } from '../schemas/campaign.schema'
import type { DbContentCampaign } from '@/types/database'

interface CampaignFormProps {
  defaultValues?: Partial<CampaignFormValues>
  onSubmit: (values: CampaignFormValues) => Promise<{ error?: string }>
  submitLabel?: string
  isLoading?: boolean
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export function CampaignForm({ defaultValues, onSubmit, submitLabel = 'Save', isLoading }: CampaignFormProps) {
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      slug: defaultValues?.slug ?? '',
      status: defaultValues?.status ?? 'draft',
      pillar: defaultValues?.pillar ?? null,
      objective: defaultValues?.objective ?? '',
      target_audience: defaultValues?.target_audience ?? '',
      target_market: defaultValues?.target_market ?? '',
      timezone: defaultValues?.timezone ?? 'UTC',
      start_date: defaultValues?.start_date ?? '',
      end_date: defaultValues?.end_date ?? '',
      description: defaultValues?.description ?? '',
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = form
  const nameValue = watch('name')
  const slugValue = watch('slug')

  // Auto-generate slug from name only if slug is empty or hasn't been manually edited
  useEffect(() => {
    if (nameValue && !defaultValues?.slug) {
      const currentSlug = form.getValues('slug')
      const autoSlug = slugifyName(nameValue)
      if (!currentSlug || currentSlug === slugifyName(form.getValues('name').slice(0, -1))) {
        setValue('slug', autoSlug)
      }
    }
  }, [nameValue])

  const handleFormSubmit = async (values: CampaignFormValues) => {
    const result = await onSubmit(values)
    if (result?.error) {
      form.setError('root', { message: result.error })
    }
  }

  const busy = isSubmitting || isLoading

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {errors.root && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errors.root.message}
        </div>
      )}

      {/* Name + Slug */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Campaign Name <span className="text-destructive">*</span></Label>
          <Input id="name" {...register('name')} placeholder="e.g. Summer Promo 2026" />
          <FieldError message={errors.name?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug <span className="text-destructive">*</span></Label>
          <Input id="slug" {...register('slug')} placeholder="summer-promo-2026" />
          <FieldError message={errors.slug?.message} />
        </div>
      </div>

      {/* Status + Pillar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Status <span className="text-destructive">*</span></Label>
          <Select
            defaultValue={form.getValues('status')}
            onValueChange={(v) => setValue('status', v as any)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CAMPAIGN_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.status?.message} />
        </div>
        <div className="space-y-1.5">
          <Label>Content Pillar</Label>
          <Select
            defaultValue={form.getValues('pillar') ?? 'none'}
            onValueChange={(v) => setValue('pillar', v === 'none' ? null : v as any)}
          >
            <SelectTrigger><SelectValue placeholder="Select pillar..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {CAMPAIGN_PILLARS.map((p) => (
                <SelectItem key={p} value={p} className="capitalize">{p.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Target audience + market */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="target_audience">Target Audience</Label>
          <Input id="target_audience" {...register('target_audience')} placeholder="e.g. Business travelers, Luxury tourists" />
          <p className="text-[11px] text-muted-foreground">Examples: Business travelers, Luxury tourists, Event attendees, VIP clients</p>
          <FieldError message={errors.target_audience?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="target_market">Target Market</Label>
          <Input id="target_market" {...register('target_market')} placeholder="e.g. UAE, Saudi Arabia" />
          <p className="text-[11px] text-muted-foreground">Examples: UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman</p>
          <FieldError message={errors.target_market?.message} />
        </div>
      </div>

      {/* Timezone + dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="timezone">Timezone <span className="text-destructive">*</span></Label>
          <Input id="timezone" {...register('timezone')} placeholder="UTC" />
          <FieldError message={errors.timezone?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" type="date" {...register('start_date')} />
          <FieldError message={errors.start_date?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_date">End Date</Label>
          <Input id="end_date" type="date" {...register('end_date')} />
          <FieldError message={errors.end_date?.message} />
        </div>
      </div>

      {/* Objective */}
      <div className="space-y-1.5">
        <Label htmlFor="objective">Objective</Label>
        <Textarea id="objective" {...register('objective')} rows={2} placeholder="What is the goal of this campaign?" />
        <p className="text-[11px] text-muted-foreground">Examples: Increase luxury transfer bookings by 30%, Promote airport transfer services to corporate clients, Launch wedding transportation packages, Build brand awareness in GCC markets</p>
        <FieldError message={errors.objective?.message} />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} rows={3} placeholder="Campaign overview, notes, or brief..." />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
