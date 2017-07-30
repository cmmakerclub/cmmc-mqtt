'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var _mqtt2 = require('mqtt');

var _mqtt3 = _interopRequireDefault(_mqtt2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  create: function create(connectString) {
    var subTopics = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var autoconnect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var _forwardClient = void 0,
        _forwardPrefix = void 0;
    var _mqtt = _mqtt3.default.connect(connectString);
    var _callbacks = {
      on_connected: function on_connected() {},
      on_connecting: function on_connecting() {},
      on_message: function on_message(topic, payload) {},
      on_close: function on_close() {},
      on_error: function on_error() {},
      on_packetsend: function on_packetsend(packet) {
        if (packet.cmd === 'subscribe') {
          _utils.logger.info('subscribing to topic = ' + JSON.stringify(packet.subscriptions));
        } else {
          _utils.logger.debug('cmd = ' + packet.cmd + ', packet = ' + JSON.stringify(packet));
        }
      }
    };
    var ret = {
      connect: function connect() {
        _utils.logger.debug('connecting to mqtt broker with ' + connectString);
        _callbacks.on_connecting.call(undefined);
        // register callbacks
        _mqtt.on('packetsend', _callbacks.on_packetsend);
        _mqtt.on('message', function (topic, payload) {
          _callbacks.on_message(topic, payload);
          if (_forwardClient) {
            _utils.logger.verbose('publish: ' + _forwardPrefix + topic);
            _utils.logger.debug(payload.toString('hex'));
            _forwardClient.publish('' + _forwardPrefix + topic, payload);
          }
        });
        _mqtt.on('close', _callbacks.on_close);
        _mqtt.on('error', _callbacks.on_error);
        _mqtt.on('connect', function () {
          _utils.logger.verbose('mqtt connected');
          _callbacks.on_connected.call(undefined);
          subTopics.forEach(function (topic, idx) {
            _utils.logger.verbose('subscribe topic: ' + topic);
            _mqtt.subscribe(topic);
          });
        });
      },
      register: function register(cbName, func) {
        if (_callbacks[cbName]) {
          _utils.logger.verbose('register callback ' + cbName);
          _callbacks[cbName] = func;
        } else {
          _utils.logger.verbose('try to register unlisted callback = ' + cbName);
        }
      },
      forward: function forward(mqttClient, options) {
        options.prefix = options.prefix || '';
        _utils.logger.debug('prefix = ' + options.prefix);
        _forwardClient = mqttClient;
        _forwardPrefix = options.prefix;
      },
      publish: function publish(topic, payload) {
        _mqtt.publish(topic, payload);
      }
    };

    if (autoconnect) {
      ret.connect();
    }
    return ret;
  }
};
//# sourceMappingURL=cmmc-mqtt.js.map
