function CalendarManager() {
	var calendarManagerElem = null;
	var calendarElem = null;
	var toolbarElem = null;
	var selected = false;
	var self = this;
	var year, month, day;
	var showYear, showMonth;
	
    function getDay(d) {
      	var day = d.getDay() - 1;
		
       	return day < 0 ? 6 : day;
    }
	
	function parseValue(value) {
		if (value instanceof Date) {
			year = value.getFullYear();
			month = value.getMonth();
			day = value.getDate();
		} else {
			year = value.year;
			month = value.month;
			day = value.day;
		}
	}
	
	function getTD(date) {
		if (!calendarElem)	return null;
		if (!date || !date.getMonth || !date.getFullYear) return null;
		if (date.getMonth() != month || date.getFullYear() != year) return null;
		var num = getCellByDate(date);
		var td = calendarElem.getElementsByTagName('td')[num];
		if (!td) return null;
		
		return td;
	}
	
	function markDate(date) {
		var td = getTD(date);
		if (!td) return;
		
		removeClass(td, "event-cell");
		addClass(td, "marked");
	}
	
	function setEventCell(date) {
		var td = getTD(date);
		if (!td) return;
		
		removeClass(td, "marked");
		addClass(td, "event-cell");
	}
	
	function showEvent(date, event) {
		var td = getTD(date);
		if (!td) return;
		
		if (event.title) getElementsByClass('event-title', td)[0].innerHTML = event.title;
		if (event.members) getElementsByClass('event-members', td)[0].innerHTML = event.members;
		if (event.description) getElementsByClass('event-description', td)[0].innerHTML = event.description;
	}
	
	function renderCalendarCell(cls, html) {
		return "<td><div class='" + cls + "'>" + html + "</div></td";
	}
	
	function clearCell(date) {
		var td = getTD(date);
		if (!td) return;
		
		removeClass(td, "marked");
		removeClass(td, "event-cell");		
		
		getElementsByClass('event-title', td)[0].innerHTML = "";
		getElementsByClass('event-members', td)[0].innerHTML = "";
		getElementsByClass('event-description', td)[0].innerHTML = "";
	}
	
	function renderCalendarTable(year, month) {
		var table = ['<table class="calendar-table"><tr>'];
		var d = new Date(year, month);
		var dayOfWeeks = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
		var prevMonthLength = (new Date(year, month, 0)).getDate();
		var isCaption = true;
		var currentDate = new Date();
		
		for (var i=0; i<getDay(d); i++) {
			table.push('<td class="caption-cell prev-month">');
			table.push('<div class="date-holder">');
			table.push( dayOfWeeks[i] + ", " + (prevMonthLength - getDay(d) + i + 1) );
			table.push('</div></td>');
		}
		
		while (d.getMonth() == month) {
			table.push('<td class="date-cell ' + (equalsOnlyDate(d, currentDate)?'current-date':'') + '"><div class="date-holder">');
			if (isCaption) {
				table.push( dayOfWeeks[ getDay(d) ] + ", " + d.getDate() );
			} else {
				table.push( d.getDate() );
			}
			table.push('</div>');
			table.push('<div class="event-content">');
			table.push('<div class="event-title"></div>');
			table.push('<div class="event-members"></div>');
			table.push('<div class="event-description-wrap">');
			table.push('<div class="event-description"></div>');
			table.push('</div>');
			table.push('</div>');
			table.push('</td>');
			if (getDay(d) % 7 == 6) {
				isCaption = false;
				table.push('</tr><tr>');
			}
			
			d.setDate( d.getDate()+1 );
		}
		
		while (getDay(d) % 7 != 0) {
			table.push('<td class="caption-cell next-month">');
			table.push('<div class="date-holder">' + d.getDate() + '</div>');
			table.push('</td>');
			d.setDate( d.getDate()+1 );
		}
		table.push('</tr></table>');
		showYear = year;
		showMonth = month;
		
		return table.join('\n');
	}
	
	function removeSelected(exceptElem) {
		var elems = getElementsByClass('selected', calendarElem);
		
		for (var i=0; i<elems.length; i++) {
			if (elems[i] == exceptElem) continue;
			removeClass( elems[i], "selected" );
			CalloutManager.closeCallout();
		}
	}
	
	function getDateByCell(cell) {
		var date =  (+month+1) + "."  + cell.getElementsByClassName('date-holder')[0].innerHTML.replace('\n', '') + "."+ year;
		var dateE = new Date(date);
		return dateE;
	}
	
	function onTableClick(e) {
		e = fixEvent(e);
		var target = e.target;
		
		while (target && target != this) {
			if (hasClass(target, "prev-month")) {
				self.setValue(new Date(year, month-1));
				CalloutManager.closeCallout();
				break;
			}
			if (hasClass(target, "next-month")) {
				self.setValue(new Date(year, month+1));
				CalloutManager.closeCallout();
				break;
			}
			if (hasClass(target, "today")) {
				self.setValue(new Date());
				CalloutManager.closeCallout();
				break;
			}
			if (hasClass(target, "date-cell")) {
				removeSelected(target);
				toggleClass(target, "selected",
					function() {
						self.trigger('select',   {"target":target, date: getDateByCell(target)}); 
					},
					function() {
						self.trigger('deselect', {"target":target, date: getDateByCell(target)});
					}
				);
				break;
			}
			
			target = target.parentNode;
		}
	}
	
	function renderCalendarElem() {
		calendarElem.innerHTML = renderCalendarTable(year, month);
		self.trigger('render',   {"target":calendarElem, "date": {year:year, month:month}});
	}
	
	function renderToolbarElem(year, month) {
		var toolbar = [];
		toolbar.push('<button class="date-picker-button prev-month">◀</button>');
		toolbar.push('<span class="date-picker-month">' + getNameByMonth(month) + ' ' + year + '</span>');
		toolbar.push('<button class="date-picker-button next-month">▶</button>');
		toolbar.push('<button class="date-picker-button today">Сегодня</button>');
		
		toolbarElem.innerHTML =  toolbar.join('\n');
	}

	function render() {
		if (showYear != year || showMonth != month) {
			renderCalendarElem();
			renderToolbarElem(year, month);
		}
	}
	
	function createCalendarElem() {
		calendarElem = document.createElement('div');
		renderCalendarElem();
		var interval = null;
		
		calendarElem.onmouseover = function(e) {
			e = fixEvent(e);
			var target = e.target;
			
			while (target != null) {
				if (target.tagName == "TD") {
					break;
				}
				target = target.parentNode;
			}
			if (!target) return;
			
			var toTarget = e.relatedTarget;
			
			while (toTarget && toTarget != target) {
				toTarget = toTarget.parentNode;
			}
			if (toTarget == target) return;
			
			var description = target.getElementsByClassName('event-description')[0];
			if (!description) return;
			var heightDesc = description.clientHeight;
			var heightWrap = target.getElementsByClassName('event-description-wrap')[0].clientHeight;
		
			function doAnimate() {
				interval = animateProp({
					elem: description,
					prop: 'top',
					start: +parseInt( getStyle(description, "top") ),
					end: +parseInt( getStyle(description, "top") ) == 0 ? -(heightDesc-heightWrap) : 0,
					duration: 5000,
					complete: doAnimate
				});
			};
			
			doAnimate();
		};
		calendarElem.onmouseout = function(e) {
			e = fixEvent(e);
			
			var target = e.target;
			while (target != null) {
				if (target.tagName == "TD") {
					break;
				}
				target = target.parentNode;
			}
			if (!target) return;
			
			var toTarget = e.relatedTarget;
			while (toTarget && toTarget != target) {
				toTarget = toTarget.parentNode;
			}
			if (toTarget == target) return;
			
			if (interval) {
				clearInterval(interval);
			}
			var description = target.getElementsByClassName('event-description')[0];
			if (!description) return;
			description.style.top = "0px";
		}
	}
	
	function createToolbarElem() {
		toolbarElem = document.createElement('div');
		toolbarElem.className = "date-picker";
		renderToolbarElem(year, month);
	}
	
	function getCellByDate(date) {
		var dateDayOne = new Date(date.getFullYear(), date.getMonth(), 1);

		return getDay(dateDayOne) + date.getDate() - 1;
	}
  
	function getElement() {
		if (!calendarManagerElem) {
			calendarManagerElem = document.createElement('div');
			calendarManagerElem.className = "calendar-widget main-width";
			calendarManagerElem.onclick = onTableClick;
			
			if (!calendarElem) {
				createCalendarElem();
			}
			if (!toolbarElem) {
				createToolbarElem();
			}
			
			calendarManagerElem.appendChild( toolbarElem );
			calendarManagerElem.appendChild( calendarElem );
		}
		
		return calendarManagerElem;
	}
	
	this.on = function(eventName, handler) {
		if (!this._eventHandlers) this._eventHandlers = [];
		if (!this._eventHandlers[eventName]) {
			this._eventHandlers[eventName] = [];
		}
		this._eventHandlers[eventName].push(handler);
	}
	this.off = function(eventName, handler) {
		var handlers = this._eventHandlers[eventName];
		if (!handlers) return;
		for(var i=0; i<handlers.length; i++) {
			if (handlers[i] == handler) {
				handlers.splice(i--, 1);
			}
		}
	}
	this.trigger = function(eventName) {
		if (!this._eventHandlers[eventName]) {
			return; // обработчиков для события нет
		}

		// вызвать обработчики 
		var handlers = this._eventHandlers[eventName];
		for (var i = 0; i < handlers.length; i++) {
			handlers[i].apply(this, [].slice.call(arguments, 1));
		}
	}
	this.clearCell = clearCell;
	this.setEventCell = setEventCell;
	this.showEvent = showEvent;
	this.markDate = markDate;
	this.getDate = function() {
		return {
			year: year,
			month: month,
			day: day
		};
	};
	this.setValue = function(value) {
		parseValue(value);
		if (calendarManagerElem) {
			render();
		}
	}
	this.getElement = getElement;	
}