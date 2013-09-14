function LocalStorageProvider() {
	var self = this;
	
	function addToStorage(dataArray) {
		for (var i=0; i<dataArray.length; i++) {
			localStorage.setItem(dataArray[i].key, dataArray[i].data);
			if (self.onAddToStorage) {
				self.onAddToStorage(dataArray[i].date, dataArray[i].data);
			}
		}
	}
	
	function addEventChangeHandler(handler) {
		function handlerWrap(e) {
			e = fixEvent(e);
			
			handler({
				key: e.key,
				isRemove: (newValue==null),
				value: newValue
			});
		}
		
		if (window.addEventListener) {
			window.addEventListener("storage", handlerWrap, false);
		} else {
			window.attachEvent("onstorage", handlerWrap);
		}
	}
	
	function filter(filterFunc, processFunc) {
		for (var key in localStorage) {
			if (filterFunc(key, localStorage[key])) {
				processFunc(key, localStorage[key]);
			}
		}
	}
	
	function getDataByKey(key) {
		return localStorage.getItem(key);
	}
	
	function removeByKey(key) {
		localStorage.removeItem(key);
	}
	
	this.filter = filter;
	this.getDataByKey = getDataByKey;
	this.removeByKey = removeByKey;
	this.onAddToStorage = null;
	this.addToStorage = addToStorage;
}