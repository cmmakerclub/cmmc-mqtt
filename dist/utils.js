'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = undefined;

var _conf = require('./conf');

var _conf2 = _interopRequireDefault(_conf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moment = require('moment-timezone');
var winston = require('winston');
var chalk = require('chalk');

var logger = exports.logger = new winston.Logger({
  level: _conf2.default.LOG_LEVEL,
  transports: [new winston.transports.Console({
    timestamp: function timestamp() {
      return moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
    },
    formatter: function formatter(options) {
      var timestamp = options.timestamp();
      var level = options.level.toUpperCase();
      var message = options.message ? options.message : '';
      // let meta = options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : ''
      return '[' + chalk.white(timestamp) + '] ' + chalk.bold(level) + ' ' + message;
    }
  })]
});
//# sourceMappingURL=utils.js.map
