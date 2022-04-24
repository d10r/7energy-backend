// PoC for listening to an MQTT broker delivering energy data - based on SPC demo installation

const mqtt = require('mqtt');
const axios = require('axios').default;

require('dotenv').config();

// mqtt config
const url = process.env.MQTT_URL;
const user = process.env.MQTT_USER;
const pass = process.env.MQTT_PASS;

// 7E API for persisting gathered data
const api = process.env.API;

// establish a connection to the MQTT broker
const client = mqtt.connect(url, { username: user, password: pass });

console.log(`connection status: ${client.connected}`);
client.on('connect', () => console.log('client: connected'));
client.on('error', (err) => console.log(`### client error: ${err}`));

// set up callbacks for new data
// TODO: how to disable / change / remove callback?
client.on('message', (topic, message, packet) => {
    console.log(`got topic ${topic}, message ${message}, packet ${packet}`);
    processMessage(topic, message, packet);
});

// Leistung am Wechselrichter:
const topic1 = 'energyMgmt/project-id-Eisenstadt/sensors/gateway-uuid-1/EnergieKompass-1/Piko/ACTotalPower';
// Leistung Gesamthaushalt:
const topic2 = 'energyMgmt/project-id-Eisenstadt/ClusterCmdAck/gateway-uuid-1/EnergieKompass-1/PAC2200-DISCONNECT/PAct';
// Aussentemp:
const topic3 = 'energyMgmt/project-id-Eisenstadt/sensors/gateway-uuid-1/EnergieKompass-1/IDM-Energy-System/AussenTemp';

// set up topics to watch
client.subscribe(topic1);
client.subscribe(topic2);
client.subscribe(topic3);


async function processMessage(topic, message, packet) {
    if (topic === 'energyMgmt/project-id-Eisenstadt/sensors/gateway-uuid-1/EnergieKompass-1/Piko/ACTotalPower') {
        const { value, timestamp } = JSON.parse(message);
        console.log(`logging value ${value} for ${topic}`);

        // optional: persist the data via 7E API
        if (api !== undefined) {
            try {
                const ret = await axios.post(`${api}/measurement-by-topic`, {
                    mqttTopic: topic,
                    value,
                    timestamp //: new Date(timestamp).getTime(), // UTC timestamp in ms
                });
                //console.log(`sent to API with ret value ${JSON.stringify(ret)}`);
            } catch (error) {
                console.error(error);
            }
        }
    }
}

