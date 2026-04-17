export interface LogContext {
  scope: string
  route?: string
  functionName?: string
  sourceType?: 'view' | 'table'
  sourceName?: string
  organizationId?: string
  userId?: string
  durationMs?: number
  rowCount?: number
  ok?: boolean
  errorMessage?: string
  timestamp?: string
}

export interface LogEntry {
  level: 'INFO' | 'WARN' | 'ERROR'
  context: LogContext
  message?: string
}

class Logger {
  private static instance: Logger
  private logBuffer: LogEntry[] = []
  private maxBufferSize = 1000

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private createLogEntry(level: LogEntry['level'], context: LogContext, message?: string): LogEntry {
    return {
      level,
      context: {
        ...context,
        timestamp: new Date().toISOString()
      },
      message
    }
  }

  private log(entry: LogEntry): void {
    this.logBuffer.push(entry)
    
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize)
    }

    if (process.env.NODE_ENV === 'development') {
      const logOutput = {
        [entry.level.toLowerCase()]: entry.message || 'No message',
        ...entry.context
      }
      console.log(JSON.stringify(logOutput, null, 2))
    }
  }

  logInfo(context: LogContext, message?: string): void {
    this.log(this.createLogEntry('INFO', context, message))
  }

  logWarn(context: LogContext, message?: string): void {
    this.log(this.createLogEntry('WARN', context, message))
  }

  logError(context: LogContext, message?: string): void {
    this.log(this.createLogEntry('ERROR', context, message))
  }

  logDbQuery(context: {
    functionName: string
    sourceType: 'view' | 'table'
    sourceName: string
    organizationId?: string
    userId?: string
    durationMs: number
    rowCount: number
    ok: boolean
    errorMessage?: string
  }): void {
    this.logInfo({
      scope: 'database',
      ...context
    }, `DB Query: ${context.functionName} on ${context.sourceName}`)
  }

  logRouteTiming(context: {
    route: string
    organizationId?: string
    userId?: string
    durationMs: number
    ok: boolean
    errorMessage?: string
  }): void {
    this.logInfo({
      scope: 'route',
      ...context
    }, `Route timing: ${context.route}`)
  }

  logOrganizationSwitch(context: {
    fromOrganizationId: string
    toOrganizationId: string
    userId: string
    durationMs: number
    ok: boolean
    errorMessage?: string
  }): void {
    this.logInfo({
      scope: 'organization_switch',
      functionName: 'switchOrganization',
      organizationId: context.toOrganizationId,
      userId: context.userId,
      durationMs: context.durationMs,
      ok: context.ok,
      errorMessage: context.errorMessage
    }, `Organization switch: ${context.fromOrganizationId} -> ${context.toOrganizationId}`)
  }

  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logBuffer.slice(-count)
  }

  getLogsByScope(scope: string, count: number = 100): LogEntry[] {
    return this.logBuffer
      .filter(entry => entry.context.scope === scope)
      .slice(-count)
  }

  clearBuffer(): void {
    this.logBuffer = []
  }
}

export const logger = Logger.getInstance()
