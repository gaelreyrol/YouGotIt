var CurrentTab;
var ValidPlatform = false;
var YoutubePattern = "youtube.com/watch"

function Init() {
	chrome.tabs.query({
		active: true,
		lastFocusedWindow: true
	}, function (e) {
		CurrentTab = e[0];
		subInit();
	});
}

function subInit() {
	var regexUrl = new RegExp(YoutubePattern)
	if (regexUrl.test(CurrentTab.url) == true)
	{
		toggleIcon(false);
		ValidPlatform = true;
	}
	else
	{
		toggleIcon(true);
		ValidPlatform = false;
	}
}

function toggleIcon(active) {
	if (active == false) {
		chrome.browserAction.setIcon({
			path: "icons/stream-icon19.png"
		});
	} else if (active == true) {
		chrome.browserAction.setIcon({
			path: "icons/stream-icon19-disable.png"
		});
	}
}

function InsertStreamAdds() {
	chrome.tabs.executeScript(CurrentTab.id, {
		code: 'alert("test")'
	});	
}

function Launch()
{
	if (ValidPlatform == false)
		return ;
	alert("Welcome !");
}

function test() {

	//alert(CurrentUrl);
	//alert(url);
}

chrome.tabs.onActivated.addListener(Init);
chrome.tabs.onUpdated.addListener(Init);

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript({
		code: 'showToolbar();'
	});
});
