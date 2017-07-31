'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var moment = require('moment-timezone');
var winston = require('winston');
var chalk = require('chalk');

console.log('env.LOG_LEVEL = ' + process.env.LOG_LEVEL);
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
      return '[CMMC-MQTT][' + chalk.white(timestamp) + '] ' + chalk.bold(level) + ' ' + message;
    }
  })]
});
//# sourceMappingURL=utils.js.map
