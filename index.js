'use strict'
/*    Command usage
 * 1. Subscribe Mode.
 *    $ node index.js subscribe
 * 
 * 2. Publish Mode.
 *    $ node index.js publish 500
 * 
 * 3. CPU-Server Mode. (RUN)
 *    $ node index.js cpu-server 1000
 * 
 * 4. CPU-Server Mode. (Debug)
 *    $ node index.js cpu-server 500 d
 */
const mqtt = require('async-mqtt');
const fmlog = require('@waynechang65/fml-consolelog').log;
const si = require('systeminformation');

const BROKER_IP = process.env.MQTT_BROKER_IP;
const BROKER_PORT = process.env.MQTT_BROKER_PORT;
const BROKER_UID = process.env.MQTT_BROKER_UID;
const BROKER_UPWD = process.env.MQTT_BROKER_UPWD;

const client = mqtt.connect('tcp://' + BROKER_IP + ':' + BROKER_PORT, {
	username: BROKER_UID,
	password: BROKER_UPWD
});

let samplingTime = (process.argv[3]) ? process.argv[3] : 1000;

function task_subscribe(_client) {
	fmlog('sys_msg', ['[ Subsrcibe Mode ]', 'Listening...']);
	_client.subscribe('wayne65/#');
	_client.on('message', async (topic, msg) => {
		fmlog('basic_chat',  
			[topic, '>', msg, '-' , Buffer.byteLength(msg, 'utf8') + ' bytes', '...']);
	});
}

function task_publish(_client, _samplingTime) {
	fmlog('sys_msg', ['[ Publish Mode ]', 'Sending...']);
	_client.on('connect', async () => {
		try {
			let i = 0;
			setInterval(async () => {
				await _client.publish("wayne65/test1", "It works!" + i);
				i++;
			}, _samplingTime);
			//await _client.end();
		} catch (e) {
			fmlog('error_msg', ['[ Publish Mode ]', '-', e.stack]);
			process.exit();
		}
	});
}

function task_cpu_server(_client, _samplingTime, _debug = undefined) {
	fmlog('sys_msg', ['[ CPU Server Mode ]' , 'Sending... ']);
	_client.on('connect', async () => {
		try {
			setInterval(async () => {
				let data_cpuTemp = await si.cpuTemperature();
				let data_cpuLoad = await si.currentLoad();
				let data_osInfo = await si.osInfo();
				let temp = Math.floor(data_cpuTemp.main * 10) / 10;
				let load = Math.floor(data_cpuLoad.currentload * 10) / 10;

				await _client.publish('wayne65/' + data_osInfo.hostname + '/cpu-temp/main', temp.toString());
				await _client.publish('wayne65/' + data_osInfo.hostname + '/cpu-load/current', load.toString());

				if (_debug) {
					fmlog('basic_chat',
						['CPU Server Mode', '>', 'wayne65/' + data_osInfo.hostname + '/cpu-temp/main', 'Publish',
							' ' + data_cpuTemp.main.toString() + ' °C ', '...'
						]);
					fmlog('basic_chat',
						['CPU Server Mode', '>', 'wayne65/' + data_osInfo.hostname + '/cpu-load/current', 'Publish',
							' ' + load.toString() + ' % ', '...'
						]);
				}
			}, _samplingTime);
		} catch (e) {
			console.log(e)
		}
	});
}

async function main() {
	switch (process.argv[2]) {
		case 'subscribe':
			task_subscribe(client);
			break;
		case 'publish':
			task_publish(client, samplingTime);
			break;
		case 'cpu-server':
			task_cpu_server(client, samplingTime, process.argv[4]);
			break;
		default:
			break;
	}
}

main();