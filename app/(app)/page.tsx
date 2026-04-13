import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { appConfig } from '@/config/app-config'

export const metadata: Metadata = { title: 'Home' }

export default function HomePage() {
  redirect(appConfig.routes.home)
}
