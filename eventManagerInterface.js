function EventManagerInterface(opts, eventManager) {
	var refreshEventButton = opts.refreshEvent;
	var createEventButton = opts.createEvent;
	var createEventWrap = null;
	var editEventWrap = null;
	var createEventInput = null;
	var calendar = opts.calendar;
	var self = this;
	
	function parseDate(text) {
		var textArray = text.split(' ');
		var res = new Date(calendar.getDate().year, calendar.getDate().month);
		var parsedElem = 0;
		
		for (var i=0; i<textArray.length; i++) {
			var mn = getMonthByName(textArray[i]);
			if (mn != -1) {
				res.setMonth(mn);
				parsedElem++;
			}
			
			if (isNumeric(textArray[i])) {
				if (textArray[i] >= 1 && textArray[i] <= 31) {
					res.setDate(textArray[i]);
					parsedElem++;
				}
				if (textArray[i] >= 1970) {
					res.setFullYear(textArray[i]);
					parsedElem++;
				}
			}
		}
		
		return {isParsed: (parsedElem>=2), date: res};
	}
	
	function replaceMonthOnEnglish(text) {
		var splitText = text.toLowerCase().split(' ');
		var arr = ['январ', 'феврал', 'март', 'апрел', 'ма', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'];
		var eng = ['jun', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
	
		for (var i=0; i<splitText.length; i++)
			for (var j=0; j<arr.length; j++) {
				if (!splitText[i].indexOf(arr[j])) {
					splitText[i] = eng[j];
				}
			}
	
		return splitText.join(' ');
	}
	
	function parseInput(text) {
		var textArray = text.split(',');
		var res = {};
		res.event = {};
		res.event.members = "";
		res.event.description = "";
		
		if (textArray.length >= 1) {
			var parse = parseDate(textArray[0]);
			if (parse.isParsed) {
				res.date = parse.date;
			} else {
				res.date = null;
			}
			
			res.event.title = textArray.slice(1).join(',').ltrim();
		} else {
			res.date = new Date(replaceMonthOnEnglish(textArray[0]));
			res.event.title = "Событие";
		}
		
		return res;
	}
	
	function onCreateEventButtonClick() {
		var parsed = parseInput(createEventInput.value);
		if (parsed.date != null) {
			eventManager.addEvent(parsed.event, parsed.date);
		}
		CalloutManager.closeCallout();
	}
	
	function markDate(d) {
		calendar.markDate(d);
	}
	
	function showEvent(e) {
		calendar.markDate(e.date);
		calendar.showEvent(e.date, e.event);		
	}
	
	function setEventCell(d) {
		calendar.setEventCell(d);
	}
	
	function renderCreateEventButton() {
		if (createEventWrap) {
			removeAllChilds( createEventWrap );
		}
		createEventWrap = document.createElement('div');
		createEventWrap.style.position = "relative";
		
		if (!createEventInput) {
			createEventInput = document.createElement('input');
			createEventInput.type = "text";
			createEventInput.style.width = "250px";
			createEventWrap.appendChild( createEventInput );
			CreatePlaceholder({elem:createEventInput, value: '5 марта, День рождения'});
		}
			
		var createButton = document.createElement('button');
		createButton.innerHTML = "Создать";
		createButton.onclick = onCreateEventButtonClick;
		createEventWrap.appendChild( createButton );
	}
	
	function createTextEditWrap(elem, opts) {
		elem.onclick = function(e) {
			e = fixEvent(e);
			
			/*while (e.target && e.target != elem) {
				e.target = e.target.parentNode;
			}*/
			
			var input = document.createElement('input');
			input.name = opts.name;
			input.type = "text";
			input.style.width = "250px";
			elem.parentNode.replaceChild(input, elem);
			CreatePlaceholder({elem:input, value: opts.defaultValue});
			input.setValue(opts.value);
			input.focus();
		}
	}
	
	function renderEditEvent(date, eventData) {
		var eventData = eventData || {};
		var eventTitle = eventData.title || "";
		var eventMembers = eventData.members || "";
		var eventDescription = eventData.description || "";
		
		if (editEventWrap) {
			removeAllChilds( editEventWrap );
		}
		editEventWrap = document.createElement('div');
		editEventWrap.style.position = "relative";
		editEventWrap.style.height = "360px";
		
		var editEventForm = document.createElement('form');
		var eventTypeInput = null;
		var elem = null;
		
		if (eventTitle) {
			elem = document.createElement('div');
			elem.innerHTML = eventTitle;
			elem.className = "callout-event-title";
			editEventForm.appendChild(elem);
			createTextEditWrap(elem, {name: "title", defaultValue: "Событие", value: elem.innerHTML});
		} else {
			elem = document.createElement('input');
			elem.name = "title";
			elem.type = "text";
			elem.style.width = "250px";
			editEventForm.appendChild(elem);
			CreatePlaceholder({elem:elem, value: 'Событие'});
			/*elem = document.createElement('input');
			elem.name = "date";
			elem.type = "text";
			elem.style.width = "250px";
			editEventForm.appendChild(elem);
			CreatePlaceholder({elem:elem, value: 'День, месяц, год'});*/
		}
		
			
		elem = document.createElement('div');
		elem.innerHTML = date.getDate() + " " + getNameByMonth( date.getMonth() );
		elem.className = "callout-event-date";
		editEventForm.appendChild(elem);
		createTextEditWrap(elem, {name: "date", defaultValue: "День, месяц, год", value: elem.innerHTML});
		
		
		var membersPlaceholder = document.createElement('div');
		
		if (eventMembers) {
			elem = document.createElement('div');
			elem.className = "callout-event-members-caption";
			elem.innerHTML = "Участники:";
			membersPlaceholder.appendChild(elem);
			elem = document.createElement('div');
			elem.innerHTML = eventMembers;
			elem.className = "callout-event-members";
			membersPlaceholder.appendChild(elem);
			createTextEditWrap(membersPlaceholder, {name: "members", defaultValue: "Имена участников", value: elem.innerHTML});
		} else {
			elem = document.createElement('input');
			elem.name = "members";
			elem.type = "text";
			elem.style.width = "250px";
			membersPlaceholder.appendChild(elem);
			CreatePlaceholder({elem:elem, value: 'Имена участников'});
		}
		editEventForm.appendChild( membersPlaceholder );
		
		elem = document.createElement('textarea');
		elem.name = "description";
		elem.style.height = "130px";
		elem.style.width = "276px";
		editEventForm.appendChild(elem);
		var ph = CreatePlaceholder({elem:elem, value: 'Описание', withoutDelete:true});
		if (eventDescription) {
			elem.setValue(eventDescription);
		}
		addClass(ph, "callout-event-description");		
		
		var buttonPlaceholder = document.createElement('div');
		buttonPlaceholder.className = "callout-event-button-placeholder";
		var createButton = document.createElement('button');
		createButton.type = "submit";
		createButton.innerHTML = "Готово";
		buttonPlaceholder.appendChild( createButton );
		
		var deleteButton = document.createElement('button');
		deleteButton.type = "button";
		deleteButton.innerHTML = "Удалить";
		deleteButton.name = "remove";
		buttonPlaceholder.appendChild( deleteButton );
		
		editEventForm.appendChild( buttonPlaceholder );		
		editEventWrap.appendChild(editEventForm);
		
		var lastElem = editEventForm.elements[editEventForm.elements.length-1];
		var firstElem = editEventForm.elements[0];
		
		lastElem.onkeydown = function(e) {
			if (e.keyCode == 9 && !e.shiftKey) {
				firstElem.focus();
				return false;
			}
		};
  
		firstElem.onkeydown = function(e) {
			if (e.keyCode == 9 && e.shiftKey) {
				lastElem.focus();
				return false;
			}
		};
		
		deleteButton.onclick = function() {
			eventManager.removeEvent(date);
			calendar.clearCell(date);
			CalloutManager.closeCallout();
		};
		
		editEventForm.onsubmit = function(e) {
			e = fixEvent(e);
			var event = {};
			var eventDate = null;
			event.title = eventTitle;
			event.members = eventMembers;
			event.description = eventDescription;
			
			if (e.target.elements.title) {
				event.title = e.target.elements.title.value;
			}
			
			if (!event.title) {
				alert( "Введите заголовок" );
				return false;
			}
			
			if (e.target.elements.date) {
				var parsed = parseDate(e.target.elements.date.value);
				if (parsed.isParsed) {
					eventDate = parsed.date;
				} else {
					eventDate = date;
				}
			} else {
				eventDate = date;
			}
			
			if (e.target.elements.members) {
				event.members = e.target.elements.members.value;
			}
			
			if (e.target.elements.description) {
				event.description = e.target.elements.description.value;
			}
			
			eventManager.addEvent( event, eventDate );
			CalloutManager.closeCallout();
			return false;
		};
		
		return editEventWrap;
	}
	
	function getCreateEventButton() {
		if (!createEventWrap) {
			renderCreateEventButton();
		}
		createEventInput.setValue("");
		return createEventWrap;
	}
	
	function onCalendarItemSelect(e) {
		var event = eventManager.getEventByDate(e.date);
		CalloutManager.showCallout({
			width:340,
			height: 400,
			launchPoint: e.target,
			beakOrientation: "leftRight",
			closeCallBack: function() {
				removeClass(e.target, "selected");
			},
			content: renderEditEvent(e.date, event)
		});
	}
	
	function onShowCreateEventButtonClick(e) {
		e = fixEvent(e);
	
		toggleClass(e.target, "event-control-button-pressed",
			function() {
				CalloutManager.showCallout({
					width: 350,
					height: 120,
					launchPoint: e.target,
					beakOrientation: "topBottom",
					isFixed: true,
					closeCallBack: function() {
						removeClass(e.target, "event-control-button-pressed");
					},
					content: getCreateEventButton()
				});
				createEventInput.focus();
			},
			function() {
				removeClass(e.target, "event-control-button-pressed");
				CalloutManager.closeCallout();
			}
		);
	}
	
	function onRefreshEventClick() {
		onCalendarRender({date: calendar.getDate()});
	}
	
	function onCalendarRender(e) {
		var events = eventManager.getEventByYearMonth( e.date.year, e.date.month );
		
		for (var i=0; i<events.length; i++) {
			calendar.showEvent( events[i].date, events[i].event );
			calendar.setEventCell( events[i].date );
		}
	}
	
	calendar.on('render', onCalendarRender);
	calendar.on('deselect', function(e) {
		removeClass(e.target, "event-control-button-pressed");
		CalloutManager.closeCallout(e.target);
	});
	calendar.on('select', onCalendarItemSelect);
	this.setEventCell = setEventCell;
	this.showEvent = showEvent;
	this.markDate = markDate;
	createEventButton.onclick = onShowCreateEventButtonClick;
	refreshEventButton.onclick = onRefreshEventClick;
}