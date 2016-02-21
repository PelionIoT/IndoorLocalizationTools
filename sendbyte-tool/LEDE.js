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


    // Not Needed at CES
    eventLED : function(in_data) {
	//VERIFIED
		// TODO - process in_data

		// TODO - put outpput to console 
		dlog('eventLED func.');
		dlog('data is = ' + stringifyBytes(in_data.buf, in_data.size));
		dlog('LED = 0x' + in_data.buf.readUInt8(4).toString(16));
		//var num = in_data.buf.readUInt16LE(5);
		//dlog('16 bit number after = 0x' + num.toString(16));

		var ret = {};
		ret.red = in_data.buf.readUInt8(4).toString(16);
		ret.green = in_data.buf.readUInt8(5).toString(16);
		ret.blue = in_data.buf.readUInt8(6).toString(16);

		return true; // returns true if valid data, or false if the data made no sense.
	},
	eventButton : function(in_data) {
	    //VERFIED
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

	enableMode 	: function(m,r,g,b,c,w,rVar) {
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}

		// if(start == undefined)
		// 	return null;
	
		// // this test harness requires strings as parameter, so do some conversion
		// var s= parseInt(start);
		// if(two)
		// 	var s2 = parseInt(two);
		// else
		// 	s2 = 0;


		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// debuggin output is cool:
//		console.log("Start = " + start);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(0xAA,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0A,1); // put 0x0A in position 0
		ret.buffer.writeUInt8(0xFC,2); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x3A,3); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x86,4); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x01,5); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0D,6); // tap
		ret.buffer.writeUInt8(0x06,7); // doubletap
		ret.buffer.writeUInt8(parseInt(m),8); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(r),9); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(g),10); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(b),11); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(c),12); // put 0x0A in position 0
		ret.buffer.writeUInt8(parseInt(w),13); // freefall
		ret.buffer.writeUInt8(parseInt(rVar),14); // put 0x0A in position 0
		sum = 0x55 + 0x0A + 0xFC + 0x3A + 0x86 + 0x01 + 0x0D + 0x06 + m + r + g + b + c + w + rVar;
		ret.buffer.writeUInt8(sum,15); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x0D,16); // inactivity

		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 17;

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
	enableLED 	: function(red,green,blue,mseconds1,mseconds2,mode) {
	    //VERIFIED
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}
		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// debuggin output is cool:
//		console.log("Start = " + start);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(0x01,0);  //ADDRESS
		ret.buffer.writeUInt8(0x01,1);  //ON
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
	disableLED 	: function() {
	    //VERIFIED
	    // NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}


		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// debuggin output is cool:
//		console.log("Start = " + start);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(0x01,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x00,1); // put 0x0A in position 0
                ret.buffer.writeUInt8(0x00,2); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x00,3); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x00,4); // put 0x0A in position 0

		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 5;

		// return the object - if the function fails return null
		return ret;
	},
	enableDHT11Sensor 	: function() {
	    //
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}


		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// debuggin output is cool:
//		console.log("Start = " + start);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(0x03,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x01,1); // put 0x0A in position 0


		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 2;

		// return the object - if the function fails return null
		return ret;
	},
	disableDHT11Sensor 	: function() {
		// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}


		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// debuggin output is cool:
//		console.log("Start = " + start);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(0x03,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x00,1); // put 0x0A in position 0


		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 2;

		// return the object - if the function fails return null
		return ret;
	},
	enableLMSensor 	: function() {
	
	// NOTE: all function must return an object in this format:
		var ret = {
			totalbytes: 0, // the amount of bytes to send
			buffer: null  // A Buffer object
		}


		// allocate a Buffer for storing bytes:
		ret.buffer = new Buffer(60);

		// debuggin output is cool:
//		console.log("Start = " + start);

		// fill up the buffer with what you need
		ret.buffer.writeUInt8(0x08,0); // put 0x0A in position 0
		ret.buffer.writeUInt8(0x01,1); // put 0x0A in position 0


		// make sure to say how many bytes you are sending, here 4:
		ret.totalbytes = 2;
	    
	    return ret;

	},
       disableLMSensor  : function() {                                                                                                            
                // NOTE: all function must return an object in this format:                                                                       
        var ret = {                                                                                                                       
            totalbytes: 0, // the amount of bytes to send                                                                             
            buffer: null  // A Buffer object                                                                                          
        }                                                                                                                                 
                                                                                                                                                  
                                                                                                                                                  
                // allocate a Buffer for storing bytes:                                                                                           
        ret.buffer = new Buffer(60);                                                                                                      
                                                                                                                                                  
                // debuggin output is cool:                                                                                                       
//              console.log("Start = " + start);                                                                                                  
                                                                                                                                                  
                // fill up the buffer with what you need                                                                                          
        ret.buffer.writeUInt8(0x08,0); // put 0x0A in position 0                                                                          
        ret.buffer.writeUInt8(0x00,1); // put 0x0A in position 0                                                                                                                                                                                          
                                                                                                                                                  
                // make sure to say how many bytes you are sending, here 4:                                                                       
        ret.totalbytes = 2;                                                                                                               
                                                                                                                                                  
        return ret;                                                                                                                           
                                                                                                                                                  
    },       
    enableRelay  : function() {
        // VERIFIED
        // NOTE: all function must return an object in this format:                                                                       
        var ret = {                                                                                                                       
            totalbytes: 0, // the amount of bytes to send                                                                             
            buffer: null  // A Buffer object                                                                               
        }

         // allocate a Buffer for storing bytes:                                                                                                                                          
        ret.buffer = new Buffer(60); 

	// debuggin output is cool:                                                                                                       
	// console.log("Start = " + start);                                                                                                 
        
	// fill up the buffer with what you need     
                                                                                                                                                
	ret.buffer.writeUInt8(WWHW.SB.MOTION.ID,0); // ID the process                                                                            
        ret.buffer.writeUInt8(0x01,1); // turn it on                                                                                                            
	 // make sure to say how many bytes you are sending, here 4:                                                                       
	 ret.totalbytes = 2;                                                                                                               

	 return ret;                                                                                                                           
     },

     disableRelay  : function() {                                                                                                                
	 //VERIFIED
	 var ret = {                                                                                                                                          totalbytes: 0, // the amount of bytes to send                                                                                                    buffer: null  // A Buffer object                                                                                                     
	 }                                                                                                                                       


		 // allocate a Buffer for storing bytes:                                                                                          

	 ret.buffer = new Buffer(60);                                                                                                            

		 // debuggin output is cool:                                                                                                                                                                                                                                                   
 //              console.log("Start = " + start);                                                                                                 

		 // fill up the buffer with what you need                                                                                        

	 ret.buffer.writeUInt8(WWHW.SB.MOTION.ID,0); // ID the process
	 ret.buffer.writeUInt8(0x00,1); // turn it off                                                                                 


		 // make sure to say how many bytes you are sending, here 4:                                                                     
                                                                                                                                                 
        ret.totalbytes = 2;                                                                                                                      
                                                                                                                                                
                                                                                                                                               
        return ret;                                                                                                                           
                                                                                                                                             
                                                                                                                                           
    }
};
