function CreatePlaceholder(options) {
	var elem = options.elem;
	var oldValue = elem.value || options.value || "Введите";
	var withoutDelete = options.withoutDelete;
	var wrap = document.createElement('div');
	wrap.className = 'placeholder-wrap';
	var placeholder = document.createElement('div');
	placeholder.className = 'placeholder-content';
	var deletePlaceholder = document.createElement('div');
	deletePlaceholder.className = "placeholder-delete";
	var deletePlaceholderButton = document.createElement('span');
	deletePlaceholderButton.className = "placeholder-delete-button placeholder-delete-button-hide";
	deletePlaceholderButton.innerHTML = "&times;";
	var self = this;
	
	function checkInput(input) {
		if (input.value != "") {
			addClass(placeholder, "placeholder-content-hide");
			removeClass(deletePlaceholderButton, "placeholder-delete-button-hide");
		} else {
			removeClass(placeholder, "placeholder-content-hide");
			addClass(deletePlaceholderButton, "placeholder-delete-button-hide");
		}
	}
	
	function onElemInput(e) {
		e = fixEvent(e);
		
		checkInput(e.target);
	}
	
	function copyStyle(toElem, fromElem) {
		toElem.style.paddingTop = getStyle(fromElem, "padding-top");
		toElem.style.paddingLeft = getStyle(fromElem, "padding-left");
		toElem.style.paddingBottom = getStyle(fromElem, "padding-bottom");
		toElem.style.paddingRight = getStyle(fromElem, "padding-right");
		toElem.style.borderTop = getStyle(fromElem, "border-top");
		toElem.style.borderLeft = getStyle(fromElem, "border-left");
		toElem.style.borderBottom = getStyle(fromElem, "border-bottom");
		toElem.style.borderRight = getStyle(fromElem, "border-right");
		toElem.style.marginTop = getStyle(fromElem, "margin-top");
		toElem.style.marginLeft = getStyle(fromElem, "margin-left");
		toElem.style.marginBottom = getStyle(fromElem, "margin-bottom");
		toElem.style.marginRight = getStyle(fromElem, "margin-right");
		toElem.style.textIndent = getStyle(fromElem, "text-indent");
	}
	
	var topPos = +parseInt(getStyle(elem, "padding-top")) + parseInt(getStyle(elem, "border-top"));
	var leftPos = +parseInt(getStyle(elem, "padding-left"));
	placeholder.innerHTML = oldValue;
	placeholder.style.fontSize = getStyle(elem, "font-size");
	placeholder.style.fontFamily = getStyle(elem, "font-family");
	placeholder.style.width = getStyle(elem, "width");
	
	deletePlaceholder.appendChild(deletePlaceholderButton);
	
	if (!withoutDelete) {
		addClass(elem, "delete");
	}
	elem.parentNode.replaceChild(wrap, elem);
	
	wrap.appendChild(elem);
	wrap.appendChild(placeholder);
	if (!withoutDelete) {
		wrap.appendChild(deletePlaceholder);
	}
	
	elem.setValue = function(value) {
		elem.value = value;
		checkInput(elem);
	}
	
	deletePlaceholderButton.onclick = function() {
		elem.setValue("");
		elem.focus();
	}
	
	placeholder.onclick = placeholder.onfocus = deletePlaceholder.onclick = function() {
		elem.focus();
	}
	
	elem.addEventListener('input', onElemInput, false);
	
	return wrap;
}