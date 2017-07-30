import { logger } from './utils'
import mqtt from 'mqtt'

export default {
  create: (connectString, subTopics = [], autoconnect = true) => {
    let _forwardClient, _forwardPrefix
    const _mqtt = mqtt.connect(connectString)
    const _callbacks = {
      on_connected: () => { },
      on_connecting: () => { },
      on_message: (topic, payload) => { },
      on_close: () => { },
      on_error: () => { },
      on_packetsend: (packet) => {
        if (packet.cmd === 'subscribe') {
          logger.verbose(`subscribing to topic = ${JSON.stringify(packet.subscriptions)}`)
        } else {
          logger.verbose(`cmd = ${packet.cmd}`)
          logger.debug(`packet = ${JSON.stringify(packet)}`)
        }
      }
    }
    const ret = {
      connect: () => {
        logger.debug(`connecting to mqtt broker with ${connectString}`)
        _callbacks.on_connecting.call(this)
        // register callbacks
        _mqtt.on('packetsend', _callbacks.on_packetsend)
        _mqtt.on('message', (topic, payload) => {
          _callbacks.on_message(topic, payload)
          if (_forwardClient) {
            logger.verbose(`publish: ${_forwardPrefix}${topic}`)
            logger.debug(payload.toString('hex'))
            _forwardClient.publish(`${_forwardPrefix}${topic}`, payload)
          }
        })
        _mqtt.on('close', _callbacks.on_close)
        _mqtt.on('error', _callbacks.on_error)
        _mqtt.on('connect', () => {
          logger.verbose(`mqtt connected`)
          _callbacks.on_connected.call(this)
          subTopics.forEach((topic, idx) => {
            logger.verbose(`subscribe topic: ${topic}`)
            _mqtt.subscribe(topic)
          })
        })
      },
      register: (cbName, func) => {
        if (_callbacks[cbName]) {
          logger.verbose(`register callback ${cbName}`)
          _callbacks[cbName] = func
        } else {
          logger.verbose(`try to register unlisted callback = ${cbName}`)
        }
      },
      forward: (mqttClient, options) => {
        options.prefix = options.prefix || ''
        logger.debug(`prefix = ${options.prefix}`)
        _forwardClient = mqttClient
        _forwardPrefix = options.prefix
      },
      publish: (topic, payload) => {
        _mqtt.publish(topic, payload)
      }
    }

    if (autoconnect) {
      ret.connect()
    }
    return ret
  }
}
