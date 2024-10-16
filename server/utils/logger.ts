import query from '../db'
type LogLevel = 'debug' | 'error' | 'fatal' | 'info' | 'warn';

interface LogEntry {
    level: LogLevel;
    source: string;
    message: string;
    context?: any;
}

export function log(entry: LogEntry): void {
    const { level, source, message, context } = entry
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [${level.toUpperCase()}] [${source}] ${message}`)

    if (context) {
        query('insert into logs.entries (level, source, message, context) values ($1, $2, $3, $4)', [level, source, message, context])
    } else {
        query('insert into logs.entries (level, source, message) values ($1, $2, $3)', [level, source, message])
    }
}