import mqtt from './cmmc-mqtt'
import { logger } from './utils'

let mqttConfig = {host: 'mqtt://mqtt.cmmc.io', port: 1883, username: '', password: '', clientId: ''}

let mqttClient1 = mqtt.create(mqttConfig, ['ESPNOW/18fe34db3b98/+/status'])
let mqttClient2 = mqtt.create(mqttConfig)

mqttClient1.register('on_connecting', () => logger.info('mqtt connecting...'))
mqttClient1.register('on_connected', () => { logger.info('mqtt connected...') })
mqttClient1.register('on_message', (topic, payload) => {
  logger.info(`[app] on_message topic = ${topic}, payload = ${payload.toString('hex')}`)
})

mqttClient1.forward(mqttClient2, {prefix: 'NAT/HELLO/'})
