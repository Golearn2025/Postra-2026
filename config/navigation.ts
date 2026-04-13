import {
  LayoutDashboard,
  Megaphone,
  ImageIcon,
  Upload,
  FileText,
  CalendarDays,
  Share2,
  Activity,
  CalendarClock,
  Sparkles,
  Settings,
  Wand2,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string | number
  isNew?: boolean
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

export const mainNavSections: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
      { label: 'Campaign Planner', href: '/campaign-planner', icon: Wand2, isNew: true },
      { label: 'Posts & Variants', href: '/posts', icon: FileText },
      { label: 'Media Library', href: '/media-library', icon: ImageIcon },
      { label: 'Bulk Import', href: '/bulk-import', icon: Upload },
      { label: 'Calendar', href: '/calendar', icon: CalendarDays },
    ],
  },
  {
    title: 'Publishing',
    items: [
      { label: 'Social Accounts', href: '/social-accounts', icon: Share2 },
      { label: 'Publish Logs', href: '/publish-logs', icon: Activity },
      { label: 'Recurring Events', href: '/recurring-events', icon: CalendarClock },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'AI Studio', href: '/ai-studio', icon: Sparkles, isNew: true },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]
