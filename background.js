var CurrentUrl;

var YoutubePattern = "youtube.com/watch"

function init() {
	chrome.tabs.query({
		active: true,
		lastFocusedWindow: true
	}, function (e) {
		CurrentUrl = e[0].url;
		LaunchYGI();
	});
}

function LaunchYGI() {
	var regexUrl = new RegExp(YoutubePattern)
	if (regexUrl.test(CurrentUrl) == true)
	{
		ToggleYGI(false);
		//alert("You are on an youtube page: " + CurrentUrl);
	}
	else
	{
		ToggleYGI(true);
		//alert("You are not an youtube page : " + CurrentUrl);
	}
}

function ToggleYGI(active) {
	if (active == false) {
		chrome.browserAction.setIcon({
			path: "icons/icon19.png"
		});
	} else if (active == true) {
		chrome.browserAction.setIcon({
			path: "icons/icon19-disable.png"
		});
	}
}

function test() {
	var url = getActiveUrlTab();
	//alert(CurrentUrl);
	//alert(url);
}

chrome.tabs.onActivated.addListener(init);
