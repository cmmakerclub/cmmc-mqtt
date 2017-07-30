/**
 * Created by nat on 7/6/2017 AD.
 */

const ENV = process.env

let DEFAULT_CONFIG

if (ENV.NODE_ENV === 'production') {
  DEFAULT_CONFIG = {
    MQTT: {
      PUB_TOPIC: 'TRAFFY/TCP_MQTT_FORWARDER/1',
      HOST: 'central-db',
      USERNAME: 'mqtt_user',
      PASSWORD: 'mqtt'
    },
    TCP_SERVER: {
      PORT: 10778
    },
    LOG_LEVEL: 'info'
  }
} else {
  DEFAULT_CONFIG = {
    MQTT: {
      PUB_TOPIC: 'CMMC/TCP_MQTT_FORWARDER/1',
      HOST: 'localhost',
      USERNAME: '',
      PASSWORD: ''
    },
    TCP_SERVER: {
      PORT: 10778
    },
    LOG_LEVEL: 'debug'
  }
}

const SETTINGS = {
  MQTT: {
    PUB_TOPIC: ENV.MQTT_PUB_TOPIC || DEFAULT_CONFIG.MQTT.PUB_TOPIC,
    HOST: ENV.MQTT_HOST || DEFAULT_CONFIG.MQTT.HOST,
    USERNAME: ENV.MQTT_HOST || DEFAULT_CONFIG.MQTT.USERNAME,
    PASSWORD: ENV.MQTT_HOST || DEFAULT_CONFIG.MQTT.PASSWORD
  },
  SERVER: {
    PORT: ENV.TCP_SERVER_PORT || DEFAULT_CONFIG.TCP_SERVER.PORT
  },
  DEBUG: ENV.DEBUG || true,
  LOG_LEVEL: ENV.LOG_LEVEL || DEFAULT_CONFIG.LOG_LEVEL || 'debug'
}

console.log(SETTINGS)

export default SETTINGS
