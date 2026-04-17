'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UploadCloud, X, ChevronRight } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mediaMetadataSchema, MEDIA_TYPES, MEDIA_SOURCES, MEDIA_STATUSES, FORMAT_GROUPS } from '../schemas/media-asset.schema'
import type { MediaMetadataFormValues } from '../schemas/media-asset.schema'
import { createMediaAssetBulkAction } from '@/server/actions/media-assets.actions'
import type { FileFields } from '@/server/actions/media-assets.actions'
import { inferMediaType } from '@/lib/formatters/file'
import type { DbContentCampaign } from '@/types/database'
import { BatchMetadataPanel } from '../components/BatchMetadataPanel'
import { FileReviewTable, type FileMetadata } from '../components/FileReviewTable'
import { MultiSelect } from '@/components/ui/multi-select'
import { PLATFORMS } from '../schemas/media-asset.schema'

interface MediaUploadFormProps {
  organizationId: string
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export function MediaUploadForm({ organizationId }: MediaUploadFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const [filesMetadata, setFilesMetadata] = useState<FileMetadata[]>([])
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<DbContentCampaign[]>([])
  const [showReviewTable, setShowReviewTable] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch campaigns for selector
  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const response = await fetch(`/api/campaigns?organizationId=${organizationId}`)
        const data = await response.json()
        setCampaigns(data.campaigns || [])
      } catch (error) {
        console.error('Failed to fetch campaigns:', error)
      }
    }
    fetchCampaigns()
  }, [organizationId])

  const form = useForm<MediaMetadataFormValues>({
    resolver: zodResolver(mediaMetadataSchema),
    defaultValues: {
      type: 'image',
      source: 'uploaded',
      status: 'draft',
      title: '',
      description: '',
      alt_text: '',
      hook_text: '',
      transcript: '',
      tags: '',
      format_group: null,
      campaign_id: null,
      suggested_platforms: [],
      // New metadata fields
      asset_title_short: '',
      asset_description: '',
      asset_tags: '',
      asset_ai_hint: '',
    },
  })

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = form
  const selectedType = watch('type')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(selectedFiles)
    
    // Initialize metadata for each file
    const initialMetadata: FileMetadata[] = selectedFiles.map(file => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, ''),
      alt_text: '',
      description: '',
      tags: '',
      format_group: null,
      suggested_platforms: [],
      campaign_id: null,
      // New metadata fields
      asset_title_short: file.name.replace(/\.[^/.]+$/, ''),
      asset_description: '',
      asset_tags: '',
      asset_ai_hint: '',
    }))
    setFilesMetadata(initialMetadata)
    setShowReviewTable(selectedFiles.length > 0)
    
    if (selectedFiles.length > 0) {
      const firstFile = selectedFiles[0]
      const inferredType = inferMediaType(firstFile.type)
      setValue('type', inferredType)
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setFilesMetadata(filesMetadata.filter((_, i) => i !== index))
    if (files.length <= 1) {
      setShowReviewTable(false)
    }
  }

  const handleBatchMetadataApply = (batchMeta: any) => {
    const updatedMetadata = filesMetadata.map(meta => ({
      ...meta,
      ...batchMeta,
    }))
    setFilesMetadata(updatedMetadata)
  }

  const handleFileMetadataUpdate = (index: number, updates: Partial<FileMetadata>) => {
    setFilesMetadata(filesMetadata.map((meta, i) => 
      i === index ? { ...meta, ...updates } : meta
    ))
  }

  const handleSubmitForm = async (values: MediaMetadataFormValues) => {
    form.clearErrors('root')

    if (files.length === 0) {
      form.setError('root', { message: 'Please select at least one file to upload' })
      return
    }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      let successCount = 0
      let errorCount = 0
      
      for (let i = 0; i < filesMetadata.length; i++) {
        const fileMeta = filesMetadata[i]
        const file = fileMeta.file
        setUploadProgress(`Uploading file ${i + 1} of ${filesMetadata.length}...`)
        
        // Get campaign slug if campaign is selected for this file
        const selectedCampaign = fileMeta.campaign_id
          ? campaigns.find(c => c.id === fileMeta.campaign_id)
          : null
        
        const ext = file.name.split('.').pop()
        const timestamp = Date.now()
        const uuid = crypto.randomUUID()
        
        // Campaign-aware storage path
        const path = selectedCampaign
          ? `${organizationId}/campaigns/${selectedCampaign.slug}/${timestamp}-${uuid}.${ext}`
          : `${organizationId}/${timestamp}-${uuid}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('media-assets')
          .upload(path, file, { contentType: file.type, upsert: false })

        if (uploadError) {
          form.setError('root', { message: `Upload failed for ${file.name}: ${uploadError.message}` })
          setUploadProgress(null)
          return
        }

        const fileFields: FileFields = {
          original_filename: file.name,
          storage_path: path,
          mime_type: file.type,
          file_size_bytes: file.size,
        }

        setUploadProgress(`Saving metadata for ${file.name}...`)

        // Use per-file metadata
        const fileValues: MediaMetadataFormValues = {
          ...values,
          title: fileMeta.title,
          alt_text: fileMeta.alt_text,
          description: fileMeta.description,
          tags: fileMeta.tags,
          format_group: fileMeta.format_group as 'vertical_mobile' | 'portrait_feed' | 'square' | 'landscape' | null,
          suggested_platforms: fileMeta.suggested_platforms as ("facebook" | "instagram" | "linkedin" | "tiktok" | "threads" | "youtube" | "twitter" | "pinterest" | "snapchat" | "reddit")[],
          campaign_id: fileMeta.campaign_id,
        }

        const result = await createMediaAssetBulkAction(organizationId, fileValues, fileFields)
        
        if (result?.error) {
          errorCount++
          form.setError('root', { message: `Failed to save ${file.name}: ${result.error}` })
          setUploadProgress(null)
          return
        }
        
        successCount++
      }
      
      // Reset form after successful upload
      setFiles([])
      form.reset()
      setUploadProgress(`Upload complete! ${successCount} asset${successCount > 1 ? 's' : ''} saved successfully.`)
      
      // Redirect to media library after a short delay
      setTimeout(() => {
        window.location.href = '/media-library'
      }, 1500)

    } catch (error) {
      form.setError('root', { message: 'Upload failed. Please try again.' })
      setUploadProgress(null)
    }
  }

  const busy = isSubmitting || !!uploadProgress

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
      {errors.root && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errors.root.message}
        </div>
      )}

      {/* File picker */}
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 cursor-pointer hover:border-accent/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="h-8 w-8 text-muted-foreground" />
        {files.length > 0 ? (
          <div className="text-center">
            <p className="text-sm text-foreground font-medium">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click to add more files
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Click to select images or videos</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Batch Metadata Panel */}
      {files.length > 0 && (
        <BatchMetadataPanel campaigns={campaigns} onApply={handleBatchMetadataApply} />
      )}

      {/* File Review Table - Full width layout for bulk mode */}
      {showReviewTable && filesMetadata.length > 0 && (
        <div className="w-full">
          <FileReviewTable
            filesMetadata={filesMetadata}
            campaigns={campaigns}
            onUpdate={handleFileMetadataUpdate}
            onRemove={removeFile}
          />
        </div>
      )}

      {/* Type + Source + Status - Hidden in bulk mode */}
      {!showReviewTable && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Type <span className="text-destructive">*</span></Label>
            <Select defaultValue="image" value={selectedType} onValueChange={(v) => setValue('type', v as 'image' | 'video' | 'thumbnail' | 'logo')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MEDIA_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Source <span className="text-destructive">*</span></Label>
            <Select defaultValue="uploaded" onValueChange={(v) => setValue('source', v as 'uploaded' | 'ai_generated' | 'imported_manual' | 'rendered_template')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MEDIA_SOURCES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status <span className="text-destructive">*</span></Label>
            <Select defaultValue="draft" onValueChange={(v) => setValue('status', v as 'draft' | 'ready' | 'processing' | 'failed' | 'archived')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MEDIA_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Title + Campaign - Hidden in bulk mode */}
      {!showReviewTable && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} placeholder="e.g. Hero image Q1" />
            <p className="text-[11px] text-muted-foreground">Examples: Luxury fleet exterior, Corporate event setup, Wedding couple arrival, Airport transfer service</p>
            <FieldError message={errors.title?.message} />
          </div>
          <div className="space-y-1.5">
            <Label>Campaign</Label>
            <Select defaultValue="none" onValueChange={(v) => setValue('campaign_id', v === 'none' ? null : v as string)}>
              <SelectTrigger><SelectValue placeholder="Select campaign..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No campaign</SelectItem>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">Link this media to a campaign for better organization</p>
          </div>
        </div>
      )}

      {/* Format Group - Hidden in bulk mode */}
      {!showReviewTable && (
        <div className="space-y-1.5">
          <Label>Format Group</Label>
          <Select defaultValue="none" onValueChange={(v) => setValue('format_group', v === 'none' ? null : v as 'vertical_mobile' | 'portrait_feed' | 'square' | 'landscape')}>
            <SelectTrigger><SelectValue placeholder="Select format..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {FORMAT_GROUPS.map((g) => <SelectItem key={g} value={g} className="capitalize">{g.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">Vertical mobile: Instagram Stories | Portrait feed: Instagram/Facebook | Square: All platforms | Landscape: Twitter/LinkedIn</p>
        </div>
      )}

      {/* Alt text + Tags - Hidden in bulk mode */}
      {!showReviewTable && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="alt_text">Alt Text</Label>
            <Input id="alt_text" {...register('alt_text')} placeholder="Describe the image for accessibility" />
            <p className="text-[11px] text-muted-foreground">Example: Black luxury sedan parked at airport terminal with chauffeur standing beside car</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" {...register('tags')} placeholder="hotel, luxury, exterior" />
            <p className="text-[11px] text-muted-foreground">Examples: luxury, airport, corporate, wedding, fleet, chauffeur, premium, transport</p>
          </div>
        </div>
      )}

      {/* Description - Hidden in bulk mode */}
      {!showReviewTable && (
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} rows={2} placeholder="Optional notes about this asset..." />
        </div>
      )}

      {/* New Metadata Fields - Hidden in bulk mode */}
      {!showReviewTable && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-medium text-foreground">AI Brief Metadata</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="asset_title_short">Short Title</Label>
              <Input id="asset_title_short" {...register('asset_title_short')} placeholder="e.g. Hotel Pickup 01" />
              <p className="text-[11px] text-muted-foreground">Short clean title for UI/library display</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="asset_tags">Asset Tags</Label>
              <Input id="asset_tags" {...register('asset_tags')} placeholder="hotel, pickup, luxury" />
              <p className="text-[11px] text-muted-foreground">Tags for AI context (3-5 keywords)</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="asset_description">Asset Description</Label>
            <Textarea id="asset_description" {...register('asset_description')} rows={2} placeholder="Client entering the vehicle outside a luxury hotel in London" />
            <p className="text-[11px] text-muted-foreground">1 short sentence describing the visual scene</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="asset_ai_hint">AI Hint (Optional)</Label>
            <Textarea id="asset_ai_hint" {...register('asset_ai_hint')} rows={2} placeholder="Emphasize premium arrival experience and polished first impression" />
            <p className="text-[11px] text-muted-foreground">Optional short creative angle or intended message for AI generation</p>
          </div>
        </div>
      )}

      {/* Suggested Platforms - Hidden in bulk mode */}
      {!showReviewTable && (
        <div className="space-y-1.5">
          <Label>Suggested Platforms</Label>
          <MultiSelect
            options={[...PLATFORMS]}
            selected={watch('suggested_platforms') || []}
            onChange={(platforms) => setValue('suggested_platforms', platforms as ("facebook" | "instagram" | "linkedin" | "tiktok" | "threads" | "youtube" | "twitter" | "pinterest" | "snapchat" | "reddit")[])}
            placeholder="Select platforms..."
          />
          <p className="text-[11px] text-muted-foreground">Select platforms where this asset performs best. Helps with planning and campaign targeting.</p>
        </div>
      )}

      {/* Video fields - Hidden in bulk mode */}
      {!showReviewTable && selectedType === 'video' && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="hook_text">Hook Text</Label>
            <Input id="hook_text" {...register('hook_text')} placeholder="Opening hook for this video..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="transcript">Transcript</Label>
            <Textarea id="transcript" {...register('transcript')} rows={3} placeholder="Video transcript..." />
          </div>
        </>
      )}

      {/* Submit button - Hidden in bulk mode */}
      {!showReviewTable && (
        <div className="flex items-center justify-between pt-2">
          {uploadProgress && <p className="text-sm text-muted-foreground">{uploadProgress}</p>}
          <div className="ml-auto">
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploadProgress ?? 'Save Asset'}
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Save All Assets Button - Only in bulk mode */}
      {showReviewTable && filesMetadata.length > 0 && (
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            Ready to save {filesMetadata.length} asset{filesMetadata.length !== 1 ? 's' : ''}
          </div>
          <div className="ml-auto">
            <Button type="submit" disabled={busy} size="lg">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save All Assets
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
