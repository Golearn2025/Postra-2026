'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MEDIA_TYPES, MEDIA_SOURCES, MEDIA_STATUSES } from '../schemas/media-asset.schema'
import type { DbContentCampaign } from '@/types/database'

interface MediaFiltersProps {
  campaigns?: DbContentCampaign[]
}

export function MediaFilters({ campaigns = [] }: MediaFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      startTransition(() => { router.push(`${pathname}?${params.toString()}` as any) })
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search media..."
          defaultValue={searchParams.get('search') ?? ''}
          onChange={(e) => updateParam('search', e.target.value)}
          className="pl-8"
        />
      </div>

      <Select defaultValue={searchParams.get('type') ?? 'all'} onValueChange={(v) => updateParam('type', v)}>
        <SelectTrigger className="w-[130px]"><SelectValue placeholder="Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {MEDIA_TYPES.map((t) => (
            <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get('source') ?? 'all'} onValueChange={(v) => updateParam('source', v)}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Source" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sources</SelectItem>
          {MEDIA_SOURCES.map((s) => (
            <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get('status') ?? 'all'} onValueChange={(v) => updateParam('status', v)}>
        <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {MEDIA_STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get('campaign_id') ?? 'all'} onValueChange={(v) => updateParam('campaign_id', v)}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Campaign" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All campaigns</SelectItem>
          {campaigns.map((campaign) => (
            <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
