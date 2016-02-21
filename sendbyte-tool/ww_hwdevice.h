/*
 * frzhwdevice.h
 *
 *  Created on: Dec 13, 2012
 *      Author: travis
 */

#ifndef __FRZHWDEVICE_H__
#define __FRZHWDEVICE_H__

#include <stdint.h>

/** Hardware component definitions
 *
 * These hex values will be used when communicating to and from the server
 * Each device/manufacture will have its own hex value, because a sensor or device from one
 * manufacture may require different commands from the server, or may provide differnt output
 * therefore, rather than using a generic device type such as "motion" we differntate based on
 * the model of the motion sensor
 */
/*#define WW_TRICOLOR_LED   			0x01
#define WW_PIEZO_SPEAKER  			0x02
#define WW_DHT11			 	  	0x03  //
#define WW_PS206_MS					0x04 //MOTION SENSOR
#define WW_SB_BTN					0x05 //BUTTON ON TOP
#define WW_ADXL345					0x06 //ADXL
#define WW_RELAY					0x07 //relay
#define WW_LIGHT_METER				0x08 //lightmeter
#define WW_IRT					    0x09 //IR Transmitter
#define WW_MIC					    0x0A //MIC
#define WW_IRR					    0x0B //IR Reciever
*/

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
#define WW_BTN 						0x20



#define MOTION_LEN					0x1D //
#define LED_LEN						0x1D //
#define Button_LEN					0x10 //
#define ACCEL_LEN					0x24 //
#define DHT11_LEN					0x1D //
#define PIEZO_LEN					0x1D //
#define RELAY_LEN					0x1D //
#define LM_LEN						0x1D //
#define MIC_LEN						0x1D //
#define IRR_LEN						0x1D //
#define IRT_LEN						0x1D //




#define SENSOR_OFF			0x00
#define SENSOR_ON			0x01
#define SENSOR_POST			0x02

/** Hardware component messaging section
 *
 * This section deals specifically with the messages that each hardware component responds to
 * as well as transmits.  The format for the section is as follows
 *
 */


/** ALL HARDWARE
 *
 * The following defines can be used to communicate with all WigWag hardware
 *
 */
#define STATUS_REQUEST			0x01
#define STATUS_REPORT			0x02
#define SET						0x03



/**---------------------------------------------------------------------
 *  SENSORBLOCK BUTTON  [WW_SB_BTN]
 * ---------------------------------------------------------------------
 * COMMAND MESSAGES (FROM SERVER-->TO device)
 *
 * STATUS_REQUEST {unimplemented}
 * 		Message array: [WW_SB_BTN,STATUS_REQUEST]
 *  	Variables: n/a

 *
 **RESPONSE MESSAGES FROM device --> TO SERVER
 *
 * STATUS_REPORT {implemented}
 * 		Message array: [WW_SB_BTN,STATUSREPORT,button_status]
 * 		Variables: (1)
 * 			button_status: [BTN_UP|BTN_DOWN|BTN_PRESSED]
 */
#define BTN_UP					0x00 //currently cannot do this
#define BTN_DOWN				0x01 // or this
#define BTN_PRESSED				0x02

/**---------------------------------------------------------------------
 *  SENSORBLOCK BUTTON  [WW_Temp_Humid]
 * ---------------------------------------------------------------------
 * COMMAND MESSAGES (FROM SERVER-->TO device)
 *
 * STATUS_REQUEST {unimplemented}
 * 		Message array: [WW_Temp_Humid,STATUS_REQUEST]
 *  	Variables: n/a

 *
 **RESPONSE MESSAGES FROM device --> TO SERVER
 *
 * STATUS_REPORT {implemented}
 * 		Message array: [WW_Temp_Humid,STATUSREPORT,button_status]
 * 		Variables: (1)
 * 			button_status: [BTN_UP|BTN_DOWN|BTN_PRESSED]
 */
#define TH_OUT					0x00 //currently cannot do this


/**-------------------------------------------------------------------------
 * PS206 MOTION SENSOR [WW_PS206_MS]
 * -------------------------------------------------------------------------
 * COMMAND MESSAGES (FROM SERVER-->TO device)
 *
 * STATUS_REQUEST {unimplemented}
 * 		Message array: [WW_PS206_MS,STATUS_REQUEST]
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

#define NO_MOTION				0x00  //the sensor has no motion
#define MOTION					0x01  //the sensor reports motion
#define SENSITIVITY				0x02

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


#define WW_TRICOLOR_CHANGELED   TricolorTask
#define FRZ_FLAG_LASTT     	0x0005


/**-------------------------------------------------------------------------
 * TRICOLOR LED [WW_TRICOLOR_LED]
 * -------------------------------------------------------------------------
 * COMMAND MESSAGES (FROM SERVER-->TO device)
 *
 *
 */

/*
//Array definitions
#define TRI_ONOFF			1  	//	0: enables		1: disables
#define TRI_RED				2	//	0: no color		1: color
#define TRI_GREEN			3	//	0: no color		1: color
#define TRI_BLUE			4	//	0: no color		1: color
#define	TRI_SEC1			5	// 	time in seconds up to 255
#define TRI_SEC2			6	//	time in seconds up to 255
#define TRI_MODE			7	//	1: turn on the LED immediately
								//	2: turn on the LED immediately, then turn it off after TRI_SEC1


#define MOT_ONOFF          1
#define MOT_SENS           2


#define DHT_ONOFF 		   1

#define ADXL_ONOFF		0x01
#define ADXL_TAP		0x06
#define ADXL_DT			0x07
#define ADXL_TAPAXES	0x08
#define ADXL_TAPTHRES	0x09
#define ADXL_TAPDUR		0x0A
#define ADXL_TAPLAT		0x0B
#define ADXL_FREEFALL	0x0D
#define ADXL_INACT		0x10
#define ADXL_ACTIV		0x13
#define ADXL_SENS		0x14


#define LM_ONOFF		0x01

#define RLY_ONOFF		0x01
*/

#define PRINTRAY(size,data) printf("["); \
	uint8_t *p=data; \
	while((p-data)<size){ \
printf("0x%02x ", *p); \
	p++; \
	}  \
	printf("]\n");






#endif
