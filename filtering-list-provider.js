function FilteringListProvider(eventManager) {
  this.filterByStart = function(stringStart) {
	if (stringStart.length < 1) return [];
    var stringStartLC = stringStart.toLowerCase();
	
    return eventManager.getEventByFilter(function(d, e) {
		var result = false;
		if (!e) return false;
		
		if (e.title && (e.title.toLowerCase().indexOf( stringStartLC ) != -1) ) result = true;
		if (d && d.getDate() == stringStartLC ) result = true;
		if (d && (getGiventNameByMonth(d.getMonth()).toLowerCase().indexOf(stringStartLC) != -1) ) result = true;
		
		return result;
    });
  };
}