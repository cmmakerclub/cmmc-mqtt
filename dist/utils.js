'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var moment = require('moment-timezone');
var winston = require('winston');
var chalk = require('chalk');

var logger = exports.logger = new winston.Logger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [new winston.transports.Console({
    timestamp: function timestamp() {
      return moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
    },
    formatter: function formatter(options) {
      var timestamp = options.timestamp();
      var level = options.level.toUpperCase();
      var message = options.message ? options.message : '';
      // let meta = options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : ''
      if (process.env.LOG_SHOW_TIMESTAMP) {
        return '[' + chalk.white(timestamp) + '] ' + chalk.bold(level) + ' ' + message;
      } else {
        return '[' + chalk.bold(level) + '] ' + message;
      }
    }
  })]
});
//# sourceMappingURL=utils.js.map
