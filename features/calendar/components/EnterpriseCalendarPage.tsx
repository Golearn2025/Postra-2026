'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Grid3X3,
  List,
  Filter,
  Plus,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { StatCard } from '@/components/premium/StatCard'
import { FilterDropdown } from '@/components/premium/FilterDropdown'
import type { AppCalendarSlotListItem } from '@/types/views'

interface EnterpriseCalendarPageProps {
  slots: AppCalendarSlotListItem[]
  campaigns: Array<{ id: string; name: string }>
  stats: {
    activeCampaigns: number
    plannedPosts: number
    nextPublish: { date: string; time: string; title: string } | null
    publishedThisMonth: number
  }
}

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned' },
  { value: 'published', label: 'Published' },
  { value: 'paused', label: 'Paused' },
  { value: 'draft', label: 'Draft' },
]

const STATUS_COLORS: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
  paused: 'bg-orange-100 text-orange-700',
  draft: 'bg-gray-100 text-gray-700',
}

const STATUS_COLORS_DARK: Record<string, string> = {
  planned: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  published: 'bg-green-500/20 text-green-400 border-green-500/30',
  paused: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export function EnterpriseCalendarPage({ 
  slots, 
  campaigns, 
  stats 
}: EnterpriseCalendarPageProps) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'year' | 'agenda'>('month')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [campaignFilter, setCampaignFilter] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Filter slots
  const filteredSlots = useMemo(() => {
    return slots.filter(slot => {
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(slot.slot_status)
      const matchesCampaign = campaignFilter.length === 0 || 
        (slot.campaign_id && campaignFilter.includes(slot.campaign_id))
      return matchesStatus && matchesCampaign
    })
  }, [slots, statusFilter, campaignFilter])

  // Calendar grid generation
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
      if (days.length >= 35 && current.getMonth() !== month) break
    }
    
    return days
  }, [currentDate])

  // Get slots for a specific date
  const getSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return filteredSlots.filter(slot => slot.slot_date === dateStr)
  }

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '10:00 AM'
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getMetadata = (slot: AppCalendarSlotListItem) => {
    const meta = slot.post_metadata as Record<string, unknown> | null ?? {}
    return {
      primaryTopic: meta.primaryTopic as string | null,
      plannerDay: meta.plannerDay as number | null,
    }
  }

  // Upcoming items for sidebar
  const upcomingSlots = useMemo(() => {
    const now = new Date()
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(now.getDate() + 7)
    
    return filteredSlots
      .filter(slot => {
        const slotDate = new Date(slot.slot_date)
        return slotDate >= now && slotDate <= sevenDaysFromNow && slot.assigned_post_id
      })
      .sort((a, b) => {
        const dateCompare = a.slot_date.localeCompare(b.slot_date)
        if (dateCompare !== 0) return dateCompare
        return (a.slot_time || '').localeCompare(b.slot_time || '')
      })
      .slice(0, 5)
  }, [filteredSlots])

  return (
    <div 
      className="min-h-screen text-white p-6 dark" 
      style={{ backgroundColor: '#0B0B0D' }}
    >
      {/* Header with Stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Calendar</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Active Campaigns"
            value={stats.activeCampaigns}
            icon={<Target className="h-5 w-5" />}
            variant="gold"
          />
          
          <StatCard
            title="Planned Posts"
            value={stats.plannedPosts}
            icon={<Calendar className="h-5 w-5" />}
            variant="gold"
          />
          
          <StatCard
            title="Next Publish"
            value={stats.nextPublish ? 
              `${new Date(stats.nextPublish.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${formatTime(stats.nextPublish.time)}` : 
              'No scheduled posts'
            }
            icon={<Clock className="h-5 w-5" />}
            variant="gold"
          />
          
          <StatCard
            title="Published This Month"
            value={stats.publishedThisMonth}
            icon={<TrendingUp className="h-5 w-5" />}
            variant="gold"
          />
        </div>

        {/* Navigation Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-[#111113] border border-[#2A2A2E] rounded-xl p-4">
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('month')}
              className={cn(
                'border-[#2A2A2E] text-gray-400 hover:text-white',
                viewMode === 'month' && 'bg-[#2A2A2E] text-blue-400 border-blue-500/50'
              )}
            >
              Month
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('week')}
              className={cn(
                'border-[#2A2A2E] text-gray-400 hover:text-white',
                viewMode === 'week' && 'bg-[#2A2A2E] text-blue-400 border-blue-500/50'
              )}
            >
              Week
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('year')}
              className={cn(
                'border-[#2A2A2E] text-gray-400 hover:text-white',
                viewMode === 'year' && 'bg-[#2A2A2E] text-blue-400 border-blue-500/50'
              )}
            >
              Year
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('agenda')}
              className={cn(
                'border-[#2A2A2E] text-gray-400 hover:text-white',
                viewMode === 'agenda' && 'bg-[#2A2A2E] text-blue-400 border-blue-500/50'
              )}
            >
              Agenda
            </Button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(-1)}
              className="text-gray-400 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h2 className="text-lg font-semibold text-white min-w-[200px] text-center">
              {formatDate(currentDate)}
            </h2>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(1)}
              className="text-gray-400 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="border-[#2A2A2E] text-gray-400 hover:text-white"
            >
              Today
            </Button>
          </div>

          {/* Filters and Actions */}
          <div className="flex gap-3 items-center">
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
            
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
              <Plus className="h-4 w-4 mr-2" />
              Bulk Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          {viewMode === 'month' ? (
            <PremiumCard variant="dark" padding="none">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 border-b border-[#2A2A2E]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                  const isToday = date.toDateString() === new Date().toDateString()
                  const daySlots = getSlotsForDate(date)
                  const meta = daySlots[0] ? getMetadata(daySlots[0]) : null
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        'min-h-[100px] border-r border-b border-[#2A2A2E] p-2 cursor-pointer transition-colors',
                        !isCurrentMonth && 'opacity-40',
                        isToday && 'bg-blue-500/10',
                        'hover:bg-[#1A1A1D]'
                      )}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className={cn(
                        'text-sm font-medium mb-1',
                        isToday && 'text-blue-400'
                      )}>
                        {date.getDate()}
                      </div>
                      
                      {daySlots.length > 0 && (
                        <div className="space-y-1">
                          {daySlots.slice(0, 3).map((slot, idx) => (
                            <div
                              key={slot.id}
                              className={cn(
                                'text-xs p-1 rounded border cursor-pointer hover:opacity-80',
                                STATUS_COLORS_DARK[slot.slot_status]
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (slot.assigned_post_id) {
                                  router.push(`/posts/${slot.assigned_post_id}`)
                                }
                              }}
                            >
                              <div className="truncate font-medium">
                                {slot.post_title || 'Untitled'}
                              </div>
                              {slot.slot_time && (
                                <div className="text-xs opacity-75">
                                  {formatTime(slot.slot_time)}
                                </div>
                              )}
                            </div>
                          ))}
                          {daySlots.length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{daySlots.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </PremiumCard>
          ) : viewMode === 'agenda' ? (
            <PremiumCard variant="dark" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Agenda View</h3>
              
              <div className="space-y-6">
                {Array.from(
                  new Set(
                    filteredSlots
                      .filter(slot => slot.assigned_post_id)
                      .map(slot => slot.slot_date)
                      .sort()
                  )
                ).map(dateStr => {
                  const daySlots = filteredSlots.filter(slot => slot.slot_date === dateStr && slot.assigned_post_id)
                  const date = new Date(dateStr)
                  
                  return (
                    <div key={dateStr}>
                      <h4 className="font-medium text-white mb-3">
                        {date.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      
                      <div className="space-y-2">
                        {daySlots
                          .sort((a, b) => (a.slot_time || '').localeCompare(b.slot_time || ''))
                          .map(slot => {
                            const meta = getMetadata(slot)
                            return (
                              <div
                                key={slot.id}
                                className="bg-[#111113] border border-[#2A2A2E] rounded-lg p-4 hover:border-blue-500/50 cursor-pointer transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-blue-400 font-medium">
                                        {formatTime(slot.slot_time)}
                                      </span>
                                      <Badge className={STATUS_COLORS[slot.slot_status] || STATUS_COLORS.draft}>
                                        {slot.slot_status}
                                      </Badge>
                                    </div>
                                    
                                    <h5 className="font-medium text-white mb-1">
                                      {slot.post_title || 'Untitled Post'}
                                    </h5>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                      {slot.campaign_name && (
                                        <span>{slot.campaign_name}</span>
                                      )}
                                      {meta.primaryTopic && (
                                        <span>Topic: {meta.primaryTopic}</span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-gray-400 hover:text-white"
                                      onClick={() => {
                                        if (slot.assigned_post_id) {
                                          router.push(`/posts/${slot.assigned_post_id}`)
                                        }
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )
                })}
                
                {filteredSlots.filter(slot => slot.assigned_post_id).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No scheduled posts found</p>
                  </div>
                )}
              </div>
            </PremiumCard>
          ) : viewMode === 'year' ? (
            <PremiumCard variant="dark" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Year View - {currentDate.getFullYear()}</h3>
              
              {/* Year Grid */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 12 }, (_, i) => {
                  const monthDate = new Date(currentDate.getFullYear(), i, 1)
                  const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' })
                  const monthSlots = filteredSlots.filter(slot => {
                    const slotDate = new Date(slot.slot_date)
                    return slotDate.getMonth() === i && slotDate.getFullYear() === currentDate.getFullYear()
                  })
                  
                  return (
                    <div
                      key={i}
                      className="bg-[#111113] border border-[#2A2A2E] rounded-xl p-4 hover:border-blue-500/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setCurrentDate(monthDate)
                        setViewMode('month')
                      }}
                    >
                      <h4 className="font-semibold text-white mb-2">{monthName}</h4>
                      <div className="text-sm text-gray-400">
                        {monthSlots.length} post{monthSlots.length !== 1 ? 's' : ''}
                      </div>
                      {monthSlots.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {monthSlots.slice(0, 2).map(slot => (
                            <div key={slot.id} className="text-xs text-gray-300 truncate">
                              {slot.post_title || 'Untitled'}
                            </div>
                          ))}
                          {monthSlots.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{monthSlots.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* Year Stats */}
              <div className="mt-6 pt-6 border-t border-[#2A2A2E]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {filteredSlots.length}
                    </div>
                    <div className="text-sm text-gray-400">Total Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {filteredSlots.filter(s => s.slot_status === 'published').length}
                    </div>
                    <div className="text-sm text-gray-400">Published</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {filteredSlots.filter(s => s.slot_status === 'planned').length}
                    </div>
                    <div className="text-sm text-gray-400">Planned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      {filteredSlots.filter(s => s.slot_status === 'canceled').length}
                    </div>
                    <div className="text-sm text-gray-400">Canceled</div>
                  </div>
                </div>
              </div>
            </PremiumCard>
          ) : (
            <PremiumCard variant="dark" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Week View</h3>
              <div className="text-center py-8">
                <p className="text-gray-400">Week view coming soon</p>
              </div>
            </PremiumCard>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Posts */}
          <PremiumCard variant="dark" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upcoming (Next 7 Days)</h3>
            
            <div className="space-y-3">
              {upcomingSlots.length > 0 ? (
                upcomingSlots.map(slot => {
                  const meta = getMetadata(slot)
                  return (
                    <div
                      key={slot.id}
                      className="bg-[#111113] border border-[#2A2A2E] rounded-lg p-3 hover:border-blue-500/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                          <div className="text-xs text-gray-400 mb-1">
                            {new Date(slot.slot_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} at {formatTime(slot.slot_time)}
                          </div>
                          
                          <div className="font-medium text-white text-sm mb-1 line-clamp-1">
                            {slot.post_title || 'Untitled'}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={STATUS_COLORS_DARK[slot.slot_status] || STATUS_COLORS_DARK.draft}>
                              {slot.slot_status}
                            </Badge>
                            {slot.campaign_name && (
                              <span className="text-xs text-gray-400 truncate">
                                {slot.campaign_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">No upcoming posts</p>
                </div>
              )}
            </div>
            
            {upcomingSlots.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4 border-[#2A2A2E] text-gray-300 hover:bg-[#2A2A2E] hover:text-white"
              >
                View Full Agenda
              </Button>
            )}
          </PremiumCard>

          {/* Quick Actions */}
          <PremiumCard variant="dark" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-[#2A2A2E] text-gray-300 hover:bg-[#2A2A2E] hover:text-white"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule Post
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-[#2A2A2E] text-gray-300 hover:bg-[#2A2A2E] hover:text-white"
              >
                <Clock className="h-5 w-5 text-blue-400 mr-2" />
                Reschedule
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-[#2A2A2E] text-gray-300 hover:bg-[#2A2A2E] hover:text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  )
}
