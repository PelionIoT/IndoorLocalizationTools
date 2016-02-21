// send-bytes.js
var dgram = require('dgram');
var optparse = require('optparse');


var D_PORT = 33333;
var D_ADDR = 'aaaa::0205:0c2a:8c35:8a06';
var S_PORT = 1111;
var S_ADDR = undefined;


var FRZ_PROTO = require('./frz-proto.js');

//var FUNCS = require('./sensor-block-proto.js');

// debug log
var dlog = function(s) {   console.log("  DEB >>> "+s); }

var errlog = function(s) { console.log("ERROR >>> "+s); }

//var message = new Buffer('My KungFu is Good!');
var client = dgram.createSocket('udp6');


var switches = [
	[ '-h', '--help', 'Help info'],
	[ '-s', '--sourceaddr [addr]', 'Source address'],
	[ '-d', '--destaddr [addr]', 'Destination address'],
	[ '-sp', '--sourceport [port]', 'Source port'],
	[ '-dp', '--destport [port]', 'Destination port'],
	[ '-exec', '--execute [funcname]', 'Execute a function for data' ],
	['-r', '--reset', 'Send reset flag.'],
	['-l', '--listen', 'Listen only.']

]



var exec_func = null;
var exec_func_name = null;
var parser = new optparse.OptionParser(switches);
var needs_reset = false;
var listen_only = false;

CODELIB = 'sensor-block-proto.js';

// ------------ options -----------------
parser.on('help',function() {
	console.log("Help...");
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
		if(rinfo.size == FRZ_PROTO.FRZ_HEADER_SIZE) {
			dlog("Recv header only.");
		}
		if(FRZ_PROTO.GET_FRZ_FLAGS(buf) & FRZ_PROTO.FRZ_FLAG_ACK)
			dlog("Recv ACK. Ok.");
		if(rinfo.size > FRZ_PROTO.FRZ_HEADER_SIZE) { 
			dlog( "Buffer was: " + stringifyBytes(buf,rinfo.size));
			var offset = FRZ_PROTO.FRZ_HEADER_SIZE;
			var category = buf.readUInt16LE( offset );
			switch(category) {
				case FRZ_PROTO.CATEGORY.ASYNC_PUSH: 
					dlog("Have an ASYNC_PUSH.");
					offset += 2;
					var eventcode = buf.readUInt16LE( offset );
					var str_code = '0x' + dec2hex(eventcode);
					dlog("Event code: " + str_code);
					var func_name = FUNCS.EVENTHANDLERS[str_code];
					if(func_name) {
						dlog("Found handler: " + func_name);
						var func = FUNCS[func_name];
						if(!func) {
							errlog("No function named: " + func_name + " in test function file.");
						} else {
							var payloadonly = buf.slice(FRZ_PROTO.FRZ_HEADER_SIZE);
							var results = func.call(undefined,{ buf: payloadonly, size: rinfo.size - FRZ_PROTO.FRZ_HEADER_SIZE, rinfo: rinfo });
							if(results !== undefined) {
								dlog("  Results of func: " + JSON.stringify(results));
							} else 
								dlog("  No results.");
						}
					} else {
						errlog("Can't find a corresponding function name for this eventcode.");
					}
					break;
				default:
					dlog("Protocol category - Unimplemented: " + category + " " + dec2hex(category));
			}
			console.log(" ---------------------------- ");
		}

	}



	client.bind(S_PORT,S_ADDR);

	client.on('listening', function() {
		dlog(" ---- ready for response");
	});

	client.on('message', function(msg, rinfo) { // msg is a Buffer
		dlog("   >> data from " + rinfo.address + ":" + rinfo.port);
		dlog("   >> rinfo = " + JSON.stringify(rinfo));
		processInbound(msg,rinfo);
	});

	client.on('error', function(err) {
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

		console.log("attempting send pack "+packnumber+"... (" + sendsize + " data bytes, "+(sendsize + FRZ_PROTO.FRZ_HEADER_SIZE)+" total bytes)");
		console.log("sendBuffer: " + JSON.stringify(sendBuffer));
		client.send(sendBuffer, 0, sendsize + FRZ_PROTO.FRZ_HEADER_SIZE, d_port, d_addr, function(err, bytes) {
    		if (err) 
				console.log(" OOPS: " + err.message + " --> " + err.stack);
			else {
	    		console.log('UDP message sent to ' + d_addr +':'+ d_port + " ... " + bytes + " bytes sent."); 
	    		// why is 'bytes' always undefined???!!
    		//	totalsent += bytes;
			
				packnumber++;
				totalsent += sendsize; // bytes is not returning  so we do this HACK HACK HACK
				
				if(totalsent < sendsize) {
					if(totalsent == 0) {
						if(looping == true)
							process.exit(1);			
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


