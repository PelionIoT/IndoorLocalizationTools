var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sixlbrRoutes = require('./getSixlbrRoutes');
var request = require('request');
var flatten = require('flat');

var routes = { };
var routesNodeID = {};
var wigwagnodes = {};
var nwStats = {};
var prev_nwStats  = {};
var baseline = {};

setInterval(function() {
	sixlbrRoutes.getRoutes().then(function(a) {

		var temp = a.SixlbrMonitor1.response.result;
		if(Object.keys(routes).length != Object.keys(temp).length) {
			ddb.get('wigwagdevice:node').then(function(nodes) {
				sixlbrRoutes.updateWigwagNodes(nodes);

				// console.log('NODES: ', wigwagnodes);
			});
			routes = {};
			routesNodeID = {};
			console.log("salkdjfalksjdflkajsdlkfjalksdjflkajds");
		}

		if(wigwagnodes != {}) {
			routes = temp;
			console.log('****************************************************');
			Object.keys(routes).forEach(function(node) {
			// console.log('node: ', node);
			// console.log('wigwagnodes: ', wigwagnodes);
				sixlbrRoutes.getNodeIdFromIP(node.substring(6)).then(function(childId) {
				// console.log('node: ', childId + ' rank: ', routes[node].rank);
					routesNodeID[childId] = { 'parentId': '', 'ipaddr': '', 'data': ''};
					sixlbrRoutes.getNodeIdFromIP(routes[node]['nexthop'].substring(6)).then(function(parentId) {
						routesNodeID[childId].parentId = parentId;
						routesNodeID[childId].ipaddr = node;
						routesNodeID[childId].data = routes[node];

						// console.log(routesNodeID); 
					});
				});
			});
		}
	});
}, 1000);

var it = 0;
setInterval(function() {
	// routes = { };
	// routesNodeID = {};
	it++;
	sixlbrRoutes.getNetworkStats().then(function(stats) {
		if(Object.keys(baseline).length == 0) {
			baseline = stats.SixlbrMonitor1.response.result;
			console.log('baseline: ', baseline)
			console.log('nwStats: ', nwStats);
		} else  {
			Object.keys(stats.SixlbrMonitor1.response.result).forEach(function(key) {
				if(typeof nwStats[key] == 'undefined') {
					nwStats[key] = 0;
					prev_nwStats[key] = 0;
				}
				nwStats[key] = ( (stats.SixlbrMonitor1.response.result[key] - baseline[key]) - prev_nwStats[key]) ;
				prev_nwStats[key] = (stats.SixlbrMonitor1.response.result[key] - baseline[key]);
			})
		}
	});
}, 1000);

var app = express();

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));


app.get('/routes', function(req, res) {
	// console.log('routes: ', routesNodeID);
	res.status(200).send(routesNodeID);
})

app.get('/sixlbrConfig', function(req, res) {
	var opts;
	sixlbrRoutes.getSixlbrConfig().then(function(a) {
		opts = a.SixlbrMonitor1.response.result;
		console.log(opts);
		res.status(200).send(opts);
	})
})

app.get('/networkStats', function(req, res) {
	res.status(200).send(nwStats);
})

app.post('/updateSixlbrConfig', function(req, res) {
	console.log('got updated values: ', req.body);
	sixlbrRoutes.setSixlbrConfig(req.body).then(function() {
		console.log('setSixlbrConfig successful');
		res.status(200).send();
	});
})

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

sixlbrRoutes.start().then(function() {
	app.listen(6060);
})

module.exports = app;
