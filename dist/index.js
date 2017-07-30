'use strict';

var _cmmcMqtt = require('./cmmc-mqtt');

var _cmmcMqtt2 = _interopRequireDefault(_cmmcMqtt);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mqttConfig = { host: 'mqtt://mqtt.cmmc.io', port: 1883, username: '', password: '', clientId: '' };

var mqttClient1 = _cmmcMqtt2.default.create(mqttConfig, ['ESPNOW/18fe34db3b98/+/status']);
var mqttClient2 = _cmmcMqtt2.default.create(mqttConfig);

mqttClient1.register('on_connecting', function () {
  return _utils.logger.info('mqtt connecting...');
});
mqttClient1.register('on_connected', function () {
  _utils.logger.info('mqtt connected...');
});
mqttClient1.register('on_message', function (topic, payload) {
  _utils.logger.info('[app] on_message topic = ' + topic);
  _utils.logger.debug('[app] payload = ' + payload.toString('hex'));
});

mqttClient1.forward(mqttClient2, { prefix: 'NAT/HELLO/' });
//# sourceMappingURL=index.js.map
