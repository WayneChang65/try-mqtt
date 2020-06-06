'use strict'
const si = require('systeminformation');

setInterval(async () => {
    let data_osInfo = await si.osInfo();
    let data_cpuTemp = await si.cpuTemperature();
    
    console.log(data_osInfo);
    console.log(data_cpuTemp);
}, 1000);