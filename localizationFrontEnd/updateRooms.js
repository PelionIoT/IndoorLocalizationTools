'use strict'

// mapping between bulb IP address and location name
const BULB_LOCATION_MAPPINGS = {
    'aaaa::2a5:900:a1:23a8': 'Bathroom',
    'aaaa::2a5:900:b1:5d50': 'Kitchen',
    'aaaa::2a5:900:f8:7029': 'Living Room',
    'aaaa::2a5:900:8f:29ef': 'Living Room',
    'aaaa::2a5:900:a4:25bc': 'Bathroom'
}

// mapping between presence tag IP address and person name
const PRESENCE_TAG_PERSON_MAPPINGS = {
    'aaaa::2a5:9ff:400:666': 'John',
    'aaaa::2a5:9ff:400:667': 'Jordan',
    'aaaa::2a5:9ff:400:668': 'Yash',
    'aaaa::2a5:9ff:400:669': 'Vidhi'
}

// maximum distance away to still be considered in a room
const NOT_NEAR_THRESHOLD = 20

function buildRoomMapping(distanceMatrix) {
    let roomMapings = { }
    
    for(let presenceTagIP in PRESENCE_TAG_PERSON_MAPPINGS) {
        let personName = PRESENCE_TAG_PERSON_MAPPINGS[presenceTagIP]
        let personRoom = null

        if(distanceMatrix.hasOwnProperty(presenceTagIP)) {
            let distances = [ ]
            
            for(let bulbIP in distanceMatrix[presenceTagIP]) {
                if(BULB_LOCATION_MAPPINGS.hasOwnProperty(bulbIP)) {
                    distances.push({ bulbIP: bulbIP, distance: distanceMatrix[presenceTagIP][bulbIP] })
                }
            }
            
            distances = distances.sort(function(a, b) {
                if(a.distance < b.distance) {
                    return -1
                }
                else if(a.distance > b.distance) {
                    return 1
                }
                else {
                    return 0
                }
            }).filter(function(a) {
                return a.distance < NOT_NEAR_THRESHOLD
            }).map(function(a) {
                return a.bulbIP
            })
            
            if(distances.length > 0) {
                personRoom = BULB_LOCATION_MAPPINGS[distances[0]]
            }
        }
        
        roomMapings[personName] = personRoom
    }
    
    return roomMapings
}

module.exports = {
    buildRoomMapping: buildRoomMapping
}
