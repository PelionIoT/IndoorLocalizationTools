var dgram = require('dgram');
var EventEmitter = require('events').EventEmitter;

var UDPMultiplexer = exports.UDPMultiplexer = function(sourceAddress, sourcePort, firstID) {
    this.sourceAddress = sourceAddress;
    this.sourcePort = sourcePort;
    firstID = parseInt(firstID);

    if(!isNaN(firstID)) {
        this._nextID = firstID;
    }
    else {
        this._nextID = 0;
    }
};

UDPMultiplexer.prototype = Object.create(EventEmitter.prototype);

UDPMultiplexer.prototype.nextID = function() {
    this.emit('nextID', this._nextID+1);
    return this._nextID++;
};

UDPMultiplexer.prototype.start = function() {
    var self = this;
    var socket = this.socket = dgram.createSocket('udp6');


    return new Promise(function(resolve, reject) {
        socket.on('listening', function() {
        	console.log('UDP Started listening');
            resolve();
        }).on('error', function(error) {
            self.stop();
            reject(error);
        }).on('message', function(message, rInfo) {
            self.emit('message', message, rInfo);
        }).on('close', function() {
            self.socket = null;
            self.stop();
        });

        setTimeout(function () {
            socket.bind(self.sourcePort, self.sourceAddress);
        }, 5000);

    });
};

UDPMultiplexer.prototype.stop = function() {
    if(this.socket) {
        this.socket.close();
    }
};

UDPMultiplexer.prototype.send = function(address, buffer, port) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.socket.send(buffer, 0, buffer.length, port, address, function(error) {
            if(error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

