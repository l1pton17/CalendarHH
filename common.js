function getStyle(element, prop) {
    var computedStyle = (element.currentStyle || window.getComputedStyle(element, null));

    return computedStyle[prop];
}
	
function getNameByMonth(month) {
	var arr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
	return arr[month];
}
	
function getGiventNameByMonth(month) {
	var arr = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
	return arr[month];
}

function addWheelEvent(elem, onWheel) {
	if (elem.addEventListener) {
		if ('onwheel' in document) {
			// IE9+, FF17+
			elem.addEventListener ("wheel", onWheel, false);
		} else if ('onmousewheel' in document) {
			// устаревший вариант события
			elem.addEventListener ("mousewheel", onWheel, false);
		} else {
			// 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
			elem.addEventListener ("MozMousePixelScroll", onWheel, false);
		}
	} else { // IE<9
		elem.attachEvent ("onmousewheel", onWheel);
	}
}


function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};

String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};

String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};

function handleMouseLeave(handler) {
  return function(e) {
    e = e || event; // IE
    var toElement = e.relatedTarget || e.toElement; // IE

    // проверяем, мышь ушла на элемент внутри текущего?
    while (toElement && toElement !== this) {
      toElement = toElement.parentNode;
    }

    if (toElement == this) { // да, мы всё еще внутри родителя
      return; // мы перешли с родителя на потомка, лишнее событие
    }

    return handler.call(this, e);
  };
}

function handleMouseEnter(handler) {
  return function(e) {
    e = e || event; // IE
    var toElement = e.relatedTarget || e.srcElement; // IE

    // проверяем, мышь пришла с элемента внутри текущего?
    while (toElement && toElement !== this) {
      toElement = toElement.parentNode;
    }

    if (toElement == this) { // да, мышь перешла изнутри родителя
      return; // мы перешли на родителя из потомка, лишнее событие
    }

    return handler.call(this, e);
  };
}

var addEvent, removeEvent;

if (document.addEventListener) { // проверка существования метода
  addEvent = function(elem, type, handler) {
    elem.addEventListener(type, handler, false);
  };
  removeEvent = function(elem, type, handler) {
    elem.removeEventListener(type, handler, false);
  };
} else {
  addEvent = function(elem, type, handler) {
    elem.attachEvent("on" + type, handler);
  };
  removeEvent = function(elem, type, handler) {
    elem.detachEvent("on" + type, handler);
  };
}

if(document.getElementsByClassName) {

	getElementsByClass = function(classList, node) {    
		return (node || document).getElementsByClassName(classList)
	}

} else {

	getElementsByClass = function(classList, node) {			
		var node = node || document,
		list = node.getElementsByTagName('*'), 
		length = list.length,  
		classArray = classList.split(/\s+/), 
		classes = classArray.length, 
		result = [], i,j
		for(i = 0; i < length; i++) {
			for(j = 0; j < classes; j++)  {
				if(list[i].className.search('\\b' + classArray[j] + '\\b') != -1) {
					result.push(list[i])
					break
				}
			}
		}
	
		return result
	}
}


function getMonthByName(name) {
	var nameLower = name.toLowerCase();
	var arr = ['январ', 'феврал', 'март', 'апрел', 'ма', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'];
	
	for (var i=0; i<arr.length; i++) {
		if (!nameLower.indexOf(arr[i])) {
			return i;
		}
	}
	
	return -1;
}

function getWindowSize() {
    var myWidth = 0,
        myHeight = 0;
    var int1 = 0;

    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
        int1 = 1;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
        int1 = 2;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
        int1 = 3;
    }

    return {
        width: myWidth,
        height: myHeight
    };
}

function removeAllChilds(el) {
    if (el != null) {
        if (el.childNodes) {
            while (el.childNodes[0]) {
                el.removeChild(el.childNodes[0]);
            }
        }
    }
}

/*
 * This function calculates the absolute 'top' value for a html node
 */

function calculateOffsetTop(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        curtop = obj.offsetTop
        while (obj = obj.offsetParent)
            curtop += obj.offsetTop
    } else if (obj.y)
        curtop += obj.y;
    return curtop;
}

/*
 * This function calculates the absolute 'left' value for a html node
 */

function calculateOffsetLeft(obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        curleft = obj.offsetLeft
        while (obj = obj.offsetParent) {
            curleft += obj.offsetLeft;
        }
    } else if (obj.x)
        curleft += obj.x;
    return curleft;
}

function addClass(el, cls) {
	if (!el) return;
    var c = el.className ? el.className.split(' ') : [];
    for (var i = 0; i < c.length; i++) {
        if (c[i] == cls) return;
    }
    c.push(cls);
    el.className = c.join(' ');
}

function removeClass(el, cls) {
	if (!el) return;
    var c = el.className.split(' ');
    for (var i = 0; i < c.length; i++) {
        if (c[i] == cls) c.splice(i--, 1);
    }

    el.className = c.join(' ');
}

function hasClass(el, cls) {
	if (!el) return;
    for (var c = el.className.split(' '), i = c.length - 1; i >= 0; i--) {
        if (c[i] == cls) return true;
    }
    return false;
}

function toggleClass(el, cls, addFunc, removeFunc) {
    if (hasClass(el, cls)) {
        removeClass(el, cls);
		if (removeFunc) removeFunc();
    } else {
        addClass(el, cls);
		if (addFunc) addFunc();
    }
}

function equalsOnlyDate(d1, d2) {
	return (
				d1.getDate() == d2.getDate() 
				&& d1.getMonth() == d2.getMonth() 
				&& d1.getFullYear() == d2.getFullYear()
			);
}

function fixEvent(e, _this) {
  e = e || window.event;

  if (!e.currentTarget) e.currentTarget = _this;
  if (!e.target) e.target = e.srcElement;

  if (!e.relatedTarget) {
    if (e.type == 'mouseover') e.relatedTarget = e.fromElement;
    if (e.type == 'mouseout') e.relatedTarget = e.toElement;
  }
  
  e.delta = e.deltaY || e.detail || e.wheelDelta;
  
  if (e.pageX == null && e.clientX != null ) {
    var html = document.documentElement;
    var body = document.body;

    e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
    e.pageX -= html.clientLeft || 0;

    e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
    e.pageY -= html.clientTop || 0;
  }

  if (!e.which && e.button) {
    e.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : (e.button & 4 ? 2 : 0) );
  }

  return e;
}