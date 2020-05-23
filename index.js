'use strict'
const MQTT = require("async-mqtt");

const BROKER_IP = process.env.WAYNE_RASP_BROKER_IP;
const BROKER_PORT = process.env.WAYNE_RASP_BROKER_PORT;
const BROKER_UID = process.env.WAYNE_RASP_BROKER_UID;
const BROKER_UPWD = process.env.WAYNE_RASP_BROKER_UPWD;

const client = MQTT.connect('tcp://' + BROKER_IP + ':' + BROKER_PORT, {
	username: BROKER_UID,
	password: BROKER_UPWD
});

// 0: subscribe, 1: publish
let runMode = (process.argv[2] != 'publish') ? 0 : 1;
let runs = process.argv[3];

const doPublish = async () => {
	console.log('Get up !');
	try {
		for (let i = 0; i < runs; i++) {
			await client.publish("wayne65/test1", "It works!" + i);
		}
		await client.end();
		console.log('Done !');
	} catch (e) {
		console.log(e.stack);
		process.exit();
	}
}

switch (runMode) {
	case 0:
		console.log('Subsrcibe Mode.');
		process.exit();
		break;

	case 1:
		console.log('Publish Mode.');
		client.on("connect", doPublish);
		break;

	default:
		break;
}

