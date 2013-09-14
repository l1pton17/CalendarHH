function AutocompleteList(provider) {
  var elem;

  var filteredResults;
  var currentIndex = 0;
  var wrap;
  var scroll;
  var scrolled = 0;
  var scrollHeight = 0;

  this.render = function() {
	wrap = document.createElement('div');
	wrap.className = "autocomplete";
    elem = document.createElement('ol');
	wrap.appendChild(elem);
	
    return wrap;
  };
  
  function buildList() {
	var res = [];
	
	for (var i=0; i<filteredResults.length; i++) {
		res.push('<li>');
		res.push('<div class="autocomplete-result">');
		res.push('<div class="autocomplete-result-title">');
		res.push( filteredResults[i].event.title );
		res.push('</div>');
		res.push('<div class="autocomplete-result-date">');
		res.push( filteredResults[i].date.getDate() + " " + getGiventNameByMonth( filteredResults[i].date.getMonth() ) );
		res.push('</div>');
		res.push('</div>');
		res.push('</li>');
		res.push('<div class="autocomplete-divider"></div>');
	}
	
	return res.join('\n');
  }
  
  function createScroll() {
	if (hasClass(wrap, "scrollable")) return;
	
	addClass(wrap, "scrollable");
	scroll = document.createElement('div');
	scroll.className = "autocomplete-scroll";
	scroll.innerHTML = " ";
	scroll.onmousedown = function(e) {
		e = fixEvent(e);
		
		var shiftY = e.clientY;
		
		document.onmousemove = function(event) {
			event = fixEvent(event);
			scrollBy( shiftY - event.clientY );
		};
		document.onmouseup = function() {
			document.onmousemove = null;
		};
	};
	wrap.appendChild(scroll);
	addWheelEvent(elem, onMouseWheel);
	scrolled = elem.clientHeight*0.02;
  }
  
  function scrollBy(delta) {
	var minPos = elem.clientHeight*0.02;
	scrolled -= delta;
	if (scrolled < minPos) scrolled = minPos;
	if (scrolled > elem.clientHeight - wrap.clientHeight) scrolled = elem.clientHeight-wrap.clientHeight;
	
	scroll.style.top = Math.round( scrolled / elem.clientHeight * 100 ) + "%" ;
	elem.style.marginTop = (scrolled==minPos?0:-scrolled) + "px";
  }
  
  function onMouseWheel(e) {
	e = fixEvent(e);
	
	scrollBy(e.delta);
  }
  
  function setScroll() {
	var wrapHeight = wrap.clientHeight;
	var elemHeight = elem.clientHeight;
	
	scroll.style.height = Math.round( wrapHeight / elemHeight * 96 ) + "%";
  }
  
  function showElem(e) {
	if (!e) return;
	if (e.offsetTop - scrolled >= wrap.clientHeight - e.clientHeight) {
		scrollBy( -e.offsetTop + wrap.clientHeight - e.clientHeight );
		return;
	}
	if (e.offsetTop < scrolled) {
		scrollBy( -e.offsetTop + scrolled );
		return;
	}
  }
  
  function removeScroll() {
	if (!hasClass(wrap, "scrollable")) return;
	
	removeClass(wrap, "scrollable");
	if (scroll) {
		wrap.removeChild(scroll);
	}
  }

  this.update = function(value) {
    filteredResults = provider.filterByStart(value);

    if (filteredResults.length) {
      elem.innerHTML = buildList();
    } else {
      elem.innerHTML = "Нет совпадений";
    }
	
	if (elem.offsetHeight > 400) {
		createScroll();
		setScroll();
	} else {
		removeScroll();
	}
	
    currentIndex = 0; 
    renderCurrent();

    this.trigger('update', {
      type: 'update',
      values: filteredResults
    });
  };  

  function renderCurrent() {
	addClass(elem.getElementsByTagName('li')[currentIndex], 'selected');
	showElem(elem.getElementsByTagName('li')[currentIndex]);
  }

  function clearCurrent() {   
	removeClass(elem.getElementsByTagName('li')[currentIndex], 'selected'); 
  }

  this.get = function() {
    return filteredResults[currentIndex];
  };

  this.down = function() {
    if (currentIndex == filteredResults.length - 1) return;
    clearCurrent();
    currentIndex++;
    renderCurrent();
  };

  this.up = function() {
    if (currentIndex == 0) return;
    clearCurrent();
    currentIndex--;
    renderCurrent();
  };

  this.clear = function() {
    this.update('');
	removeAllChilds(wrap);
	wrap.parentNode.removeChild(wrap);
	wrap = null;
	elem = null;
  };
  
  this.on = function(eventName, handler) {
    if (!this._eventHandlers) this._eventHandlers = [];
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(handler);
  };

  this.off = function(eventName, handler) {
    var handlers = this._eventHandlers[eventName];
    if (!handlers) return;
    for(var i=0; i<handlers.length; i++) {
      if (handlers[i] == handler) {
        handlers.splice(i--, 1);
      }
    }
  };

  this.trigger = function(eventName) {
    if (!this._eventHandlers[eventName]) {
      return;
    }

    var handlers = this._eventHandlers[eventName];
    for (var i = 0; i < handlers.length; i++) {
      handlers[i].apply(this, [].slice.call(arguments, 1));
    }
  };
}