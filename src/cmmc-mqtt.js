import { logger } from './utils'
import mqtt from 'mqtt'

export default {
  create: (connectString, subTopics = [], autoconnect = true) => {
    let _forwardClient, _forwardPrefix
    const _mqtt = mqtt.connect(connectString)
    let _converterFn = (input) => input
    const _callbacks = {
      on_connected: () => { },
      on_connecting: () => { },
      on_message: (topic, payload) => { },
      on_close: () => { },
      on_error: () => { },
      on_packetsend: (packet) => {
        if (packet.cmd === 'subscribe') {
          logger.debug(`subscribing to topic = ${JSON.stringify(packet.subscriptions)}`)
        } else {
          logger.debug(`cmd = ${packet.cmd} packet = ${JSON.stringify(packet)}`)
        }
      }
    }
    const ret = {
      connect: () => {
        logger.info(`connecting to mqtt broker with ${connectString}`)
        _callbacks.on_connecting.call(this)

        // register callbacks
        _mqtt.on('packetsend', _callbacks.on_packetsend)
        _mqtt.on('message', (topic, message, packet) => {
          logger.debug(`message arrived topic =  ${topic}`)
          logger.debug(`message arrived payload =  ${message}`)
          _callbacks.on_message(topic, message)

          if (_forwardClient) {
            const p = _converterFn(_forwardPrefix, topic, message, packet)
            topic = `${_forwardPrefix}${topic}`
            p.topics.forEach((topic, k) => {
              logger.verbose(`being forwarded to topic = ${topic}`)
              logger.debug(`options = ${JSON.stringify(p.options)}`)
              _forwardClient.publish(`${topic}`, p.payload, p.options)
            })
            logger.debug(message)
          }
        })
        _mqtt.on('close', _callbacks.on_close)
        _mqtt.on('error', _callbacks.on_error)
        _mqtt.on('connect', (connack) => {
          logger.verbose(` ${connectString} connected.`)
          _callbacks.on_connected.call(this, connack)
          subTopics.forEach((topic, idx) => {
            logger.verbose(`[${idx}] ${connectString} subscribing to topic: ${topic}`)
            _mqtt.subscribe(topic)
          })
        })
        return ret
      },
      register: (cbName, func) => {
        if (_callbacks[cbName]) {
          logger.debug(`register callback ${cbName}`)
          _callbacks[cbName] = func
        } else {
          logger.debug(`try to register unlisted callback = ${cbName}`)
        }
        return ret
      },
      mqtt_on: (cbName, func) => {
        _mqtt.on(cbName, func)
        return ret
      },
      forward: (mqttClient, options) => {
        options.prefix = options.prefix || ''
        _converterFn = options.fn || _converterFn
        logger.verbose(`prefix = ${options.prefix}`);
        [_forwardClient, _forwardPrefix] = [mqttClient, options.prefix]
        return ret
      },
      publish: (topic, payload, options) => {
        logger.verbose(`being published to topic = ${topic}`)
        logger.debug(`being published with options= ${JSON.stringify(options)}`)
        _mqtt.publish(topic, payload, options)
      }
    }

    if (autoconnect) {
      ret.connect()
    }
    return ret
  }
}
