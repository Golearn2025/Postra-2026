import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { appConfig } from '@/config/app-config'

const PUBLIC_PATHS = ['/login', '/auth/callback', '/auth/confirm']
const ONBOARDING_PATH = '/onboarding'
const API_PATHS = ['/api/']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  const isOnboardingPath = pathname.startsWith(ONBOARDING_PATH)
  const isApiPath = API_PATHS.some((p) => pathname.startsWith(p))

  // Redirect unauthenticated users to login
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = appConfig.routes.login
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login
  if (user && isPublicPath && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = appConfig.routes.home
    return NextResponse.redirect(url)
  }

  // Check onboarding status for authenticated users (but skip API paths)
  if (user && !isPublicPath && !isApiPath) {
    // Get selected organization from cookie
    const selectedOrgSlug = request.cookies.get('selected-org')?.value

    if (selectedOrgSlug) {
      // Get organization ID from slug
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', selectedOrgSlug)
        .single()

      if (org) {
        // Check onboarding status
        const { data: onboardingStatus } = await supabase
          .from('app_organization_onboarding_status')
          .select('is_onboarding_completed')
          .eq('organization_id', org.id)
          .single()

        // If onboarding not completed and not already on onboarding page, redirect
        if (onboardingStatus && !onboardingStatus.is_onboarding_completed && !isOnboardingPath) {
          const url = request.nextUrl.clone()
          url.pathname = ONBOARDING_PATH
          return NextResponse.redirect(url)
        }

        // If onboarding completed and on onboarding page, redirect to dashboard
        if (onboardingStatus && onboardingStatus.is_onboarding_completed && isOnboardingPath) {
          const url = request.nextUrl.clone()
          url.pathname = appConfig.routes.home
          return NextResponse.redirect(url)
        }
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
