import { mqtt } from '../src/index'
import { logger } from '../src/utils'

let mqttClient1 = mqtt.create('mqtt://q.cmmc.io:51883', ['PROXY/MESH/1'])
let mqttClient2 = mqtt.create('mqtt://mqtt.cmmc.io:1883')

mqttClient1.register('on_message', (topic, payload) => {
  logger.info(`[app] on_message topic = ${topic}`)
  logger.info(`[app] on_message payload = ${payload}`)
}).forward(mqttClient2, {
  prefix: 'MARU/',
  fn: (prefix, topic, message, packet) => {
    let object = JSON.parse(message.toString())
    let [retain, qos] = [packet.retain, packet.qos]
    return {
      topics: [`${prefix}${object.d.myName}/status`],
      payload: JSON.stringify(object),
      options: {retain, qos}
    }
  }
})
