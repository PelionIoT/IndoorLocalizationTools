// ww_hwdevice.js



// Protocol layout:
// UDP:
// [MESSAGE_ID /16][SEQ ID     /16][FLAGS      /16][OPTIONAL   /16][PAYLOAD ................]
// 0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF------------------------->

// First Message: Sender -> Recv
// [MESSAGE ID /16][SEQ ID (0) /16][FIRST FLAG    ][TOTAL SEQ     ][First payload           ]

// Last Message: Sender -> Recv
// [MESSAGE ID /16][SEQ ID (#) /16][LAST FLAG     ][TOTAL SEQ     ][First payload           ]

// Full Message Received: Recv -> Sender
// [MESSAGE ID /16][SEQ ID (#) /16][LAST FLAG  | ACK   ][ null    ]

// Lost Pack: Recv -> Sender     (SEQ ID is last received, but SEQ LOST is the one Recv needs)
// [MESSAGE ID /16][SEQ ID (#) /16][LOST FLAG     ][SEQ LOST    ]

// Lost Pack - Resend all from seq num #: Recv -> Sender
// [MESSAGE ID /16][SEQ ID (#) /16][LOST | RESEND_ALL][ null ]


// Up the protocol stack..
// Events:
// [ numbers are bytes ]
// 
// [    HEADER 8   ] [ -------------  PAYLOAD ----------->
// Payloads are defined by categories...
// [    HEADER 8   ] [ CATG 2 ]
// Category: Asynchronous events (pushes from devices)
// [    HEADER 8   ] [ 0xF001 ] [ EVENTCODE 2 ]



var ww_hwdevice = {

    ID:0,
    SB: {
	MOTION:{
	    ID:0x01,
	    ON:0x01,
	    OFF:0x00,
	    BYTES:3,
	    SPOS:{
		ID:0,
		ONOFF:1,
		SENS:2,
	    },
	    RPOS:{
		SENS:4,
	    }
	},
	ADXL345:{
	    ID:0x02,
	    ON:0x01,
	    OFF:0x00,
	    BYTES:12,
	},
	LED:{
	    ID:0x03,
	    ON:0x01,
	    OFF:0x00,
	    BYTES:8,
	},
	DHT11:{
	    ID:0x04,
	    ON:0x01,
	    OFF:0x00,
	    BYTES:2,
	},
	LM:{
	    ID:0x05,
	    ON:0x01,
	    OFF:0x00,
	    BYTES:2,
	},
	RLY:{
	    ID:0x06,
	    ON:0x1,
	    OFF:0x00,
	},
	PEIZO:{
	    ID:0x07,
	    ON:0x1,
	    OFF:0x00,
	},
	PHJ1:{
	    ID:0x08,
	    ON:0x1,
	    OFF:0x00,
	},
	PHJ2:{
	    ID:0x09,
	    ON:0x1,
	    OFF:0x00,
	},
	VBATT:{
	    ID:0x0A,
	    ON:0x1,
	    OFF:0x00,
	},
	IRT:{
	    ID:0x0B,
	    ON:0x1,
	    OFF:0x00,
	},
	IRR:{
	    ID:0x0C,
	    ON:0x1,
	    OFF:0x00,
	},
	REED:{
	    ID:0x0D,
	    ON:0x1,
	    OFF:0x00,
	},
	MIC:{
	    ID:0x0E,
	    ON:0x1,
	    OFF:0x00,
	},
	BTN:{
	    ID:0x20,
	    ON:0x1,
	    OFF:0x00,
	}
    },
    
    GL: {
	COLOR:1,
    }
};



	exports = module.exports = ww_hwdevice;
