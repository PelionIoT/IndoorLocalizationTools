var UDPMultiplexer = require('./udpmultiplexer').UDPMultiplexer;
// var ip6 = require('ipv6').v6;

var udpMultiplexer = null;
var presenceRSSIMap = {};
var filamentRSSIMap = {};

var presenceDistanceMatrix = {};
var filamentDistanceMatrix = {};

function byteToHexString(byteValue) {
    var hexString = byteValue.toString(16);

    if(hexString.length == 1 && hexString == 0x00) {
        hexString = '0' + hexString;
    }

    return hexString;
}

function createIP6FromMAC(mac) {
    return 'aaaa::' + '2' +
        byteToHexString(mac[1]) + ':' +
        byteToHexString(mac[2]) + 
        byteToHexString(mac[3]) + ':' +
        byteToHexString(mac[4]) + 
        byteToHexString(mac[5]) + ':' +
        byteToHexString(mac[6]) + 
        byteToHexString(mac[7]);
}


///////////////////
var A = 225;
var A_presence = 203;
///////////////

module.exports = {
	getPresenceRSSIMap: function() {
		return presenceDistanceMatrix;	
	},
	getFilamentRSSIMap: function() {
		return filamentDistanceMatrix;	
	},
	start: function() {
		return new Promise(function(resolve, reject) {
			console.log('Starting UDP Multiplexer');
			udpMultiplexer = new UDPMultiplexer('', 3000, 0);
			udpMultiplexer.start().then(function() {
			    console.log('UDP Multiplexer started');
			}).then(function() {
				udpMultiplexer.on('message', function(buf, rInfo) {
					// console.log('ProcessInbou nd from: ', rInfo.address);
					// console.log('Got buffer: ', buf);

					switch(buf[8]) {
						case 0x25: //Data from the presence tag
							// console.log('GOT RSSI MAP from- ', rInfo.address);
			                var node = new Buffer(8);
			                buf.copy(node, 0, 17, 25);
			                var nodeIP = createIP6FromMAC(node);
			                if(typeof presenceRSSIMap[rInfo.address] == 'undefined') 
			                	presenceRSSIMap[rInfo.address] = {};
			                presenceRSSIMap[rInfo.address][nodeIP] = buf[25];
			                // console.log('presenceRSSIMap: ',presenceRSSIMap);

			            	console.log('presence: ', presenceRSSIMap);
							// var root = 'aaaa::2a5:900:112:3456';

			                Object.keys(presenceRSSIMap).forEach(function(f) {  //filaments
								// console.log(b + ': ', a[b].response);
								// if(typeof filamentRSSIMap[] != 'undefined') {
									Object.keys(presenceRSSIMap[f]).forEach(function(t) { //presence tag
										// if(c == root) {
											// i++;
											// var rssi = a[b].response.result[node];
											var rssi = presenceRSSIMap[f][t];
											var distance = Math.pow(10, (A_presence - rssi) / 20);
											if(typeof presenceDistanceMatrix[t] == 'undefined') {
												presenceDistanceMatrix[t] = {};
											}
											presenceDistanceMatrix[t][f] = Math.round(distance, 3);

											// if(i == 3) {
											// 	// console.log(i +/ numofnodes);
											// 	console.log('obj: ', obj);
											// 	write_JSON2file(file, obj, true, function(err, suc) {
											// 		if(err) {
											// 			console.error("Error Writing file ", file, err);	
											// 			return;
											// 		}
											// 		console.log(suc + ': wrote ' + file + ' file successfully');
											// 		process.exit(1);
											// 	});
											// }
										// }

									});
								// }
							});
							break;
						case 0x19: //Data from the bulbs
							// console.log('GOT RSSI MAP from- ', rInfo.address);
			                var node = new Buffer(8);
			                buf.copy(node, 0, 17, 25);
			                var nodeIP = createIP6FromMAC(node);
			                if(typeof filamentRSSIMap[rInfo.address] == 'undefined') 
			                	filamentRSSIMap[rInfo.address] = {};
			                filamentRSSIMap[rInfo.address][nodeIP] = buf[25];	//store the raw RSSI value

			                console.log('bulbs: ', filamentRSSIMap);
							var root = 'aaaa::2a5:900:112:3456';//fe80000000000000000001ffff15b133

			                Object.keys(filamentRSSIMap).forEach(function(p) { 
								// console.log(b + ': ', a[b].response);
								// if(typeof filamentRSSIMap[] != 'undefined') {
									// filamentDistanceMatrix[p] = {}
									Object.keys(filamentRSSIMap[p]).forEach(function(c) {
										if(c == root) {
											// i++;
											// var rssi = a[b].response.result[node];
											var rssi = filamentRSSIMap[p][c];
											var distance = Math.pow(10, (A - rssi) / 20);
											filamentDistanceMatrix[p] = Math.round(distance, 3);

											// if(i == 3) {
											// 	// console.log(i +/ numofnodes);
											// 	console.log('obj: ', obj);
											// 	write_JSON2file(file, obj, true, function(err, suc) {
											// 		if(err) {
											// 			console.error("Error Writing file ", file, err);	
											// 			return;
											// 		}
											// 		console.log(suc + ': wrote ' + file + ' file successfully');
											// 		process.exit(1);
											// 	});
											// }
										}

									});
								// }
							});


			                console.log('filamentRSSIMap: ',filamentDistanceMatrix);
							break;
						default:
							console.log('Protocol category - Unimplemented: ', buf[9].toString(16));
					}
				});
				resolve();
			});
		});
	}
};