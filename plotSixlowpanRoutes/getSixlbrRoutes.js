function createIP6FromMAC(mac) {
	if(mac[4] == 0) {
		mac[4] =''
	}
    return '2' +
        byteToHexString(mac[1], true) + ':' +
        byteToHexString(mac[2], false) + 
        byteToHexString(mac[3], true) + ':' +
        byteToHexString(mac[4], false) +
		byteToHexString(mac[5], true) + ':' +
        byteToHexString(mac[6], false) + 
        byteToHexString(mac[7], true);
}

function byteToHexString(byteValue, wrap) {
    var hexString = byteValue.toString(16);

    if(hexString.length == 1 && wrap) {
        hexString = '0' + hexString;
    }

    return hexString;
}

var wigwagnodes = {};

module.exports = {
	updateWigwagNodes: function(nodes) {
		wigwagnodes = nodes;
	},
	getRoutes: function() {
		return dev$.selectByID('SixlbrMonitor1').call('getSixlbrRoutes');
	},
	getNetworkStats: function() {
		return dev$.selectByID('SixlbrMonitor1').call('getNetworkStats');
	},
	getSixlbrConfig: function() {
		return dev$.selectByID('SixlbrMonitor1').call('getSixlbrConfig');
	},
	setSixlbrConfig: function(opts) {
		return dev$.selectByID('SixlbrMonitor1').call('setSixlbrConfig', opts);
	},
	getNodeIdFromIP: function(inputIP) {
		return new Promise(function(resolve, reject) {
			// ddb.get('wigwagdevice:node').then(function(nodes) {
				// console.log('NODES: ', wigwagnodes);
				Object.keys(wigwagnodes).forEach(function(n) {
					var nodeIP = createIP6FromMAC(wigwagnodes[n].macAddress);
					// console.log(nodeIP);
					if(inputIP == nodeIP) {
						console.log('in: ', inputIP + ' node: ', nodeIP + ' n: ', n);
						resolve(n);
					}
				});
			// });
		});
	},
	start: function() {
		return Promise.resolve();
	}
}
