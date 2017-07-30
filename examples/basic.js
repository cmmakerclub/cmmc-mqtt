import mqtt from '../src/index'
import { logger } from '../src/utils'

let mqttConfig = {connectString: 'mqtt://mqtt.cmmc.io'}

let mqttClient1 = mqtt.create(mqttConfig, ['ESPNOW/18fe34db3b98/+/status'])

mqttClient1.register('on_message', (topic, payload) => {
  logger.info(`[app] on_message topic = ${topic}`)
  logger.debug(`[app] payload = ${payload.toString('hex')}`)
})

// let mqttClient2 = mqtt.create(mqttConfig)
// mqttClient1.forward(mqttClient2, {prefix: 'NAT/HELLO/'})
