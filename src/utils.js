const moment = require('moment-timezone')
const winston = require('winston')
const chalk = require('chalk')

export const logger = new (winston.Logger)({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new (winston.transports.Console)({
      timestamp: () => moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
      formatter: (options) => {
        let timestamp = options.timestamp()
        let level = options.level.toUpperCase()
        let message = (options.message ? options.message : '')
        // let meta = options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : ''
        return `[${chalk.white(timestamp)}][C*] ${chalk.bold(level)} ${message}`
      }
    })
  ]
})
