import { performanceMonitor } from './performance'
import { logger } from './logger'

export interface RouteContext {
  route: string
  organizationId?: string
  userId?: string
}

export async function withRouteInstrumentation<T>(
  context: RouteContext,
  routeFn: () => Promise<T>
): Promise<T> {
  performanceMonitor.startRouteTimer(context.route, context)
  
  try {
    const result = await routeFn()
    performanceMonitor.endRouteTimer(context.route, {
      ...context,
      success: true
    })
    return result
  } catch (error) {
    performanceMonitor.endRouteTimer(context.route, {
      ...context,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    })
    throw error
  }
}

export function createRouteInstrumentationWrapper(routeName: string) {
  return async function withInstrumentation<T>(
    userId: string | undefined,
    organizationId: string | undefined,
    routeFn: () => Promise<T>
  ): Promise<T> {
    return withRouteInstrumentation({
      route: routeName,
      userId,
      organizationId
    }, routeFn)
  }
}
