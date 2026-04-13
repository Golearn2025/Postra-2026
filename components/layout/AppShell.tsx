import { SidebarNav } from './SidebarNav'
import { TopBar } from './TopBar'
import type { AppUser } from '@/types/app'

interface AppShellProps {
  user: AppUser
  children: React.ReactNode
}

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas-bg">
      <SidebarNav user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar user={user} />
        <main className="flex-1 overflow-y-auto content-scroll p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
