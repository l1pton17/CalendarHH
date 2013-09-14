function Autocomplete(options) {
  var self = this;

  var elem = options.elem;
  
  var input = options.input;
  var list;
  
  addEvent(input, "focus", onInputFocus);
  addEvent(input, "blur", onInputBlur);
  addEvent(input, "keydown", onInputKeyDown);

  var inputCheckTimer;

  // ------------------

  function onInputKeyDown(e) {
	e = fixEvent(e);
    var KEY_ARROW_UP = 38;
    var KEY_ARROW_RIGHT = 39;
    var KEY_ARROW_DOWN = 40;
    var KEY_ENTER = 13;
    var KEY_ESC = 27;

    switch(e.keyCode) {
      case KEY_ARROW_UP:
        list.up();
        return false;
        break;

      case KEY_ARROW_RIGHT:
        if (list.get()) {
          self.setValue( list.get().event.title, true );
        }
        break;

      case KEY_ENTER:
        self.setValue( list.get().event.title || input.value );
        input.blur();
        break;

      case KEY_ESC:
        list.clear();
		list = null;
		CalloutManager.closeCallout();
        break;

      case KEY_ARROW_DOWN:
        list.down();
        return false;
        break;
    }
  }

  function initList() {
    list = new AutocompleteList(options.provider);
	CalloutManager.showCallout({
		launchPoint: input,
		beakOrientation: "topBottom",
		hideCloseButton: true,
		content: list.render(),
		width: 250,
		isFixed: true
	});
	list.on('update', onListUpdate);
  }

  function onListUpdate(e) {
	CalloutManager.resize();
  }

  function onInputFocus() {
    var inputValue = input.value;
    function checkInput() {
      if (inputValue != input.value) {

        if (!list) {
          initList();
        } 

        list.update(input.value);
        inputValue = input.value;
      }
    }

    inputCheckTimer = setInterval(checkInput, 30);
  }

  function onInputBlur() {
    clearInterval(inputCheckTimer);
	/*CalloutManager.closeCallout();
    if (list) {
		list.clear();
		list = null;
    }*/
  }

  this.setValue = function(value, quiet) {
    input.value = value;
    if (!quiet) {
      self.trigger('change',{
        type: 'change',
        value: value
      });
    }
  }
	
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