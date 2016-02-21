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
	enablePanel  : function(ONOFF,out1,out2) {
	    	// NOTE: all function must return an object in this format:
	    	var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
	    	}
	    	
	    	ret.buffer = new Buffer(60);
	    
		if(ONOFF == 0){
			ret.buffer.writeUInt8(0x00,WWHW.SB.MOTION.SPOS.ID); 
	    		ret.buffer.writeUInt8(0xff,WWHW.SB.MOTION.SPOS.ONOFF); 
	    		ret.buffer.writeUInt8(0xff,WWHW.SB.MOTION.SPOS.SENS);

		}else{
	    	// fill up the buffer with what you need to  send
	    		ret.buffer.writeUInt8(0x01,WWHW.SB.MOTION.SPOS.ID); 
	    		ret.buffer.writeUInt8(parseInt(out1),WWHW.SB.MOTION.SPOS.ONOFF); 
	    		ret.buffer.writeUInt8(parseInt(out2),WWHW.SB.MOTION.SPOS.SENS); 
	    	}
	    	// make sure to say how many bytes you are sending
	    	ret.totalbytes = WWHW.SB.MOTION.BYTES;
	    
	    	// return the object - if the function fails return null
	    	return ret;
	}
                
};
