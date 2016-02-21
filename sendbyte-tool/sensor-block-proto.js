// Sensor block protocol functions
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
		'0x0001' : 'eventMotion',
		'0x0002' : 'eventAdxl345',
		'0x0003' : 'eventLED',
		'0x0004' : 'eventDHT11',
		'0x0005' : 'eventLM',
	    	'0x0006' : 'eventRelay',
		'0x0007' : 'eventPiezo',
		'0x0008' : 'eventPhoneJack1',
		'0x0009' : 'eventPhoneJack2',
		'0x000A' : 'eventVBattery',
		'0x000B' : 'eventIRT',
		'0x000C' : 'eventIRR',
		'0x000D' : 'eventReed',
		'0x000E' : 'eventMic',
		'0x0020' : 'eventButton'
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
		//ret.xaxis = in_data.buf.readUInt8(5);
		//ret.yaxis = in_data.buf.readUInt8(6);
		//ret.zaxis = in_data.buf.readUInt8(7);
                //ret.interrupt = in_data.buf.readUInt8(8).toString(16);

		return ret; // returns true if valid data, or false if the data made no sense.
	},
    	eventLED : function(in_data) {
		// TODO - process in_data
		// TODO - put outpput to console 

		dlog('eventLED func.');
		//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));
		//dlog('LED = 0x' + in_data.buf.readUInt8(4).toString(16));
		//var num = in_data.buf.readUInt16LE(5);
		//dlog('16 bit number after = 0x' + num.toString(16));

		var ret = {};
		ret.red = in_data.buf.readUInt8(4).toString(16);
		ret.green = in_data.buf.readUInt8(5).toString(16);
		ret.blue = in_data.buf.readUInt8(6).toString(16);

		return true; // returns true if valid data, or false if the data made no sense.
	},
	eventDHT11 : function(in_data) {
		// TODO - process in_data
		// TODO - put outpput to console 
		//dlog('in_data = ' + JSON.stringify(in_data));
		dlog('eventDHT11 func.');
		//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));
		//dlog('DHT11 = 0x' + in_data.buf.readUInt8(4).toString(16));
		//var num = in_data.buf.readUInt16LE(5);
		//dlog('16 bit number after = 0x' + num.toString(16));

		var ret = {};
		ret.temp = in_data.buf.readUInt8(4);
		ret.humid = in_data.buf.readUInt8(5);
		
		return ret; // returns true if valid data, or false if the data made no sense.
	},
	eventLM : function(in_data) {
		// TODO - process in_data
		// TODO - put outpput to console 
		//dlog('in_data = ' + JSON.stringify(in_data));
		dlog('eventLM func.');
		//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));
		//dlog('LM = 0x' + in_data.buf.readUInt8(4).toString(16));
		//var num = in_data.buf.readUInt16LE(5);
		//dlog('16 bit number after = 0x' + num.toString(16));
		
                var ret = {};                                                                                                                    
         	    ret.light1 = (in_data.buf.readUInt8(5) | (in_data.buf.readUInt8(4) <<8));
	            ret.light2 = (in_data.buf.readUInt8(7) | (in_data.buf.readUInt8(6) <<8)); 
	    
            	var R = ret.light2/ret.light1;
	    	if( 0 < R && R <= 0.50)
			ret.lux = (0.0304 * ret.light1) - (0.062 * ret.light1 * ((ret.light2/ret.light1) * ((ret.light2/ret.light1)*0.4)));
	    	else if( 0.5 < R && R <= 0.61)
			ret.lux = (0.0224 * ret.light1) - (0.031 * ret.light2);
	    	else if(0.61<R && R <= 0.8)
			ret.lux = (0.0128*ret.light1) - (0.0153*ret.light2);
	    	else if(0.8 < R && R <=1.3)
			ret.lux = (0.00146 * ret.light1) - (0.00112 * ret.light2);
	    	else if(ret.light2/ret.light1 >1.3)
			ret.lux = 0;

	  	ret.lux /= 0.252;

	    	if(ret.light2 == 0)
			ret.lux = -1;

		if(light1 > 0x9000 && light2 > 0x4000)
	    	    		lux = 4500;

	        return ret; // returns true if valid data, or false if the data made no sense.
	},
    	eventRelay : function(in_data) {                                                                                                            
		// TODO - put outpput to console                                                                                                  
        	// dlog('in_data = ' + JSON.stringify(in_data));
		dlog('eventLM func.');                                                                                                           
        	//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));                                                                  
        	//dlog('LM = 0x' + in_data.buf.readUInt8(4).toString(16));                                                                         
        
		// var num = in_data.buf.readUInt16LE(5);                                                                                           
        	// dlog('16 bit number after = 0x' + num.toString(16));                                                                            
        	var ret = {};                                                                                                                     
        	ret.ONOFF = in_data.buf.readUInt8(4);
		return ret; // returns true if valid data, or false if the data made no sense.                                                    
    	},
    	eventPiezo : function(in_data) {                                                                                                           
		// TODO - put outpput to console                                                                                                  
        	// dlog('in_data = ' + JSON.stringify(in_data));
		dlog('eventPiezo func.');                                                                                                           
        	//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));                                                                  
        	//dlog('Piezo = 0x' + in_data.buf.readUInt8(4).toString(16));                                                                         
        
		// var num = in_data.buf.readUInt16LE(5);                                                                                           
        	// dlog('16 bit number after = 0x' + num.toString(16));                                                                            
        	var ret = {};                                                                                                                     
        	ret.ONOFF = in_data.buf.readUInt8(4);
		return ret; // returns true if valid data, or false if the data made no sense.                                                    
    	},
    	eventPhoneJack1 : function(in_data) {                                                                                                          
		// TODO - put outpput to console                                                                                                  
        	// dlog('in_data = ' + JSON.stringify(in_data));
		dlog('eventPhoneJack1 func.');                                                                                                           
        	//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));                                                                  
        	//dlog('PhoneJack1 = 0x' + in_data.buf.readUInt8(4).toString(16));                                                                         
        
		// var num = in_data.buf.readUInt16LE(5);                                                                                           
        	// dlog('16 bit number after = 0x' + num.toString(16));                                                                            
        	var ret = {};                                                                                                                     
        	ret.ONOFF = in_data.buf.readUInt8(4);
		return ret; // returns true if valid data, or false if the data made no sense.                                                    
    	},
    	eventPhoneJack2 : function(in_data) {                                                                                                            
		// TODO - put outpput to console                                                                                                  
        	// dlog('in_data = ' + JSON.stringify(in_data));
		dlog('eventPhoneJack2 func.');                                                                                                           
        	//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));                                                                  
        	//dlog('PhoneJack2 = 0x' + in_data.buf.readUInt8(4).toString(16));                                                                         
        
		// var num = in_data.buf.readUInt16LE(5);                                                                                           
        	// dlog('16 bit number after = 0x' + num.toString(16));                                                                            
        	var ret = {};                                                                                                                     
        	ret.ONOFF = in_data.buf.readUInt8(4);
		return ret; // returns true if valid data, or false if the data made no sense.                                                    
    	},
	eventVBattery : function(in_data) {                                                                                                            
		// TODO - put outpput to console                                                                                                  
        	// dlog('in_data = ' + JSON.stringify(in_data));
		dlog('eventVBattery func.');                                                                                                           
        	//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));                                                                  
        	//dlog('eventVBattery = 0x' + in_data.buf.readUInt8(4).toString(16));                                                                         
        
		// var num = in_data.buf.readUInt16LE(5);                                                                                           
        	// dlog('16 bit number after = 0x' + num.toString(16));                                                                            
        	var ret = {};                                                                                                                     
        	ret.ONOFF = in_data.buf.readUInt8(4);
		return ret; // returns true if valid data, or false if the data made no sense.                                                    
    	},
	eventIRT : function(in_data) {                                                                                                          
		// TODO - put outpput to console                                                                                                  
        	// dlog('in_data = ' + JSON.stringify(in_data));
		dlog('eventIRT func.');                                                                                                           
        	//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));                                                                  
        	//dlog('eventIRT = 0x' + in_data.buf.readUInt8(4).toString(16));                                                                         
        
		// var num = in_data.buf.readUInt16LE(5);                                                                                           
        	// dlog('16 bit number after = 0x' + num.toString(16));                                                                            
        	var ret = {};                                                                                                                     
        	ret.ONOFF = in_data.buf.readUInt8(4);
		return ret; // returns true if valid data, or false if the data made no sense.                                                    
    	},
	eventIRR : function(in_data) {                                                                                                            
		// TODO - put outpput to console                                                                                                  
        	// dlog('in_data = ' + JSON.stringify(in_data));
		dlog('eventIRR func.');                                                                                                           
        	//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));                                                                  
        	//dlog('eventIRR = 0x' + in_data.buf.readUInt8(4).toString(16));                                                                         
        
		// var num = in_data.buf.readUInt16LE(5);                                                                                           
        	// dlog('16 bit number after = 0x' + num.toString(16));                                                                            
        	var ret = {};                                                                                                                     
        	ret.ONOFF = in_data.buf.readUInt8(4);
		return ret; // returns true if valid data, or false if the data made no sense.                                                    
    	},
	eventReed : function(in_data) {                                                                                                           
		// TODO - put outpput to console                                                                                                  
        	// dlog('in_data = ' + JSON.stringify(in_data));
		dlog('eventReed func.');                                                                                                           
        	//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));                                                                  
        	//dlog('eventReed = 0x' + in_data.buf.readUInt8(4).toString(16));                                                                         
        
		// var num = in_data.buf.readUInt16LE(5);                                                                                           
        	// dlog('16 bit number after = 0x' + num.toString(16));                                                                            
        	var ret = {};                                                                                                                     
        	ret.ONOFF = in_data.buf.readUInt8(4);
		return ret; // returns true if valid data, or false if the data made no sense.                                                    
    	},
	eventMic : function(in_data) {                                                                                                           
		// TODO - put outpput to console                                                                                                  
        	// dlog('in_data = ' + JSON.stringify(in_data));
		dlog('eventMic func.');                                                                                                           
        	//dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));                                                                  
        	//dlog('eventMic = 0x' + in_data.buf.readUInt8(4).toString(16));                                                                         
        
		// var num = in_data.buf.readUInt16LE(5);                                                                                           
        	// dlog('16 bit number after = 0x' + num.toString(16));                                                                            
        	var ret = {};                                                                                                                     
        	ret.durration = in_data.buf.readUInt8(4);
		return ret; // returns true if valid data, or false if the data made no sense.                                                    
    	},
	eventButton : function(in_data) {
	    	// TODO - process in_data
	    	// TODO - put outpput to console 
	    	dlog('eventButton func.');
	    	
		var ret = {};
	    	ret.durration = in_data.buf.readUInt8(5);  //returns durration of long button press
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
	enableMotion  : function(ONOFF,sensitivity) {
	    	// NOTE: all function must return an object in this format:
	    	var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
	    	}
	    	if(typeof sensitivity === undefined) {
			dlog("sensitivity not set. default 0x55");
			sensitivity = 0x55;
	    	}
	    	if(sensitivity > 255){
			errlog("Sensitive too high. Max 255. Setting 255");
			sensitivity = 0xFF;
	    	}
		if(typeof ONOFF === undefined) {
			dlog("ONOFF not set. default 0x00");
			ONOFF = 0x00;
	    	}
	    	if(ONOFF > 1){
			errlog("ONOFF invalid. ON 1 OFF 0. Setting 0");
			ONOFF = 0x00;
	    	}
	    	ret.buffer = new Buffer(60);
	    
	    	// fill up the buffer with what you need to  send
	    	ret.buffer.writeUInt8(WWHW.SB.MOTION.ID,WWHW.SB.MOTION.SPOS.ID); 
	    	ret.buffer.writeUInt8(parseInt(ONOFF),WWHW.SB.MOTION.SPOS.ONOFF); 
	    	ret.buffer.writeUInt8(parseInt(sensitivity),WWHW.SB.MOTION.SPOS.SENS); 
	    
	    	// make sure to say how many bytes you are sending
	    	ret.totalbytes = WWHW.SB.MOTION.BYTES;
	    
	    	// return the object - if the function fails return null
	    	return ret;
	},
	enableAdxl345  : function(ONOFF,tap,doubletap,freefall) {
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}
		if(typeof ONOFF === undefined) {
			dlog("ONOFF not set. default 0x00");
			ONOFF = 0x00;
	    	}
	    	if(ONOFF > 1){
			errlog("ONOFF invalid. ON 1 OFF 0. Setting 0");
			ONOFF = 0x00;
	    	}
		if(typeof tap === undefined) {
			dlog("TAP not set. default 0x00");
			tap = 0x00;
	    	}
	    	if(tap > 1){
			errlog("TAP invalid. ON 1 OFF 0. Setting 0");
			tap = 0x00;
	    	}
		if(typeof doubletap === undefined) {
			dlog("DOUBLE TAP not set. default 0x00");
			doubletap = 0x00;
	    	}
	    	if(doubletap > 1){
			errlog("DOUBLE TAP invalid. ON 1 OFF 0. Setting 0");
			doubletap = 0x00;
	    	}
		if(typeof freefall === undefined) {
			dlog("FREEFALL not set. default 0x00");
			freefall = 0x00;
	    	}
	    	if(freefall > 1){
			errlog("FREEFALL invalid. ON 1 OFF 0. Setting 0");
			freefall = 0x00;
	    	}

		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(WWHW.SB.ADXL345.ID,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(ONOFF),1); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(tap),2); // tap
		ret.buffer.writeUInt8(parseInt(doubletap),3); // doubletap
		ret.buffer.writeUInt8(parseInt(freefall),4); // freefall

		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 5;

		// return the object - if the function fails return null
		return ret;
	},
    	//Red: 0|1 (on|off)
    	//Green: 0|1 (on|off)
    	//Blue: 0|1 (on|off)
    	//mseconds1: number of seconds (see mode)
    	//mseconds2: number of secionds (see mode)
    	//mode: 1 (turn on light immediatly)
    	//mode: 2 (turn on light immediatly, turn it off afte mseconds1)
    	//mode: 3 (not implemented)
	enableLED : function(ONOFF,red,green,blue,mseconds1,mseconds2,mode) {
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}
		if(typeof ONOFF === undefined) {
			dlog("ONOFF not set. default 0x00");
			ONOFF = 0x00;
	    	}
	    	if(ONOFF > 1){
			errlog("ONOFF invalid. ON 1 OFF 0. Setting 0");
			ONOFF = 0x00;
	    	}
		if(typeof red === undefined) {
			dlog("RED not set. default 0x00");
			red = 0x00;
	    	}
	    	if(red > 1){
			errlog("RED invalid. ON 1 OFF 0. Setting 0");
			red = 0x00;
	    	}
		if(typeof green === undefined) {
			dlog("GREEN not set. default 0x00");
			green = 0x00;
	    	}
	    	if(green > 1){
			errlog("GREEN invalid. ON 1 OFF 0. Setting 0");
			green = 0x00;
	    	}
		if(typeof blue === undefined) {
			dlog("BLUE not set. default 0x00");
			blue = 0x00;
	    	}
	    	if(blue > 1){
			errlog("BLUE invalid. ON 1 OFF 0. Setting 0");
			blue = 0x00;
	    	}
		if(typeof mseconds1 === undefined) {
			dlog("mseconds1 not set. default 0x00");
			mseconds1 = 0x00;
	    	}
	    	if(mseconds1 > 255){
			errlog("mseconds1 too high. Max 255. Setting 255");
			mseconds1 = 0xff;
	    	}
		if(typeof mseconds2 === undefined) {
			dlog("mseconds2 not set. default 0x00");
			mseconds2 = 0x00;
	    	}
	    	if(mseconds2 > 255){
			errlog("mseconds2 too high. Max 255. Setting 255");
			mseconds2 = 0xff;
	    	}
		if(typeof mode === undefined) {
			dlog("mode not set. default 0x00");
			mode = 0x00;
	    	}
	    	if(mode > 2){
			errlog("mode invalid. Setting 0");
			mode = 0x00;
	    	}

		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(WWHW.SB.LED.ID,0);  //ADDRESS
		ret.buffer.writeUInt8(parseInt(ONOFF),1);  //ON
		ret.buffer.writeUInt8(parseInt(red),2); //RED 
		ret.buffer.writeUInt8(parseInt(green),3); //GREEN
		ret.buffer.writeUInt8(parseInt(blue),4);  //BLUE
		ret.buffer.writeUInt8(parseInt(mseconds1),5); 
		ret.buffer.writeUInt8(parseInt(mseconds2),6);
		ret.buffer.writeUInt8(parseInt(mode),7);

		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 8;

		// return the object - if the function fails return null
		return ret;
	},
	enableDHT11Sensor : function(ONOFF) {	    
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}
		if(typeof ONOFF === undefined) {
			dlog("ONOFF not set. default 0x00");
			ONOFF = 0x00;
	    	}
	    	if(ONOFF > 1){
			errlog("ONOFF invalid. ON 1 OFF 0. Setting 0");
			ONOFF = 0x00;
	    	}

		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(WWHW.SB.DHT11.ID,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(ONOFF),1); // put 0x0A in position 0

		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 2;

		// return the object - if the function fails return null
		return ret;
	},
	enableLMSensor  : function(ONOFF, LL, LH, HL, HH) {	
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}
		if(typeof ONOFF === undefined) {
			dlog("ONOFF not set. default 0x00");
			ONOFF = 0x00;
	    	}
	    	if(ONOFF > 1){
			errlog("ONOFF invalid. ON 1 OFF 0. Setting 0");
			ONOFF = 0x00;
	    	}

		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(WWHW.SB.LM.ID,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(ONOFF),1); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(LL),2);
		ret.buffer.writeUInt8(parseInt(LH),3);
		ret.buffer.writeUInt8(parseInt(HL),4);
		ret.buffer.writeUInt8(parseInt(HH),5);

		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 6;
	    
	   	return ret;
	},       
    	enableRelay  : function(ONOFF) {
        	// NOTE: all function must return an object in this format:                                                                       
       		var ret = {                                                                                                                       
			totalbytes: 0, // the amount of bytes to send                                                                             
            		buffer: null  // A Buffer object                                                                               
        	}
		if(typeof ONOFF === undefined) {
			dlog("ONOFF not set. default 0x00");
			ONOFF = 0x00;
	    	}
	    	if(ONOFF > 1){
			errlog("ONOFF invalid. ON 1 OFF 0. Setting 0");
			ONOFF = 0x00;
	    	}

         	// allocate a Buffer for storing bytes:                                                                                           
        	ret.buffer = new Buffer(60);                                                                                                 
        
		// fill up the buffer with what you need                                                                                                                                                    
		ret.buffer.writeUInt8(WWHW.SB.RLY.ID,0); // ID the process                                                                            
        	ret.buffer.writeUInt8(parseInt(ONOFF),1); // turn it on                                                                                                            
	 	
		// make sure to say how many bytes you are sending, here 4:                                                                       
	 	ret.totalbytes = 2;                                                                                                               

	 	return ret;                                                                                                                           
     	},
    	enablePeizo  : function() {
        	// NOTE: all function must return an object in this format:                                                                       
        	var ret = {                                                                                                                       
			totalbytes: 0, // the amount of bytes to send                                                                             
            		buffer: null  // A Buffer object                                                                               
        	}

         	// allocate a Buffer for storing bytes:                                                                                          
		ret.buffer = new Buffer(60);                                                                                                 
        
		// fill up the buffer with what you need                                                                                                                                                  
		ret.buffer.writeUInt8(WWHW.SB.PEIZO.ID,0); // ID the process                                                                            
        	ret.buffer.writeUInt8(0x01,1); // turn it on                                                                                                            
	 	
		// make sure to say how many bytes you are sending, here 4:                                                                       
	 	ret.totalbytes = 2;                                                                                                               

	 	return ret;                                                                                                                           
     },
     enablePhoneJack1  : function() {
        	// NOTE: all function must return an object in this format:                                                                       
        	var ret = {                                                                                                                       
			totalbytes: 0, // the amount of bytes to send                                                                             
            		buffer: null  // A Buffer object                                                                               
        	}

         	// allocate a Buffer for storing bytes:                                                                                          
		ret.buffer = new Buffer(60); 

		// fill up the buffer with what you need                                                                                                                                                   
		ret.buffer.writeUInt8(WWHW.SB.PHJ1.ID,0); // ID the process                                                                            
        	ret.buffer.writeUInt8(0x01,1); // turn it on                                                                                                            
	 	
		// make sure to say how many bytes you are sending, here 4:                                                                       
	 	ret.totalbytes = 2;                                                                                                               

	 	return ret;                                                                                                                           
     },
     enablePhoneJack2  : function() {
        	// NOTE: all function must return an object in this format:                                                                       
        	var ret = {                                                                                                                       
			totalbytes: 0, // the amount of bytes to send                                                                             
            		buffer: null  // A Buffer object                                                                               
        	}

         	// allocate a Buffer for storing bytes:                                                                                          
		ret.buffer = new Buffer(60);                                                                                                 
        
		// fill up the buffer with what you need                                                                                                                                               
		ret.buffer.writeUInt8(WWHW.SB.PHJ2.ID,0); // ID the process                                                                            
        	ret.buffer.writeUInt8(0x01,1); // turn it on                                                                                                            
	 	
		// make sure to say how many bytes you are sending, here 4:                                                                       
	 	ret.totalbytes = 2;                                                                                                               

	 	return ret;                                                                                                                           
     },
     enableVBattery  : function() {
        	// NOTE: all function must return an object in this format:                                                                       
        	var ret = {                                                                                                                       
			totalbytes: 0, // the amount of bytes to send                                                                             
            		buffer: null  // A Buffer object                                                                               
        	}

         	// allocate a Buffer for storing bytes:                                                                                          
		ret.buffer = new Buffer(60);                                                                                              		     
                
		// fill up the buffer with what you need                                                                                                                                
		ret.buffer.writeUInt8(WWHW.SB.VBATT.ID,0); // ID the process                                                                            
        	ret.buffer.writeUInt8(0x01,1); // turn it on                                                                                                            
	 	
		// make sure to say how many bytes you are sending, here 4:                                                                       
	 	ret.totalbytes = 2;                                                                                                               

	 	return ret;                                                                                                                           
     },
     enableIRT  : function() {
        	// NOTE: all function must return an object in this format:                                                                       
        	var ret = {                                                                                                                       
			totalbytes: 0, // the amount of bytes to send                                                                             
            		buffer: null  // A Buffer object                                                                               
        	}

         	// allocate a Buffer for storing bytes:                                                                                          
		ret.buffer = new Buffer(60);                                                                                                 
        
		// fill up the buffer with what you need                                                                                                                                                    
		ret.buffer.writeUInt8(WWHW.SB.IRT.ID,0); // ID the process                                                                            
        	ret.buffer.writeUInt8(0x01,1); // turn it on                                                                                                            
	 	
		// make sure to say how many bytes you are sending, here 4:                                                                       
	 	ret.totalbytes = 2;                                                                                                               

	 	return ret;                                                                                                                           
     },
     enableIRR  : function() {
        	// NOTE: all function must return an object in this format:                                                                       
        	var ret = {                                                                                                                       
			totalbytes: 0, // the amount of bytes to send                                                                             
            		buffer: null  // A Buffer object                                                                               
        	}

         	// allocate a Buffer for storing bytes:                                                                                          
		ret.buffer = new Buffer(60);                                                                                                 
        
		// fill up the buffer with what you need                                                                                                                                                   
		ret.buffer.writeUInt8(WWHW.SB.IRR.ID,0); // ID the process                                                                            
        	ret.buffer.writeUInt8(0x01,1); // turn it on                                                                                                            
	 	
		// make sure to say how many bytes you are sending, here 4:                                                                       
	 	ret.totalbytes = 2;                                                                                                               

	 	return ret;                                                                                                                           
     },
     enableReed  : function() {
        	// NOTE: all function must return an object in this format:                                                                       
        	var ret = {                                                                                                                       
			totalbytes: 0, // the amount of bytes to send                                                                             
            		buffer: null  // A Buffer object                                                                               
        	}

         	// allocate a Buffer for storing bytes:                                                                                          
		ret.buffer = new Buffer(60);                                                                                                
        
		// fill up the buffer with what you need                                                                                                                                                    
		ret.buffer.writeUInt8(WWHW.SB.REED.ID,0); // ID the process                                                                            
        	ret.buffer.writeUInt8(0x01,1); // turn it on                                                                                                            
	 	
		// make sure to say how many bytes you are sending, here 4:                                                                       
	 	ret.totalbytes = 2;                                                                                                               

	 	return ret;                                                                                                                           
     },
     enableMic  : function() {
        	// NOTE: all function must return an object in this format:                                                                       
        	var ret = {                                                                                                                       
			totalbytes: 0, // the amount of bytes to send                                                                             
            		buffer: null  // A Buffer object                                                                               
        	}

         	// allocate a Buffer for storing bytes:                                                                                          
		ret.buffer = new Buffer(60);                                                                                                
        
		// fill up the buffer with what you need                                                                                                                                                    
		ret.buffer.writeUInt8(WWHW.SB.MIC.ID,0); // ID the process                                                                            
        	ret.buffer.writeUInt8(0x01,1); // turn it on                                                                                                            
	 	
		// make sure to say how many bytes you are sending, here 4:                                                                       
	 	ret.totalbytes = 2;                                                                                                               

	 	return ret;                                                                                                                           
     },
     enableButton  : function() {
        	// NOTE: all function must return an object in this format:                                                                       
        	var ret = {                                                                                                                       
			totalbytes: 0, // the amount of bytes to send                                                                             
            		buffer: null  // A Buffer object                                                                               
        	}

         	// allocate a Buffer for storing bytes:                                                                                          
		ret.buffer = new Buffer(60);                                                                                            
        
		// fill up the buffer with what you need                                                                                                                                                   
		ret.buffer.writeUInt8(WWHW.SB.BTN.ID,0); // ID the process                                                                            
        	ret.buffer.writeUInt8(0x01,1); // turn it on                                                                                                            
	 	
		// make sure to say how many bytes you are sending, here 4:                                                                       
	 	ret.totalbytes = 2;                                                                                                               

	 	return ret;                                                                                                                           
     },
                                                                                                                                                                                                                                                                           
   
};
