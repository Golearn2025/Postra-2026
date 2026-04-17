import { logger } from './logger'

export interface PerformanceContext {
  scope: string
  functionName: string
  route?: string
  sourceType?: 'view' | 'table'
  sourceName?: string
  organizationId?: string
  userId?: string
}

export interface DuplicateFetchTracker {
  [key: string]: {
    count: number
    lastCalled: number
    context: PerformanceContext
  }
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private duplicateFetchTracker: DuplicateFetchTracker = {}
  private routeTimers: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  measureAsync<T>(
    context: PerformanceContext,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now()
    const key = this.generateFunctionKey(context)

    this.trackDuplicateFetch(key, context)

    return fn().then(
      result => {
        const duration = Date.now() - startTime
        logger.logInfo({
          scope: context.scope,
          functionName: context.functionName,
          route: context.route,
          sourceType: context.sourceType,
          sourceName: context.sourceName,
          organizationId: context.organizationId,
          userId: context.userId,
          durationMs: duration,
          ok: true
        }, `Function completed: ${context.functionName}`)
        return result
      },
      error => {
        const duration = Date.now() - startTime
        logger.logError({
          scope: context.scope,
          functionName: context.functionName,
          route: context.route,
          sourceType: context.sourceType,
          sourceName: context.sourceName,
          organizationId: context.organizationId,
          userId: context.userId,
          durationMs: duration,
          ok: false,
          errorMessage: error instanceof Error ? error.message : String(error)
        }, `Function failed: ${context.functionName}`)
        throw error
      }
    )
  }

  startRouteTimer(route: string, context: { organizationId?: string; userId?: string }): void {
    this.routeTimers.set(route, Date.now())
    logger.logInfo({
      scope: 'route',
      route,
      organizationId: context.organizationId,
      userId: context.userId,
      functionName: 'routeStart'
    }, `Route started: ${route}`)
  }

  endRouteTimer(route: string, context: { organizationId?: string; userId?: string; success?: boolean; error?: string }): void {
    const startTime = this.routeTimers.get(route)
    if (!startTime) {
      logger.logWarn({
        scope: 'route',
        route,
        organizationId: context.organizationId,
        userId: context.userId,
        functionName: 'routeEnd'
      }, `Route timer not found for: ${route}`)
      return
    }

    const duration = Date.now() - startTime
    this.routeTimers.delete(route)

    logger.logRouteTiming({
      route,
      organizationId: context.organizationId,
      userId: context.userId,
      durationMs: duration,
      ok: context.success !== false,
      errorMessage: context.error
    })
  }

  measureDbQuery<T>(
    context: {
      functionName: string
      sourceType: 'view' | 'table'
      sourceName: string
      organizationId?: string
      userId?: string
    },
    query: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now()

    return query().then(
      result => {
        const duration = Date.now() - startTime
        const rowCount = Array.isArray(result) ? result.length : 1

        logger.logDbQuery({
          functionName: context.functionName,
          sourceType: context.sourceType,
          sourceName: context.sourceName,
          organizationId: context.organizationId,
          userId: context.userId,
          durationMs: duration,
          rowCount,
          ok: true
        })

        return result
      },
      error => {
        const duration = Date.now() - startTime

        logger.logDbQuery({
          functionName: context.functionName,
          sourceType: context.sourceType,
          sourceName: context.sourceName,
          organizationId: context.organizationId,
          userId: context.userId,
          durationMs: duration,
          rowCount: 0,
          ok: false,
          errorMessage: error instanceof Error ? error.message : String(error)
        })

        throw error
      }
    )
  }

  measureOrganizationSwitch<T>(
    context: {
      fromOrganizationId: string
      toOrganizationId: string
      userId: string
    },
    switchFn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now()

    return switchFn().then(
      result => {
        const duration = Date.now() - startTime

        logger.logOrganizationSwitch({
          fromOrganizationId: context.fromOrganizationId,
          toOrganizationId: context.toOrganizationId,
          userId: context.userId,
          durationMs: duration,
          ok: true
        })

        return result
      },
      error => {
        const duration = Date.now() - startTime

        logger.logOrganizationSwitch({
          fromOrganizationId: context.fromOrganizationId,
          toOrganizationId: context.toOrganizationId,
          userId: context.userId,
          durationMs: duration,
          ok: false,
          errorMessage: error instanceof Error ? error.message : String(error)
        })

        throw error
      }
    )
  }

  private generateFunctionKey(context: PerformanceContext): string {
    return `${context.scope}:${context.functionName}:${context.organizationId || 'no-org'}:${context.userId || 'no-user'}`
  }

  private trackDuplicateFetch(key: string, context: PerformanceContext): void {
    const now = Date.now()
    const existing = this.duplicateFetchTracker[key]

    if (existing) {
      existing.count++
      existing.lastCalled = now

      if (existing.count > 1) {
        logger.logWarn({
          scope: 'duplicate_fetch',
          functionName: context.functionName,
          organizationId: context.organizationId,
          userId: context.userId,
          durationMs: 0,
          ok: true
        }, `Duplicate fetch detected: ${key} (count: ${existing.count})`)
      }
    } else {
      this.duplicateFetchTracker[key] = {
        count: 1,
        lastCalled: now,
        context
      }
    }

    this.cleanupOldDuplicateEntries(now)
  }

  private cleanupOldDuplicateEntries(now: number): void {
    const fiveMinutesAgo = now - 5 * 60 * 1000

    Object.keys(this.duplicateFetchTracker).forEach(key => {
      if (this.duplicateFetchTracker[key].lastCalled < fiveMinutesAgo) {
        delete this.duplicateFetchTracker[key]
      }
    })
  }

  getDuplicateFetchReport(): DuplicateFetchTracker {
    return { ...this.duplicateFetchTracker }
  }

  clearDuplicateFetchTracker(): void {
    this.duplicateFetchTracker = {}
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()
