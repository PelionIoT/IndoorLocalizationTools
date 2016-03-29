var localization = require('./localization');

localization.start().then(function() {
	var interval = setInterval(function() {
		console.log('PRESENCE: ', localization.getPresenceRSSIMap());
		console.log('--------------------------------------------');
	}, 2000);
	var interval = setInterval(function() {
		console.log('FILAMENT: ', localization.getFilamentRSSIMap());
		console.log('--------------------------------------------');
	}, 2000);
});

