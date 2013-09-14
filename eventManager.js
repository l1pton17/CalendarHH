function EventManager(opts) {
	var storageProvider = opts.storageProvider;
	var updateInterval = opts.interval;
	var stackToSend = [];
	var self = this;
	var eventManagerInterface = new EventManagerInterface(opts.interfaceOptions, self);
	
	function getHash(date) {
		return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
	}
	
	function getDateFromHash(h) {
		var day = h % 100;
		var month = Math.floor( (h % 10000) / 100 );
		var year = Math.floor( (h % 100000000) / 10000 );
		
		return new Date(year, month, day);
	}
	
	function addEvent(event, date) {
		stackToSend.push( {date:date, key: getHash(date), data: JSON.stringify(event,"",0)} );
		eventManagerInterface.showEvent( {"date": date, "event": event} );
	}
	
	function removeEvent(date) {
		var hash = getHash(date);
		storageProvider.removeByKey(hash);
	}
	
	function sendToStorage() {
		storageProvider.addToStorage(stackToSend);
		stackToSend = [];
	}
	
	function onAddToStorage(date, event) {
		var d = new Date(date);
		eventManagerInterface.setEventCell(d);
	}
	
	function getEventByDate(date) {
		var res = null;
		var hash = getHash(date);
		
		for (var i=0; i<stackToSend.length; i++) {
			if (stackToSend[i].key == hash) {
				return JSON.parse( stackToSend[i].data );
			}
		}
		
		return JSON.parse(storageProvider.getDataByKey( hash ));
	}
	
	function getEventByYearMonth(year, month) {
		var res = [];
		var minHash = getHash( new Date(year, month, 1) );
		var maxHash = getHash( new Date(year, month+1, 0) );
		
		for (var i=0; i<stackToSend.length; i++) {
			if (stackToSend[i].key>=minHash && stackToSend[i].key<=maxHash) {
				res.push( {date: stackToSend[i].date, event: JSON.parse(stackToSend[i].data)} );
			}
		}
		
		storageProvider.filter(function(k) {
				return (k>=minHash && k<=maxHash)
			},
			function(k,d) {
				res.push( {date: getDateFromHash(k), event: JSON.parse(d)} );
			}
		);
		
		return res;
	}
	
	function getEventByFilter(filterFunc) {
		var res = [];
		
		for (var i=0; i<stackToSend.length; i++) {
			if (filterFunc( stackToSend[i].date, JSON.parse(stackToSend[i].data) )) {
				res.push( {date: stackToSend[i].date, event: JSON.parse(stackToSend[i].data)} );
			}
		}
		
		storageProvider.filter(function(k, e) {
				return filterFunc( getDateFromHash(k), JSON.parse(e) );
			},
			function(k, d) {
				res.push( {date: getDateFromHash(k), event: JSON.parse(d)} );
			}
		);
		
		return res;
	}
	
	storageProvider.onAddToStorage = onAddToStorage;
	setInterval( sendToStorage, updateInterval*1000 );
	this.getEventByYearMonth = getEventByYearMonth;
	this.removeEvent = removeEvent;
	this.getEventByDate = getEventByDate;
	this.getEventByFilter = getEventByFilter;
	this.addEvent = addEvent;
}