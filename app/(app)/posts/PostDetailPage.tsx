'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { ArrowLeft, Edit, Save, Eye, Copy, Archive, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { AppPostsListItem } from '@/types/views'

interface PostDetailPageProps {
  post: AppPostsListItem
  organizationId: string
  userId: string
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  planned: 'bg-amber-100 text-amber-700',
  paused: 'bg-orange-100 text-orange-700',
  published: 'bg-green-100 text-green-700',
}

export function PostDetailPage({ post, organizationId, userId }: PostDetailPageProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedPost, setEditedPost] = useState({
    title: post.title,
    caption: post.caption_master || '',
  })

  const metadata = post.metadata as Record<string, unknown> | null ?? {}
  const primaryTopic = metadata.primaryTopic as string | null
  const plannerDay = metadata.plannerDay as number | null

  const handleSave = async () => {
    // TODO: Implement save functionality
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedPost({
      title: post.title,
      caption: post.caption_master || '',
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Post Detail</h1>
            <p className="text-gray-400">
              {post.campaign_name || 'No campaign'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={STATUS_COLORS[post.status] || STATUS_COLORS.draft}>
              {post.status}
            </Badge>

            {isEditing ? (
              <>
                <Button onClick={handleCancel} variant="outline" className="border-[#2A2A2E] text-gray-300 hover:text-white">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline" className="border-[#2A2A2E] text-gray-300 hover:text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="border-[#2A2A2E] text-gray-300 hover:text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" className="border-[#2A2A2E] text-gray-300 hover:text-white">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline" className="border-[#2A2A2E] text-gray-300 hover:text-white">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button variant="outline" className="border-red-500/50 text-red-400 hover:text-red-300 hover:border-red-500">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <PremiumCard variant="dark">
            <div className="space-y-4">
              <label className="text-sm text-gray-400 block">Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPost.title}
                  onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                  className="w-full bg-[#111113] border border-[#2A2A2E] rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                />
              ) : (
                <h2 className="text-xl font-semibold text-white">{post.title}</h2>
              )}
            </div>
          </PremiumCard>

          {/* Caption */}
          <PremiumCard variant="dark">
            <div className="space-y-4">
              <label className="text-sm text-gray-400 block">Caption</label>
              {isEditing ? (
                <textarea
                  value={editedPost.caption}
                  onChange={(e) => setEditedPost({ ...editedPost, caption: e.target.value })}
                  className="w-full bg-[#111113] border border-[#2A2A2E] rounded-lg p-3 text-white focus:border-blue-500 outline-none min-h-[200px] resize-y"
                />
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap">{post.caption_master || 'No caption'}</p>
              )}
            </div>
          </PremiumCard>

          {/* Hashtags */}
          {post.hashtags && (
            <PremiumCard variant="dark">
              <div className="space-y-4">
                <label className="text-sm text-gray-400 block">Hashtags</label>
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.split(',').map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-[#2A2A2E] text-blue-400">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </PremiumCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <PremiumCard variant="dark">
            <h3 className="text-lg font-semibold text-white mb-4">Metadata</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <Badge className={STATUS_COLORS[post.status] || STATUS_COLORS.draft}>
                  {post.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Source:</span>
                <span className="text-gray-300">{post.source}</span>
              </div>
              {primaryTopic && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Topic:</span>
                  <span className="text-gray-300">{primaryTopic}</span>
                </div>
              )}
              {plannerDay != null && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Day:</span>
                  <span className="text-gray-300">Day {plannerDay}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Created:</span>
                <span className="text-gray-300">
                  {new Date(post.created_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {post.scheduled_for && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Scheduled:</span>
                  <span className="text-gray-300">
                    {new Date(post.scheduled_for).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>
          </PremiumCard>

          {/* Actions */}
          <PremiumCard variant="dark">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full border-[#2A2A2E] text-gray-300 hover:text-white justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Preview Post
              </Button>
              <Button variant="outline" className="w-full border-[#2A2A2E] text-gray-300 hover:text-white justify-start">
                <Copy className="h-4 w-4 mr-2" />
                Copy Caption
              </Button>
              <Button variant="outline" className="w-full border-[#2A2A2E] text-gray-300 hover:text-white justify-start">
                <Archive className="h-4 w-4 mr-2" />
                Archive Post
              </Button>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  )
}
