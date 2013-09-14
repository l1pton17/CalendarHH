var CalloutManager = new function() {
    var BEAK_LEFT_RIGHT = "leftRight";
    var BEAK_TOP_BOTTOM = "topBottom";

    var calloutElem = null;
	var calloutBodyElem = null;
	var calloutBeakElem = null;
	var calloutContentElem = null;
	var self = this;
	var options = {};

    function closeCallout() {
        if (!calloutElem) return;
        if (options.closeCallBack) {
            options.closeCallBack();
        }

		addClass(calloutElem, "callout-close");
		options = {};
    };
	
    this.closeCallout = closeCallout;
	
	function isShow() {
        return !(hasClass(calloutElem, "callout-close"));
	}

    this.isShow = isShow;

    this.equalLaunchPoint = function (elem) {
        return options && options.launchPoint == elem;
    }

    this.getLaunchPoint = function () {
        if (options) {
            return options.launchPoint;
        } else {
            return null;
        }
    }

    function render() {
        calloutElem = document.createElement('div');
        calloutElem.className = "callout callout-close";
        calloutBeakElem = document.createElement('span');
        calloutBeakElem.className = "callout-beak";
        calloutElem.appendChild(calloutBeakElem);

        calloutBodyElem = document.createElement('div');
        calloutBodyElem.className = "callout-body";

        var calloutHeader = document.createElement('div');
        calloutHeader.className = "callout-header";
		calloutHeader.innerHTML = " ";

        var calloutCloseButton = document.createElement('a');
        calloutCloseButton.title = "Закрыть";
        calloutCloseButton.className = "callout-closebutton";
        calloutCloseButton.innerHTML = "&times;";
        calloutCloseButton.href = "#";
        calloutCloseButton.onclick = function () {
            closeCallout();
            return false;
        };

        calloutHeader.appendChild(calloutCloseButton);
        calloutBodyElem.appendChild(calloutHeader);

        calloutContentElem = document.createElement('div');
        calloutContentElem.className = "callout-content";

        calloutBodyElem.appendChild(calloutContentElem);
        calloutElem.appendChild(calloutBodyElem);
        document.body.appendChild(calloutElem);
    };
	
	this.resize = function() {
		calloutBodyElem.style.height = calloutContentElem.offsetHeight + "px";
	};

    this.showCallout = function (params) {
        if (!calloutElem) render();
        if ( isShow() ) {closeCallout();	}

        if (!params.launchPoint) {
            options.launchPoint = null;
            return;
        }

        options.launchPoint = params.launchPoint;
        calloutElem.style.position = (params.isFixed ? "fixed" : "absolute");
		calloutElem.style.zIndex = (params.isFixed ? "9999" : "99");

        if (params.closeCallBack) options.closeCallBack = params.closeCallBack;

		if (params.hideCloseButton) {
			addClass(calloutElem, "callout-remove-closebutton");
		} else {
			removeClass(calloutElem, "callout-remove-closebutton");
		}
		
        if (params.width) {
            options.width = +parseInt(params.width);
        } else {
            options.width = 300;
        }
        calloutBodyElem.style.width = options.width + "px";

        if (params.content) {
            options.content = params.content;
        } else {
            options.content = "";
        }
		if (options.content instanceof Object) {
			removeAllChilds( calloutContentElem );
			calloutContentElem.appendChild( options.content );
		} else {
			calloutContentElem.innerHTML = options.content;
		}

        if (params.height) {
            options.height = +parseInt(params.height);
			calloutBodyElem.style.height = options.height + "px";
        } else {
			options.height = 50;//calloutContentElem.offsetHeight;
			calloutBodyElem.style.height = "";
			/*var minHeight = +parseInt(getStyle(calloutBodyElem, "min-height"));
			if (calloutContentElem < minHeight) {
				options.height = minHeight;
			}
			calloutBodyElem.style.height = "";*/
        }

        if (params.beakOrientation && 
				(params.beakOrientation == BEAK_LEFT_RIGHT 
					|| params.beakOrientation == BEAK_TOP_BOTTOM
				)
			) {
            options.beakOrientation = params.beakOrientation;
        } else {
            options.beakOrientation = BEAK_LEFT_RIGHT;
        }

        var lpLeft = calculateOffsetLeft(params.launchPoint);
        var lpTop = calculateOffsetTop(params.launchPoint);
        var lpHeight = +parseFloat(params.launchPoint.clientHeight || params.launchPoint.style.height);
        var lpWidth = +parseFloat(params.launchPoint.clientWidth || params.launchPoint.style.width);

        calloutBeakElem.style.left = "";
        calloutBeakElem.style.right = "";
        calloutBeakElem.style.bottom = "";
        calloutBeakElem.style.top = "";

        var windowSize = getWindowSize();

        calloutBeakElem.style.marginRight = "0px";
        calloutBeakElem.style.marginTop = "0px";
        calloutBeakElem.style.marginBottom = "0px";
        calloutBeakElem.style.marginLeft = "0px";
		
        var offsetPlace = 0;
        if (options.beakOrientation == BEAK_LEFT_RIGHT) {
            if ((windowSize.width - lpWidth - lpLeft) > options.width) {
                calloutBeakElem.style.marginLeft = "-7.8px";
                calloutBeakElem.style.left = "0px";
                calloutElem.style.left = lpLeft + lpWidth + 15 + "px";
            } else {
                calloutBeakElem.style.marginRight = "-7.8px";
                calloutBeakElem.style.right = "0px";
                calloutElem.style.left = lpLeft - options.width - 15 + "px";
            }

            if (lpTop + options.height < windowSize.height) {
                calloutElem.style.top = lpTop - 20 + "px";
            } else {
                offsetPlace = lpTop + options.height - windowSize.height + 20;
                calloutElem.style.top = lpTop - offsetPlace + "px";
            }

            calloutBeakElem.style.top = offsetPlace + (lpHeight - 13) / 2 + "px";
        } else {
            if ((windowSize.height - lpTop - lpHeight) > options.height) {
                calloutBeakElem.style.marginTop = "-7.8px";
                calloutBeakElem.style.top = "0px";
                calloutElem.style.top = lpTop + lpHeight + 15 + "px";
            } else {
                calloutBeakElem.style.marginBottom = "-7.8px";
                calloutBeakElem.style.bottom = "0px";
                calloutElem.style.top = lpTop - options.height - 15 + "px";
            }

            if (lpLeft + options.width < windowSize.width) {
                calloutElem.style.left = lpLeft + "px";
            } else {
                offsetPlace = lpLeft + options.width - windowSize.width + 30;
                calloutElem.style.left = lpLeft - offsetPlace + "px";
            }
            calloutBeakElem.style.left = offsetPlace + 40/*(lpWidth - 13) / 2*/ + "px"
        }

		removeClass(calloutElem, "callout-close");
    };
};