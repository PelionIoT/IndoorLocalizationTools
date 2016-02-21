/*
 * frzprotocol.h
 *
 *  Created on: Sep 7, 2011
 *      Author: ed
 */

#ifndef FRZPROTOCOL_H_
#define FRZPROTOCOL_H_

#include <stdint.h>
#include <stddef.h>

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


#define FRZ_FLAG_ACK      0x0001
#define FRZ_FLAG_FIRST    0x0002
#define FRZ_FLAG_LAST     0x0004
#define FRZ_FLAG_LOST     0x1000
#define FRZ_FLAG_RESET    0x2000  // tells far-end to reset everything they know about previous states
#define FRZ_FLAG_FAIL     0x4000  // tells far-end to reset everything they know about previous states

#define FRZ_ERROR_TOO_BIG 0x0010  // transfer too big

// size in bytes of header
#define FRZ_HEADER_SIZE     8

// offsets are in bytes
#define MESSAGE_ID_OFFSET   0
#define SEQ_ID_OFFSET       2
#define FRZ_FLAGS_OFFSET    4
#define FRZ_OPTIONAL_OFFSET 6

//typedef uint16_t FRZ_UINT16;

// CATEGORIES

#define ASYNC_PUSH1 0x01
#define ASYNC_PUSH2 0xF0

// ASYNC_PUSH EVENTs


// ENABLEAdxl345=0;


#define PUSH_eventMotion 0x01
#define PUSH_eventAdxl345 0x02
#define PUSH_eventLED 0x03
#define PUSH_eventDHT11 0x04
#define PUSH_eventLM 0x05
#define PUSH_eventRelay 0x06
#define PUSH_eventPiezo 0x07
#define PUSH_eventPhonejack 0x08
#define PUSH_eventPhonejack2 0x09
#define PUSH_eventVBattery 0x0A
#define PUSH_eventIRT 0x0B
#define PUSH_eventIRR 0x0C
#define PUSH_eventReed 0x0D
#define PUSH_eventMic 0x0E
#define PUSH_eventButton 0x20

static uint8_t ENABLEMotion=0;
static uint8_t ENABLEAdxl345=0;
static uint8_t ENABLELED=0;
static uint8_t ENABLEDHT11=0;
static uint8_t ENABLELM=0;
static uint8_t ENABLERelay=0;
static uint8_t ENABLEPiezo=0;
static uint8_t ENABLEPhonejack=0;
static uint8_t ENABLEPhonejack2=0;
static uint8_t ENABLEVBattery=0;
static uint8_t ENABLEIRT=0;
static uint8_t ENABLEIRR=0;
static uint8_t ENABLEReed=0;
static uint8_t ENABLEMic=0;
static uint8_t ENABLEBtn=0;


#define WW_MOTION 					0x01
#define WW_ADXL345 					0x02
#define WW_LED 						0x03
#define WW_DHT11 					0x04
#define WW_LM 						0x05
#define WW_RLY 						0x06
#define WW_PIEZO 					0x07
#define WW_JACK1 					0x08
#define WW_JACK2 					0x09
#define WW_VBATTERY 				0x0A
#define WW_IRT 						0x0B
#define WW_IRR 						0x0C
#define WW_REED 					0x0D
#define WW_MIC 						0x0E
#define WW_OTA						0x0F
#define WW_PTAG						0x10
#define WW_BTN 						0x20


#define WW_GLOWLINE 				0x02
#define WW_STROBE 					0x03
#define WW_PROG 					0x04

//Array definitions
//#define LED_ONOFF			1  	//	0: enables		1: disables
#define LED_R				2	//	0: no color		1: color
#define LED_G				3	//	0: no color		1: color
#define LED_B				4	//	0: no color		1: color
#define	LED_SEC1			5	// 	time in seconds up to 255
#define LED_SEC2			6	//	time in seconds up to 255
#define LED_MODE			7	//	1: turn on the LED immediately
								//	2: turn on the LED immediately, then turn it off after TRI_SEC1

#define ONOFF          	0x01

#define MOT_SENS        0x02

#define ADXL_TAP		0x02
#define ADXL_DT			0x03
#define ADXL_FREEFALL	0x04
#define ADXL_INACT		0x05
#define ADXL_ACTIV		0x06

#define ADXL_TAPTHRES   0x08
#define ADXL_TAPDUR     0x09
#define ADXL_TAPLAT     0x0a
#define ADXL_TAPWINDOW  0x0b
#define ADXL_FFTHRES	0x0c
#define ADXL_FFTIM		0x0d
#define ADXL_RESET		0x0e

#define LM_LL           0x02
#define LM_LH			0x03
#define LM_HL			0x04
#define LM_HH			0x05

#define MIC_SENS        0x02
#define MIC_THRES       0x03



/**-------------------------------------------------------------------------
 * ADXL345 ACCELEROMETER SENSOR [WW_ADXL345_MS]
 * -------------------------------------------------------------------------
 * COMMAND MESSAGES (FROM SERVER-->TO device)
 *
 * STATUS_REQUEST {unimplemented}
 * 		Message array: [WW_ADXL345_MS,STATUS_REQUEST]
 *  	Variables: n/a
 *
 * SET sensitivity {unimplemented}
 * 		Message Array: [WW_PS206_MOTION_SENSOR,SET,SENSITIVITY,sensitivity_level]
 *  	Variables: (1_
 *  		sensitivity_level:  0x00 (most sensitive) to 0xff (least sensitive)
 *
 **RESPONSE MESSAGES (FROM device --> TO SERVER)
 *
 * STATUS_REPORT {implemented}
 * 		Message array: [WW_PS206_MOTION_SENSOR,STATUSREPORT,motion_status,sensitivity_level]
 * 		Variables: (2)
 * 			motion_status: [NO_MOTION|MOTION]
 * 			sensitivity_level: 0x00 (most sensitive) to 0xff (least sensitive)
 */

#define VIBRATION				0x00  //
#define X						0x01  //
#define y						0x02  //
#define TAP						0x03  //
#define DOUBLETAP				0x04  //
#define FREEFALL				0x05  //
#define ACTIVITY				0x06  //
#define INACTIVITY				0x07  //



// NOTE: this may cause memory alignment issues on ARM
#define FRZ_SEQ_ID( hdr ) (*((uint16_t *) ((char *)hdr+SEQ_ID_OFFSET)))
#define FRZ_MSG_ID( hdr ) (*((uint16_t *) ((char *)hdr+MESSAGE_ID_OFFSET)))
#define FRZ_FLAGS( hdr ) (*((uint16_t *) ((char *)hdr+FRZ_FLAGS_OFFSET)))
#define FRZ_OPTIONAL( hdr ) (*((uint16_t *) ((char *)hdr+FRZ_OPTIONAL_OFFSET)))
#define FRZ_PAYLOAD( hdr ) (((char *)hdr)+FRZ_HEADER_SIZE)

// Use these on ARM:
#define SET_FRZ_SEQ_ID( hdr, v ) { *((uint32_t *) hdr) = ((uint32_t) (v) & 0xFF) | (*((uint32_t *) hdr) & 0xFF00); }
#define SET_FRZ_MSG_ID( hdr, v ) { *((uint32_t *) hdr) = ((uint32_t) (v) << 16) | (*((uint32_t *) hdr) & 0x00FF); }
#define SET_FRZ_FLAGS( hdr, v ) { *((uint32_t *) hdr + 1) = ((uint32_t) (v) & 0xFF) | (*((uint32_t *) hdr) & 0xFF00); }
#define SET_FRZ_OPTIONAL( hdr, v ) { *((uint32_t *) hdr + 1) = ((uint32_t) (v) << 16) | (*((uint32_t *) hdr) & 0x00FF); }

#define GET_FRZ_SEQ_ID( hdr ) (*((uint32_t *) hdr) & 0xFF)
#define GET_FRZ_MSG_ID( hdr ) (*((uint32_t *) hdr) << 16)
#define GET_FRZ_FLAGS( hdr )  (*((uint32_t *) hdr + 1) & 0xFF)
#define GET_FRZ_OPTIONAL( hdr ) (*((uint32_t *) hdr + 1) << 16)

// PROTOCOL STATES
#define FRZ_IN_TRANSFER 2
#define FRZ_WAITING     0
#define FRZ_PROCESSING  4

//
#define FRZ_MAX_TRANSFER_LEN 120*7



typedef struct _WWMessage WWMessage;

struct  _WWMessage
{
  //ProtobufCMessage base;
  size_t n_c;
  uint8_t *c;
};

// BLASTER:

/**
 * Main blast function.  Pass this function the array
 *
 * Array format
 * All stored integers are expected to be uint16_t
 * Positions 0..10 are instructions (see example below)
 * Positions 11..n are on/off pulse times measured in uS/5.333 (thats microseconds div 5.33333)
 * Last position in the array is always an OFF, and represents the time to wait before repeating
 * Position 0 points to the last array position
 * pulsetrain[0]=30;		 	//Array length always at pos 0
  pulsetrain[1]=36000; 		//FREQ always at pos 1
  pulsetrain[2]=0x7FFF;		//duty always at pos 2
  pulsetrain[3]=3; 			//Repeat alaways at pos 3
  pulsetrain[4]=0b111111;	//Blast mask: 0b00xxxxxx
  pulsetrain[5]=0b010001;	//Led mask:
  pulsetrain[6]=0;			//Reserved
  pulsetrain[7]=0;			//Reserved
  pulsetrain[8]=0;			//Reserved
  pulsetrain[9]=0;			//Reserved
  pulsetrain[10]=0;			//Reserved
  pulsetrain[11]=167;		//First on duration
  pulsetrain[12]=167;		//First off duration
  pulsetrain[13]=333;		//Second ...
  pulsetrain[14]=167;
  pulsetrain[15]=167;
  pulsetrain[16]=167;
  pulsetrain[17]=167;
  pulsetrain[18]=333;
  pulsetrain[19]=333;
  pulsetrain[20]=333;
  pulsetrain[21]=167;
  pulsetrain[22]=167;
  pulsetrain[23]=167;
  pulsetrain[24]=167;
  pulsetrain[25]=333;
  pulsetrain[26]=333;
  pulsetrain[27]=333;
  pulsetrain[28]=333;
  pulsetrain[29]=167;
  pulsetrain[30]=0xffff;	//End with the duration between repeats (this must always be an off)
 */

// 11 elements needed at beginning of array
#define FRZ_BLAST_ARRAY_HEADER 11


#define FRZ_6LOWPAN_UDP_NO_SECURITY_MAXSIZE 33
#define FRZ_6LOWPAN_UDP_AES_MAXSIZE 54



#endif /* FRZPROTOCOL_H_ */
