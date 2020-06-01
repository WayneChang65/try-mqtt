'use strict'
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

function task_cpu_server(_client, _samplingTime, _device) {
	fmlog('sys_msg', ['[ CPU Server Mode ]' , 'Sending... on ' + 'wayne65/' + _device]);
	_client.on('connect', async () => {
		try {
			setInterval(async () => {
				let data_cpuTemp = await si.cpuTemperature();
				await _client.publish('wayne65/' + _device + '/cpu-temp/main', data_cpuTemp.main.toString());
				await _client.publish('wayne65/' + _device + '/cpu-temp/max', data_cpuTemp.max.toString());
			}, _samplingTime);
		} catch (e) {
			console.log(e)
		}
	});
}

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