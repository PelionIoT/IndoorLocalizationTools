// SENd-bytes.js
var dgram = require('dgram');
var util = require('util');
var optparse = require('optparse');
/*Yash: require to integrate aes encryption*/
//var ref = require("ref");
//var ffi = require("ffi");
/******************************************/

var D_PORT = 33333;
var D_ADDR = 'aaaa::0205:0c2a:8c35:8a06';
var S_PORT = 1111;
var S_ADDR = undefined;


var FRZ_PROTO = require('./frz-proto.js');


// debug log
var dlog = function(s) {   console.log("  DEB >>> "+s); }

var errlog = function(s) { console.log("ERROR >>> "+s); }

//var message = new Buffer('My KungFu is Good!');
var client = dgram.createSocket('udp6');


var switches = [
	[ '-h', '--help', 'Help info'],
	[ '-v', '--verbose', 'Verbose'],
	[ '-s', '--sourceaddr [addr]', 'Source address'],
	[ '-d', '--destaddr [addr]', 'Destination address'],
	[ '-sp', '--sourceport [port]', 'Source port'],
	[ '-dp', '--destport [port]', 'Destination port'],
	[ '-exec', '--execute [funcname]', 'Execute a function for data' ],
	['-r', '--reset', 'Send reset flag.'],
	['-l', '--listen', 'Listen only.'],
	['-c', '--code [file]', 'Code library to use.'],
	['-aes', '--aes [key]', 'Encrypt packet with AES']
]

var exec_func = null;
var exec_func_name = null;
var parser = new optparse.OptionParser(switches);
var needs_reset = false;
var listen_only = false;

var CODELIB = 'sensor-block-proto.js';
var AESKEY = null;
var VERBOSE = false;
// ------------ options -----------------
parser.on('help',function() {
	console.log("Help...");
	process.exit(-1);
});
parser.on('verbose',function() {
	console.log("Verbose mode");
	VERBOSE = true;
});
parser.on('sourceaddr',function(name,value){
	S_ADDR = value;
});
parser.on('destaddr',function(name,value){
	D_ADDR = value;
});
parser.on('sourceport',function(name,value){
	S_PORT = parseInt(value);
});
parser.on('destport',function(name,value){
	D_PORT = parseInt(value);
	console.log("D_PORT = " + D_PORT);
});
parser.on('reset',function(name,value){
	needs_reset = true;
});
parser.on('listen',function(name,value){
	listen_only = true;
});
parser.on('code',function(name,value){
	CODELIB = value;
	console.log("Using library: " + CODELIB);
});
parser.on('aes',function(name,value){
	AESKEY = value;
	console.log("Using AES key: " + AESKEY);
	AESKEY = AESKEY.split(',');
	if(AESKEY.length < 16) {
		console.error("AES key must be 16 bytes.");
		process.exit(-1);
	}
});


parser.on('execute', function(name,value) {
	var FUNCS = require('./' + CODELIB);
	if(!FUNCS[value]) {
		console.log("Unknown function!");
		process.exit(1);
	} else {
		exec_func_name = value;
		exec_func = FUNCS[exec_func_name];
	}
});

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



//var outBytesStr = [];
var outBuffer = new Buffer(60);
var sendBytes = 0;

var commaString = undefined;
var reset_flag = false;

parser.on(2, function(value) {

		console.log('nums: ' + value);
		commaString = value.split(',');

});


// // Parse command line arguments
parser.parse(process.argv);

if(AESKEY != null) {
	console.log("AES----------> " + AESKEY);
	var outkey = new Buffer(16);
	var v;
	var n = 0;
	while(AESKEY.length > n) {
		v = parseInt(AESKEY[n],16);
		if(v> 255) {
			console.log("ERROR: AES key - a number was larger than a byte!");
			process.exit(-1);
		} else {
			outkey.writeUInt8(v,n);
		}
		n++;
	}
	AESKEY = outkey;
//	console.log("AES: " + util.inspect(AESKEY));
}

if(exec_func) {
	console.log("Using function " + exec_func_name + " for data gen.");

	var output = null;	
	console.log("  EXEC: " + exec_func_name + "("+commaString+") ...");
	output = exec_func.apply(undefined,commaString);
	if(!output) {
		console.log(" function failed. Returned null. Check your parameters");
		process.exit(1);
	}

	sendBytes = output.totalbytes;
	outBuffer = output.buffer;
		// data
} else {
	if(commaString) {
		for(var n=0;n<commaString.length;n++) {
			console.log(commaString[n]);
			if(commaString[n] > 255) {
				console.log("ERROR: a number was larger than a byte!");
				return;
			} else {
				outBuffer.writeUInt8(parseInt(commaString[n]),n);
			}
		}
	sendBytes = commaString.length;
	} else
	sendBytes = 0;
}


/****************************************************/

var stringifyBytes = function(buf,N) {
	var str = "[";
	for(var n=0;n<N;n++) {
		if(n>0)
			str+=',';
		str += '0x' + buf.readUInt8(n).toString(16);
	}
	str += ']';
	return str;
}

var str = stringifyBytes(outBuffer,sendBytes);

if(sendBytes > 0)
	console.log("Will send " + sendBytes + " bytes. " + str);



// ---------------------------------------
var presenceRSSIMap = {};
var filamentRSSIMap = {};

if(1) {
	console.log( "  SRC->DEST = " + S_ADDR + ":" + S_PORT + " --> " + D_ADDR + ":" + D_PORT);

	// finalSendBytes = sendBytes + FRZ_PROTO.FRZ_HEADER_SIZE;
	// if(finalSendBytes > FRZ_PROTO.MAX_PACK_SIZE)
	// 	console.log("WARNING: will be multiple packets. " + (finalSendBytes/FRZ_PROTO.MAX_PACK_SIZE)+1 + " packets needed."); 



	var totalsent = 0;
	var totalpacks = 0;
	var packnumber = 0;


	totalpacks = Math.floor(sendBytes / FRZ_PROTO.MAX_FRZ_PAYLOAD);
	if((sendBytes % FRZ_PROTO.MAX_FRZ_PAYLOAD) > 0)
		totalpacks++; 

	if(totalpacks>1)
		console.log("WARNING: will be multiple packets. " + totalpacks + " packets needed."); 

	var flags = 0;
	// setup header
	// if reset only op:
	if(reset_flag && (!sendBytes)) {
		flags |= FRZ_PROTO.FRZ_FLAG_RESET;
	}

	function dec2hex(i) {
   		return (i+0x10000).toString(16).substr(-4).toUpperCase();
	}

	var processInbound = function(buf, rinfo) {

		if(rinfo.size < FRZ_PROTO.FRZ_HEADER_SIZE) {
			errlog("Tiny packet. ?? " + rinfo.size);
			return;
		}

		if(AESKEY) {
			/*Yash: Encryption added, send encrypted data to 6lbr*/
			var decrypt_out = null;
			var decrypt_key = new Buffer(16);
//			var crypto = ffi.Library("crypto", {
//			                                "aes_enc_dec": [ "void", [ "uchar*", "uchar*", "uchar", "uchar*"] ]
//			        });

			
			if(rinfo.size < 16) {
				var decrypt_in = Buffer.concat([
					buf,                         // original buffer
					new Buffer(16 - rinfo.size)] // padding
					,16); // make output at least 16 bytes, in this case it will be zeros
				decrypt_out = new Buffer(16);
				AESKEY.copy(decrypt_key);
				crypto.aes_enc_dec(decrypt_in, decrypt_key, 1, decrypt_out);
			} else {
				var iteration = Math.ceil(rinfo.size / 16);
				var decrypt_in = new Buffer(16);
				buf.copy(decrypt_in);
				var outsize = iteration * 16;
				decrypt_out = new Buffer(outsize);
				var temp_out = new Buffer(16);
				var i = 0;
				while(i < iteration){
					decrypt_in.fill(0);
					buf.copy(decrypt_in, 0, i*16, (i+1)*16);
					AESKEY.copy(decrypt_key);
					// console.log("Data: "+ decrypt_in.toString('hex'));
					// console.log("Key: "+ decrypt_key.toString('hex'));
					// console.log("Decrypted: "+ decrypt_out.toString('hex'));
					crypto.aes_enc_dec(decrypt_in, decrypt_key, 1, temp_out);
					temp_out.copy(decrypt_out, i*16, 0, 16);	
					i++;
				}				
			}

			rinfo.size = decrypt_out.length;
			buf = decrypt_out;
			if(VERBOSE) {
				console.log("** AES out: " + util.inspect(buf));
			}
		}

	
		if(rinfo.size == FRZ_PROTO.FRZ_HEADER_SIZE) {
			dlog("Recv header only.");
		}
		//crypto.aes_enc_dec(FRZ_PROTO.GET_FRZ_FLAGS(buf), key1, 0,
		if( FRZ_PROTO.GET_FRZ_FLAGS(buf) & FRZ_PROTO.FRZ_FLAG_ACK)
			dlog("Recv ACK. Ok.");
		if(rinfo.size > FRZ_PROTO.FRZ_HEADER_SIZE) { 
			dlog( "Buffer was: " + stringifyBytes(buf,rinfo.size));
			var offset = FRZ_PROTO.FRZ_HEADER_SIZE;
			var category = buf.readUInt8( offset );
			switch(category) {
				case 0x25: //Data from the presence tag
					console.log('GOT RSSI MAP from- ', rinfo.address);
	                var node = new Buffer(8);
	                buf.copy(node, 0, 17, 25);
	                console.log('node: ', node);
	                var nodeIP = createIP6FromMAC(node);
	                if(typeof presenceRSSIMap[rinfo.address] == 'undefined') 
	                	presenceRSSIMap[rinfo.address] = {};
	                presenceRSSIMap[rinfo.address][nodeIP] = buf[25];
	                console.log('presenceRSSIMap: ',presenceRSSIMap);
					break;
				case 0x19: //Data from the bulbs
					console.log('GOT RSSI MAP from- ', rinfo.address);
	                var node = new Buffer(8);
	                buf.copy(node, 0, 17, 25);
	                console.log('node: ', node);
	                var nodeIP = createIP6FromMAC(node);
	                if(typeof filamentRSSIMap[rinfo.address] == 'undefined') 
	                	filamentRSSIMap[rinfo.address] = {};
	                filamentRSSIMap[rinfo.address][nodeIP] = buf[25];
	                console.log('filamentRSSIMap: ',filamentRSSIMap);
					break;
				default:
					dlog('Protocol category - Unimplemented: ', category + " " + dec2hex(category));
			}
			// switch(category) {
			// 	case FRZ_PROTO.CATEGORY.ASYNC_PUSH: 
			// 		dlog("Have an ASYNC_PUSH.");
			// 		offset += 2;
			// 		var eventcode = buf.readUInt16LE( offset );
			// 		var str_code = '0x' + dec2hex(eventcode);
			// 		dlog("Event code: " + str_code);
			// 		var func_name = FUNCS.EVENTHANDLERS[str_code];
			// 		if(func_name) {
			// 			dlog("Found handler: " + func_name);
			// 			var func = FUNCS[func_name];
			// 			if(!func) {
			// 				errlog("No function named: " + func_name + " in test function file.");
			// 			} else {
			// 				var payloadonly = buf.slice(FRZ_PROTO.FRZ_HEADER_SIZE);
			// 				var results = func.call(undefined,{ buf: payloadonly, size: rinfo.size - FRZ_PROTO.FRZ_HEADER_SIZE, rinfo: rinfo });
			// 				if(results !== undefined) {
			// 					dlog("  Results of func: " + JSON.stringify(results));
			// 				} else 
			// 					dlog("  No results.");
			// 			}
			// 		} else {
			// 			errlog("Can't find a corresponding function name for this eventcode.");
			// 		}
			// 		break;
			// 	default:
			// 		dlog("Protocol category - Unimplemented: " + category + " " + dec2hex(category));
			// }
			console.log(" ---------------------------- ");
			// process.exit(1);
		}

	};



	client.bind(S_PORT,S_ADDR);

	client.on('listening', function() {
		dlog(" ---- ready for response");
	});

	client.on('message', function(msg, rinfo) { // msg is a Buffer
		//dlog("   >> data from " + rinfo.address + ":" + rinfo.port);
		//dlog("   >> rinfo = " + JSON.stringify(rinfo));
		//console.log("Received data: " + msg.toString("hex"));
		processInbound(msg,rinfo);
	});

	client.on('error', function(e) {
		console.log(" Socket error -> OOPS: " + e.message + " --> " + e.stack);
	});

	var looping = false;

	var sendPack = function(buffer,totalsize,maxsendsize, d_addr, d_port, s_addr, s_port, flags) {
		var sendsize = 0;

		if(totalsent < totalsize) {
			sendsize = totalsize - totalsent;
			if(sendsize > maxsendsize)
				sendsize = maxsendsize;
		} else {
			// send a header only?
			sendsize = 0;
			if(!flags) {
				console.log("sendPack: send what???");
				return;
			}
		}
		console.log("sendsize " + sendsize);
		console.log("packs: " + (packnumber+1) + "/" + totalpacks);
		var sendBuffer = new Buffer(sendsize + FRZ_PROTO.FRZ_HEADER_SIZE);
		sendBuffer.fill(0); // zero it out

		if(sendsize)
			outBuffer.copy(sendBuffer,FRZ_PROTO.FRZ_HEADER_SIZE,totalsent,sendsize); // copy the byte buffer into our final send buffer, leave room for header

		FRZ_PROTO.SET_FRZ_FLAGS(sendBuffer,flags); // set any passed in flags
		if(packnumber == 0) { // the first packet gets the total number of packets
			FRZ_PROTO.SET_FRZ_OPTIONAL(sendBuffer, totalpacks); // set any passed in flags
			FRZ_PROTO.SET_FRZ_FLAGS(sendBuffer, FRZ_PROTO.GET_FRZ_FLAGS(sendBuffer) | FRZ_PROTO.FRZ_FLAG_FIRST);
			if(needs_reset)
				FRZ_PROTO.SET_FRZ_FLAGS(sendBuffer,FRZ_PROTO.GET_FRZ_FLAGS(sendBuffer) | FRZ_PROTO.FRZ_FLAG_RESET); // set any passed in flags
		}
		if((packnumber+1) == totalpacks) {
			FRZ_PROTO.SET_FRZ_FLAGS(sendBuffer,FRZ_PROTO.GET_FRZ_FLAGS(sendBuffer) | FRZ_PROTO.FRZ_FLAG_LAST);	
		}

		FRZ_PROTO.SET_FRZ_SEQ_ID(sendBuffer,packnumber);
		packnumber++;

		console.log("attempting send pack "+packnumber+"... (" + sendsize + " data bytes, "+(sendsize + FRZ_PROTO.FRZ_HEADER_SIZE)+" total bytes)");
		//console.log("sendBuffer: " + JSON.stringify(sendBuffer));

		if(AESKEY) {
			/*Yash: Encryption added, send encrypted data to 6lbr*/
			// var key1 = new Buffer('00000000000000000000000000000000', 'hex');
			// var key2 = new Buffer('00000000000000000000000000000000', 'hex');
			var encrypt_out = null;
			var encrypt_key = new Buffer(16);
//			var crypto = ffi.Library("crypto", {
//			                                "aes_enc_dec": [ "void", [ "uchar*", "uchar*", "uchar", "uchar*"] ]
//			        });

			if(sendBuffer.length < 16) {
				var encrypt_in = Buffer.concat([
					sendBuffer,                         // original buffer
					new Buffer(16 - sendBuffer.length)] // padding
					,16); // make output at least 16 bytes, in this case it will be zeros
				encrypt_out = new Buffer(16);
				AESKEY.copy(encrypt_key);
				crypto.aes_enc_dec(encrypt_in, encrypt_key, 0, encrypt_out);
			} else {
				var iteration = Math.ceil(sendBuffer.length / 16);
				var encrypt_in = new Buffer(16);
				var i = 0;
				var outsize = iteration*16;
				encrypt_out = new Buffer(outsize);
				var temp_out = new Buffer(16);
				//encrypt_out.fill(0);
				while(i < iteration){
					encrypt_in.fill(0);
					sendBuffer.copy(encrypt_in, 0, i*16, (i+1)*16);
					AESKEY.copy(encrypt_key);
					// console.log("Data: "+ encrypt_in.toString('hex'));
					// console.log("Key: "+encrypt_key.toString('hex'));
					// console.log("Encrypted: "+encrypt_out.toString('hex'));
					crypto.aes_enc_dec(encrypt_in, encrypt_key, 0, temp_out);
					temp_out.copy(encrypt_out, i*16, 0, 16);	
					i++;
				}			
			}

			sendsize = encrypt_out.length;
			sendBuffer = encrypt_out;
			if(VERBOSE) {
				console.log("** AES out: " + util.inspect(sendBuffer));
			}
		} else {
			sendsize = sendsize + FRZ_PROTO.FRZ_HEADER_SIZE;
		}


		client.send(sendBuffer, 0, sendsize, d_port, d_addr, function(err, bytes) {
    		if (err) 
				console.log(" OOPS: " + err.message + " --> " + err.stack);
			else {
	    		console.log('UDP message sent to ' + d_addr +':'+ d_port + " ... " + bytes + " bytes sent."); 
	    		// why is 'bytes' always undefined???!!
    		//	totalsent += bytes;
		
    			//Kill the process if we do not get the reply in 2 seconds
    			var kill_interval = setInterval(function () {
    				// process.exit(1);
    				console.error('Response timedout.........');
    				clearInterval(kill_interval);
    			}, 2000);



				packnumber++;
				totalsent += sendsize; // bytes is not returning  so we do this HACK HACK HACK
				
				if(totalsent < sendsize) {
					if(totalsent == 0) {
						if(looping == true) {
							// process.exit(1);			
						}
						looping = true;
					}
					setImmediate(sendPack, buffer,totalsize,maxsendsize, d_addr, d_port, s_addr, s_port, flags);
				}
			}
		});
	}

	if(!listen_only)
		sendPack(outBuffer,sendBytes,FRZ_PROTO.MAX_PACK_SIZE,D_ADDR,D_PORT,S_ADDR,S_PORT,flags);
	else 
		console.log("Listen only. Waiting...");
}

	// try {
	// 	sendNWait(finalSendBuffer,finalSendBytes,FRZ_PROTO.MAX_PACK_SIZE,D_ADDR,D_PORT,S_ADDR,S_PORT);
	// } catch (e) {

	// 	console.log(" OOPS: " + e.message + " --> " + e.stack);
	// }




module.exports = {
	getPresenceRSSIMap: function() {
		return presenceRSSIMap;	
	},
	getFilamentRSSIMap: function() {
		return filamentRSSIMap;	
	}	
};
