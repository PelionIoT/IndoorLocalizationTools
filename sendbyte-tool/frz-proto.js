// frz-proto.js



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



var frz_proto = {

	CATEGORY : {
		COMMAND : 0x0001,
		ASYNC_PUSH : 0xF001
	},
	// from frzproto.h header
//	MAX_PACK_SIZE: 120-8,

	// in bytes
	FRZ_HEADER_SIZE: 8,
	FRZ_MAX_TRANSFER_LEN: 120*7,
	MAX_6LOWPAN_UDP_PAYLOAD: 102,

	FRZ_IN_TRANSFER: 2,
	FRZ_WAITING:     0,
	FRZ_PROCESSING:  4,

	// offsets are in bytes
	MESSAGE_ID_OFFSET:   0,
	SEQ_ID_OFFSET:       2,
	FRZ_FLAGS_OFFSET :   4,
	FRZ_OPTIONAL_OFFSET :6,



// 		#define FRZ_FLAG_ACK      0x0001
// #define FRZ_FLAG_FIRST    0x0002
// #define FRZ_FLAG_LAST     0x0004
// #define FRZ_FLAG_LOST     0x1000
// #define FRZ_FLAG_RESET    0x2000  // tells far-end to reset everything they know about previous states
// #define FRZ_FLAG_FAIL     0x4000  // tells far-end to reset everything they know about previous states

// #define FRZ_ERROR_TOO_BIG 0x0010
	FRZ_FLAG_ACK    :  0x0001,
	FRZ_FLAG_FIRST  :  0x0002,
	FRZ_FLAG_LAST   :  0x0004,
	FRZ_FLAG_LOST   :  0x1000,
	FRZ_FLAG_RESET  :  0x2000 , // tells far-end to reset everything they know about previous states
	FRZ_FLAG_FAIL   :  0x4000 , // tells far-end to reset everything they know about previous states
	FRZ_ERROR_TOO_BIG: 0x0010,

	/*
	#define SET_FRZ_SEQ_ID( hdr, v ) { *((uint32_t *) hdr) = ((uint32_t) (v) & 0xFF) | (*((uint32_t *) hdr) & 0xFF00); }
#define SET_FRZ_MSG_ID( hdr, v ) { *((uint32_t *) hdr) = ((uint32_t) (v) << 16) | (*((uint32_t *) hdr) & 0x00FF); }
#define SET_FRZ_FLAGS( hdr, v ) { *((uint32_t *) hdr + 1) = ((uint32_t) (v) & 0xFF) | (*((uint32_t *) hdr) & 0xFF00); }
#define SET_FRZ_OPTIONAL( hdr, v ) { *((uint32_t *) hdr + 1) = ((uint32_t) (v) << 16) | (*((uint32_t *) hdr) & 0x00FF); }

#define GET_FRZ_SEQ_ID( hdr ) (*((uint32_t *) hdr) & 0xFF)
#define GET_FRZ_MSG_ID( hdr ) (*((uint32_t *) hdr) << 16)
#define GET_FRZ_FLAGS( hdr )  (*((uint32_t *) hdr + 1) & 0xFF)
#define GET_FRZ_OPTIONAL( hdr ) (*((uint32_t *) hdr + 1) << 16)
*/
	// hdr is a nodejs Buffer
	GET_FRZ_SEQ_ID: function( hdr ) {  return hdr.readUInt16LE(this.SEQ_ID_OFFSET); },
	GET_FRZ_MSG_ID: function( hdr  ) {  return hdr.readUInt16LE(this.MESSAGE_ID_OFFSET); },
	GET_FRZ_FLAGS: function( hdr  ) {  return hdr.readUInt16LE(this.FRZ_FLAGS_OFFSET); },
	GET_FRZ_OPTIONAL: function( hdr  ) {  return hdr.readUInt16LE(this.FRZ_OPTIONAL_OFFSET); },

	SET_FRZ_SEQ_ID: function( hdr, v  ) {  return hdr.writeUInt16LE(v,this.SEQ_ID_OFFSET); },
	SET_FRZ_MSG_ID: function( hdr, v  ) {  return hdr.writeUInt16LE(v,this.MESSAGE_ID_OFFSET); },
	SET_FRZ_FLAGS: function( hdr, v  ) {  return hdr.writeUInt16LE(v,this.FRZ_FLAGS_OFFSET); },
	SET_FRZ_OPTIONAL: function( hdr, v  ) {  return hdr.writeUInt16LE(v,this.FRZ_OPTIONAL_OFFSET); }

};


frz_proto.MAX_FRZ_PAYLOAD = frz_proto.MAX_6LOWPAN_UDP_PAYLOAD - frz_proto.FRZ_HEADER_SIZE;
frz_proto.MIN_AES_PAYLOAD = 16;


exports = module.exports = frz_proto;
