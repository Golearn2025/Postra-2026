'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  Plus, 
  Grid3X3, 
  List, 
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Archive,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/formatters/date'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { FilterDropdown } from '@/components/premium/FilterDropdown'
import type { AppPostsListItem } from '@/types/views'

interface EnterprisePostsPageProps {
  posts: AppPostsListItem[]
  campaigns: Array<{ id: string; name: string }>
  onStatusChange?: (postIds: string[], status: string) => void
  onDelete?: (postIds: string[]) => void
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'planned', label: 'Planned' },
  { value: 'paused', label: 'Paused' },
  { value: 'published', label: 'Published' },
]

const SOURCE_OPTIONS = [
  { value: 'chatgpt_imported', label: 'AI Planner' },
  { value: 'manual', label: 'Manual' },
  { value: 'bulk_imported', label: 'Bulk Import' },
  { value: 'ai_platform_generated', label: 'AI Generated' },
]

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  planned: 'bg-amber-100 text-amber-700',
  paused: 'bg-orange-100 text-orange-700',
  published: 'bg-green-100 text-green-700',
}

export function EnterprisePostsPage({ 
  posts, 
  campaigns, 
  onStatusChange, 
  onDelete 
}: EnterprisePostsPageProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [sourceFilter, setSourceFilter] = useState<string[]>([])
  const [campaignFilter, setCampaignFilter] = useState<string[]>([])
  const [, startTransition] = useTransition()

  // Filter posts
  const filteredPosts = useMemo(() => posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.campaign_name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(post.status)
    const matchesSource = sourceFilter.length === 0 || sourceFilter.includes(post.source)
    const matchesCampaign = campaignFilter.length === 0 || 
      (post.campaign_id && campaignFilter.includes(post.campaign_id))
    
    return matchesSearch && matchesStatus && matchesSource && matchesCampaign
  }), [posts, searchQuery, statusFilter, sourceFilter, campaignFilter])

  const handleSelectAll = () => {
    if (selectedPosts.size === filteredPosts.length) {
      setSelectedPosts(new Set())
    } else {
      setSelectedPosts(new Set(filteredPosts.map(p => p.id)))
    }
  }

  const handleSelectPost = (postId: string) => {
    const newSelected = new Set(selectedPosts)
    if (newSelected.has(postId)) {
      newSelected.delete(postId)
    } else {
      newSelected.add(postId)
    }
    setSelectedPosts(newSelected)
  }

  const handleBulkStatusChange = (status: string) => {
    if (selectedPosts.size === 0) return
    
    startTransition(() => {
      onStatusChange?.(Array.from(selectedPosts), status)
      setSelectedPosts(new Set())
    })
  }

  const handleBulkDelete = () => {
    if (selectedPosts.size === 0) return
    
    if (confirm(`Delete ${selectedPosts.size} post${selectedPosts.size > 1 ? 's' : ''}?`)) {
      startTransition(() => {
        onDelete?.(Array.from(selectedPosts))
        setSelectedPosts(new Set())
      })
    }
  }

  
  const getMetadata = (post: AppPostsListItem) => {
    const meta = post.metadata as Record<string, unknown> | null ?? {}
    return {
      primaryTopic: meta.primaryTopic as string | null,
      plannerDay: meta.plannerDay as number | null,
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 dark">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Posts</h1>
            <p className="text-gray-400">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
              {filteredPosts.length !== posts.length && ` of ${posts.length}`}
            </p>
          </div>
          
          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#111113] border-[#2A2A2E] text-white placeholder-gray-500 focus:border-amber-500"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <FilterDropdown
              label="Campaign"
              options={campaigns.map(c => ({ value: c.id, label: c.name }))}
              selectedValues={campaignFilter}
              onSelectionChange={setCampaignFilter}
              variant="dark"
            />
            
            <FilterDropdown
              label="Status"
              options={STATUS_OPTIONS}
              selectedValues={statusFilter}
              onSelectionChange={setStatusFilter}
              variant="dark"
            />
            
            <FilterDropdown
              label="Source"
              options={SOURCE_OPTIONS}
              selectedValues={sourceFilter}
              onSelectionChange={setSourceFilter}
              variant="dark"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('table')}
              className={cn(
                'border-[#2A2A2E] text-gray-400 hover:text-white',
                viewMode === 'table' && 'bg-[#2A2A2E] text-blue-400 border-blue-500/50'
              )}
            >
              <List className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={cn(
                'border-[#2A2A2E] text-gray-400 hover:text-white',
                viewMode === 'grid' && 'bg-[#2A2A2E] text-blue-400 border-blue-500/50'
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.size > 0 && (
          <div className="mt-4 p-4 bg-[#111113] border border-[#2A2A2E] rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                {selectedPosts.size} post{selectedPosts.size > 1 ? 's' : ''} selected
              </span>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('planned')}
                  className="border-[#2A2A2E] text-gray-300 hover:text-white"
                >
                  Mark as Planned
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('paused')}
                  className="border-[#2A2A2E] text-gray-300 hover:text-white"
                >
                  Pause
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('archived')}
                  className="border-[#2A2A2E] text-gray-300 hover:text-white"
                >
                  Archive
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="border-red-500/50 text-red-400 hover:text-red-300 hover:border-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Posts Display */}
      {filteredPosts.length === 0 ? (
        <PremiumCard variant="dark" className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-white mb-3">No posts found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || statusFilter.length > 0 || sourceFilter.length > 0 || campaignFilter.length > 0
                ? 'Try adjusting your filters or search terms.'
                : 'Create your first posts using the Campaign Planner.'}
            </p>
            {!searchQuery && statusFilter.length === 0 && sourceFilter.length === 0 && campaignFilter.length === 0 && (
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                Create with Campaign Planner
              </Button>
            )}
          </div>
        </PremiumCard>
      ) : viewMode === 'table' ? (
        <PremiumCard variant="dark" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2E]">
                  <th className="text-left p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAll}
                      className="text-gray-400 hover:text-white"
                    >
                      {selectedPosts.size === filteredPosts.length && filteredPosts.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-400" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">Title</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Campaign</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Topic</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Source</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Day</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Created</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => {
                  const meta = getMetadata(post)
                  return (
                    <tr key={post.id} className="border-b border-[#2A2A2E] hover:bg-[#1A1A1D]">
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectPost(post.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          {selectedPosts.has(post.id) ? (
                            <CheckSquare className="h-4 w-4 text-blue-400" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium line-clamp-1">{post.title}</p>
                          {post.caption_master && (
                            <p className="text-gray-400 text-sm line-clamp-1 mt-1">{post.caption_master}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{post.campaign_name || 'No campaign'}</td>
                      <td className="p-4">
                        <span className="text-gray-300">{meta.primaryTopic || 'No topic'}</span>
                      </td>
                      <td className="p-4">
                        <Badge className={STATUS_COLORS[post.status] || STATUS_COLORS.draft}>
                          {post.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-300">
                        {post.source === 'chatgpt_imported' ? 'AI Planner' : 
                         post.source === 'bulk_imported' ? 'Bulk Import' :
                         post.source === 'ai_platform_generated' ? 'AI Generated' :
                         post.source}
                      </td>
                      <td className="p-4 text-center">
                        {meta.plannerDay != null ? `Day ${meta.plannerDay}` : 'No day'}
                      </td>
                      <td className="p-4 text-gray-300">{post.created_at ? formatDate(post.created_at) : 'Never'}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#111113] border-[#2A2A2E]">
                            <DropdownMenuItem 
                              className="text-gray-300 hover:bg-[#2A2A2E] hover:text-white"
                              onClick={() => router.push(`/posts/${post.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-gray-300 hover:bg-[#2A2A2E] hover:text-white"
                              onClick={() => router.push(`/posts/${post.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-300 hover:bg-[#2A2A2E] hover:text-white">
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#2A2A2E]" />
                            <DropdownMenuItem className="text-gray-300 hover:bg-[#2A2A2E] hover:text-white">
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </PremiumCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post) => {
            const meta = getMetadata(post)
            return (
              <PremiumCard 
                key={post.id} 
                variant="dark" 
                className="hover:border-blue-500/50 cursor-pointer"
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectPost(post.id)
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    {selectedPosts.has(post.id) ? (
                      <CheckSquare className="h-4 w-4 text-blue-400" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                  <Badge className={STATUS_COLORS[post.status] || STATUS_COLORS.draft}>
                    {post.status}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-white mb-2 line-clamp-2">{post.title}</h3>
                
                {post.caption_master && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.caption_master}</p>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Campaign:</span>
                    <span className="text-gray-300">{post.campaign_name || 'No campaign'}</span>
                  </div>
                  {meta.primaryTopic && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Topic:</span>
                      <span className="text-gray-300">{meta.primaryTopic}</span>
                    </div>
                  )}
                  {meta.plannerDay != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Day:</span>
                      <span className="text-gray-300">Day {meta.plannerDay}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="text-gray-300">{post.created_at ? formatDate(post.created_at) : 'Never'}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#2A2A2E] flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-[#2A2A2E] text-gray-300 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/posts/${post.id}`)
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-[#2A2A2E] text-gray-300 hover:text-white">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#111113] border-[#2A2A2E]">
                      <DropdownMenuItem 
                        className="text-gray-300 hover:bg-[#2A2A2E] hover:text-white"
                        onClick={() => router.push(`/posts/${post.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-[#2A2A2E] hover:text-white">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#2A2A2E]" />
                      <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </PremiumCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
