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
// debug log
var dlog = function(s) {   console.log(" FUNC >>> "+s); }
var errlog = function(s) { console.log("ERROR >>> "+s); }

var WWHW = require('./ww_hwdevice.js');

exports = module.exports = {

// ---------------------------------------------------------------------------------------------------

	// first two bytes of inbound data from Sensor Block states the Event Type
	// This map pairs the number to an event handler function
	EVENTHANDLERS : {
		'0x0001' : 'eventMode',
		'0x0002' : 'eventAdxl345',
		'0x0003' : 'eventLED'
	},
// ---------------------------------------------------------------------------------------------------
	/**
	An event handler. This handls inbound data.<br>
	<code>in_data</code> is an object of the format:<br>
<pre>
{
	buf : Buffer(N), // a Buffer object
	size : N,        // the size of the data in bytes
	rinfo :          // A Node.js rinfo object -  {"address":"aaaa::205:c2a:8c35:8a06","family":"IPv6","port":3001,"size":8} 
	                 // see here or more: http://nodejs.org/docs/latest/api/all.html#all_event_message
}
</pre>
	*/
	eventMotion : function(in_data) {
	    //VERIFIED
	    var ret = {};
	    ret.sens = in_data.buf.readUInt8(WWHW.SB.MOTION.RPOS.SENS);
	    return ret; // returns true if valid data, or false if the data made no sense.
	},
	eventAdxl345 : function(in_data) {
		// TODO - process in_data

		// TODO - put outpput to console 

		dlog('eventAdxl345 func.');
		dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));
		dlog('Adxl345 = 0x' + in_data.buf.readUInt8(4).toString(16));
		//var num = in_data.buf.readUInt16LE(5);
		//dlog('16 bit number after = 0x' + num.toString(16));

		var ret = {};
		ret.act = in_data.buf.readUInt8(4).toString(16);
		ret.xaxis = in_data.buf.readUInt8(5);
		ret.yaxis = in_data.buf.readUInt8(6);
		ret.zaxis = in_data.buf.readUInt8(7);
                ret.interrupt = in_data.buf.readUInt8(8).toString(16);

		return ret; // returns true if valid data, or false if the data made no sense.
	},

    //SAMPLE 
    testFuncOne : function(start,two) {
	// NOTE: all function must return an object in this format:
	var ret = {
	    totalbytes: 0, // the amount of bytes to send
	    buffer: null  // A Buffer object
	}
	if(start == undefined)
	    return null;
	
		// this test harness requires strings as parameter, so do some conversion
		var s= parseInt(start);
		if(two)
			var s2 = parseInt(two);
		else
			s2 = 0;

		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// debuggin output is cool:
		console.log("Start = " + start);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(s + 0x01 + s2,0);
		ret.buffer.writeUInt8(s + 0x02 + s2,1);
		ret.buffer.writeUInt8(s + 0x03 + s2,2);
		ret.buffer.writeUInt8(s + 0x04 + s2,3);

		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 4;

		// return the object - if the function fails return null
		return ret;
	},

	enableMode : function(m,r,g,b,c,w,t,k,x,y) {
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}


		var m = parseInt(m);
		var r = parseInt(r);
		var g = parseInt(g);
		var b = parseInt(b);
		var c = parseInt(c);
		var w = parseInt(w);
		var t = parseInt(t);
		var k = parseInt(k);
		var x = parseInt(x);
		var y = parseInt(y);


		// if(start == undefined)
		// 	return null;
	
		// this test harness requires strings as parameter, so do some conversion
		// var s= parseInt(start);
		// if(two)
		// 	var s2 = parseInt(two);
		// else
		// 	s2 = 0;

		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// debuggin output is cool:
		// console.log("Start = " + start);

		// fill up the buffer with what you need
		//ret.buffer.writeUInt8(parseInt(m),1); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(m),0); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(w),1); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(c),2); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(r),3); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(g),4); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(b),5); // freefall
		ret.buffer.writeUInt8(parseInt(t),6); // freefall
		ret.buffer.writeUInt8(parseInt(k),7); // freefall
		ret.buffer.writeUInt8(parseInt(x),8); // freefall
		ret.buffer.writeUInt8(parseInt(y),9); // freefall


		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 10;

		// return the object - if the function fails return null
		return ret;
	},
	enableDim : function(b,IDH,IDM,IDL) {
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}

		rVar = Math.floor((Math.random()*10)+1);

		var b = parseInt(b);
		var IDH = parseInt(IDH);
		var IDM = parseInt(IDM);
		var IDL = parseInt(IDL);
		var rVar = parseInt(rVar);	

		// if(start == undefined)
		// 	return null;
	
		// this test harness requires strings as parameter, so do some conversion
		// var s= parseInt(start);
		// if(two)
		// 	var s2 = parseInt(two);
		// else
		// 	s2 = 0;

		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// debuggin output is cool:
		// console.log("Start = " + start);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(0xAA,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0A,1); // put 0x0A in position 0
		ret.buffer.writeUInt8(0xFC,2); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x3A,3); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x86,4); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x01,5); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0C,6); // tap
		ret.buffer.writeUInt8(0x01,7); // doubletap
		ret.buffer.writeUInt8(parseInt(b),8); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(rVar),9); // put 0x0A in position 0
		sum = Number((0x55 + 0x0A + 0xFC + 0x3A + 0x86 + 0x01 + 0x0C + 0x01 + b + rVar) & 0xFF);
		//console.log("sum"+sum);
		ret.buffer.writeUInt8(sum,10); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0D,11);

		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 12;

		// return the object - if the function fails return null
		return ret;
	},
	enableONOFF : function(OF,IDH,IDM,IDL) {
	    	//VERIFIED
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}
		
		rVar = Math.floor((Math.random()*10)+1);
		var OF = parseInt(OF);
		var IDH = parseInt(IDH);
		var IDM = parseInt(IDM);
		var IDL = parseInt(IDL);
		var rVar = parseInt(rVar);		
		
		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);
		// fill up the buffer with what you need
		ret.buffer.writeUInt8(0xAA,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0A,1); // put 0x0A in position 0
		ret.buffer.writeUInt8(0xFC,2); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x3A,3); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x86,4); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x01,5); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0A,6); // tap
		ret.buffer.writeUInt8(0x01,7); // doubletap
		ret.buffer.writeUInt8(parseInt(OF),8); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(rVar),9); // put 0x0A in position 0
		sum = Number((0x55 + 0x0A + 0xFC + 0x3A + 0x86 + 0x01 + 0x0A + 0x01 + OF + rVar) & 0xFF);
		//console.log("sum"+sum);
		ret.buffer.writeUInt8(sum,10); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0D,11);
		
		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 12;

		// return the object - if the function fails return null
		return ret;
	},
	enableRGB : function(rgb,IDH,IDM,IDL) {
	    	//VERIFIED
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}

		rVar = Math.floor((Math.random()*10)+1);
		
		var rgb = parseInt(rgb);
		var IDH = parseInt(IDH);
		var IDM = parseInt(IDM);
		var IDL = parseInt(IDL);
		var rVar = parseInt(rVar);		
		
		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);
		// fill up the buffer with what you need
		ret.buffer.writeUInt8(0xAA,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0A,1); // put 0x0A in position 0
		ret.buffer.writeUInt8(0xFC,2); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x3A,3); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x86,4); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x01,5); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0B,6); // tap
		ret.buffer.writeUInt8(0x01,7); // doubletap
		ret.buffer.writeUInt8(parseInt(rgb),8); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(rVar),9); // put 0x0A in position 0
		sum = Number((0x55 + 0x0A + 0xFC + 0x3A + 0x86 + 0x01 + 0x0B + 0x01 + rgb + rVar) & 0xFF);
		//console.log("sum"+sum);
		ret.buffer.writeUInt8(sum,10); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0D,11);
		
		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 12;

		// return the object - if the function fails return null
		return ret;
	},
	enableWhite : function(w,IDH,IDM,IDL) {
	    	//VERIFIED
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}

		rVar = Math.floor((Math.random()*10)+1);
		
		var w = parseInt(w);
		var IDH = parseInt(IDH);
		var IDM = parseInt(IDM);
		var IDL = parseInt(IDL);
		var rVar = parseInt(rVar);		
		
		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);
		// fill up the buffer with what you need
		ret.buffer.writeUInt8(0xAA,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0A,1); // put 0x0A in position 0
		ret.buffer.writeUInt8(0xFC,2); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x3A,3); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x86,4); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x01,5); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0E,6); // tap
		ret.buffer.writeUInt8(0x01,7); // doubletap
		ret.buffer.writeUInt8(parseInt(w),8); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(rVar),9); // put 0x0A in position 0
		sum = Number((0x55 + 0x0A + 0xFC + 0x3A + 0x86 + 0x01 + 0x0E + 0x01 + w + rVar) & 0xFF);
		//console.log("sum"+sum);
		ret.buffer.writeUInt8(sum,10); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0D,11);
		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 12;

		// return the object - if the function fails return null
		return ret;
	}

};
