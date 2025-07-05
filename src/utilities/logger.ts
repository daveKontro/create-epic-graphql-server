const path = require('path')
const chalk = require('chalk')
const winston = require('winston')
require('winston-daily-rotate-file')
const packageJson = require('../../package.json')
import type { Logger } from 'winston'
import type { Format } from 'logform'
import { NodeEnv, LogLevel, LogFile } from '../typing/enums'

require('dotenv-flow').config()

const NODE_ENV = process.env.NODE_ENV as NodeEnv || NodeEnv.development

// NOTE:
// 1) production
//   a) write log file in json to enable log analytics
//   b) INFO logging enabled... to be used sparingly
// 2) development
//   a) display logs in console in more readable format, and 
//      write to log files to align prod and dev behavior
//   b) VERBOSE logging enabled

class CustomLogger {
  private dirPath: string
  private locales: string
  private timeZone: string
  private settings: {
    [key in NodeEnv]: {
      level: keyof typeof winston.config.npm.levels,
    }
  }
  log: Logger | null

  constructor (options?: {
    dirPath: string
    locales: string
    timeZone: string
  }) {
    this.dirPath = options?.dirPath || 'tmp'
    this.locales = options?.locales || 'en-US'
    this.timeZone = options?.timeZone || 'UTC'  // 'America/New_York'

    this.settings = {
      [NodeEnv.production]: {
        level: LogLevel.info,
      },
      [NodeEnv.test]: {
        level: LogLevel.info,
      },
      [NodeEnv.development]: {
        level: LogLevel.verbose,
      },
    }

    this.log = null

    this.initWinston()
  }

  private initWinston() {
    const {
      combine,
      timestamp,
      json,
      simple,
      colorize,
    } = winston.format

    const transportsOptions = {
      frequency: '24h',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }

    const formatFileName = (fileType: LogFile) => {
      const file = `${packageJson.name}_${fileType}_%DATE%.log`

      return path.join('/', this.dirPath, file)
    }

    const transports = [
      new winston.transports.DailyRotateFile({
        level: LogLevel.error,
        filename: formatFileName(LogFile.error),
        frequency: transportsOptions.frequency,
        datePattern: transportsOptions.datePattern,
        zippedArchive: transportsOptions.zippedArchive,
        maxSize: transportsOptions.maxSize,
        maxFiles: transportsOptions.maxFiles,
      }),
      new winston.transports.DailyRotateFile({
        filename: formatFileName(LogFile.combined),
        frequency: transportsOptions.frequency,
        datePattern: transportsOptions.datePattern,
        zippedArchive: transportsOptions.zippedArchive,
        maxSize: transportsOptions.maxSize,
        maxFiles: transportsOptions.maxFiles,
      }),
    ]

    let format: Format

    if (NODE_ENV === NodeEnv.production) {
      format = combine(timestamp(), json())
    } else {
      format = combine(simple(), colorize())
      transports.push(new winston.transports.Console({ format }))
    }

    const level = this.settings[NODE_ENV].level

    return this.log = winston.createLogger({
      level,
      format,
      transports,
    })
  }

  logTimeStamp = (options?: {
    msg?: string,
  }) => {
    const msg = options?.msg || ''

    const now = new Date()

    const time = now.toLocaleString(this.locales, {
      timeZone: this.timeZone,
      timeStyle: 'long',
      dateStyle: 'short',
      hour12: false,
    })

    const timeStamp = chalk.grey(`[${time}]`)

    return this.log?.info(`${msg} ${timeStamp}`)
  }

  logEnv = ({
    msg,
  }:{
    msg: string,
  }) => {
    const env = chalk.grey(`[${NODE_ENV}]`)

    return this.log?.info(`${msg} ${env}`)
  }
}

const logger = new CustomLogger()

export = logger
