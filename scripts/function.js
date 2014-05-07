var toggle = 0;
var size_window = $(window).width();
var position = (size_window - 1040) / 2;
var userDetails = null;
var youtubeId = null;
var latestAdds = [];
var videoContent = [];

function isConnect()
{
	if(!userDetails)
	{
		$('#toolbar').append('\
			<span id="close">x</span>\
			<section id="form-connect">\
			<h3 class="title-form">Signin <small class="sub-title-form">StreamNation</small></h3>\
			<div id="errors"></div>\
			<input type="email" placeholder="E-mail" id="email"/>\
			<input type="password" placeholder="Password" id="password"/></br>\
			<input type="checkbox" name="agree" value="yes">I agree with sharing my settings</br>\
			<input type="submit" class="button" value="Sign In" id="signin"/>\
			</section></br>\
			<section id="form-register">\
				<a href="https://www.streamnation.com/" class="button">Not yet registered ?</a>\
			</section>');
	}
	else
	{
		$('#toolbar').append('\
			<span id="close">x</span>\
			<img id="avatar" src="' + userDetails.user.avatar_url + '">\
			<a id="signout" class="button">Sign Out</a>\
			<a id="profile" href="https://www.streamnation.com/settings" class="button">Account Details</a>\
			<div class="title-welcome"><small class="sub-title-welcome">Hello, </small> ' + userDetails.user.first_name + '</div>\
			<div id="messages"></div>\
			<section class="category lastest" id="latestAdds"><h3>Latest Adds</h3></br></section>\
			<section id="subscribes" class="category subscribes"><h3>My Subscribes</h3></section>\
		');
		getAdds();
		getSubscribes();
	}
}
function showToolbar()
{

	if(toggle == 0)
	{
		$('html').css('right', position + 'px');
		$('html').css('overflow', 'hidden');
		$('html').css('position', 'absolute');
		$('html').animate(
		{
			right: "300px"
		}, 1000).fadeIn();
		$('#toolbar').show().animate(
		{
			right: "0px"
		}, 1000);
	}
	else
	{
		$('html').animate({
			right: position +"px"
		}, 1000, function()
		{
			$('html').css('position', 'static');
		});
		$('#toolbar').animate({
			right: "-300px"}, 1000);
	}
	toggle = (toggle == 1) ? 0 : 1;
}

function showInfoBulle()
{
	if(toggle == 0)
	{
		$('#toolbar, #triangle').show().animate(
		{
			bottom: "30px",
			opacity: 1
		}, 1000);
	}
	else
	{
		$('#toolbar, #triangle').animate({
			bottom: "-100px",
			opacity: 0}, 1000);
	}
	toggle = (toggle == 1) ? 0 : 1;
}

function getUserlocalStorage()
{
	if (localStorage['st_user_details'])
		return JSON.parse(localStorage['st_user_details']);
	else
		return null;
}

function storeUserData(data) {
	localStorage['st_user_details'] = JSON.stringify(data);
	localStorage['st_user_youtube_id'] = null;
	localStorage['st_user_videos'] = JSON.stringify([]);
	console.log("User :" + localStorage['st_user_details']);
}

function signOutUser() {
	delete window.localStorage["st_user_details"];
	delete window.localStorage["st_user_youtube_id"];
	delete window.localStorage["st_user_videos"];
	userDetails = null;
	console.log("Disconnect : " + userDetails);
	showToolbar();
	$("#toolbar").empty();
	isConnect();
}

function storeVideoData(data) {
	var stored = JSON.parse(localStorage["st_user_videos"]);
	stored.push({
			"auth_token": userDetails.auth_token,
			"creation" : data.created_at,
			"videoId" : data.id
	});
	localStorage.setItem("st_user_videos", JSON.stringify(stored));
}

function getChannelId(parentid) {
	var channel = null;
	var channelName = $("a.yt-user-name").attr("href").split("/")[2];
	$.ajax({
		type: "POST",
		url: "http://api.streamnation.com/api/v1/content/collection",
		data: {auth_token: userDetails.auth_token, title: channelName, parent_id: parentid},
		async: false,
		success: function (data) {
			var content = data.content;
			channel = content.id;
		},
		error: function () {
			$('#messages').prepend("<p id='error'>An error occured, please try again.<span id='dismiss'>x</span></p>");
		}
	});
	return channel;
}

function getYoutubeId() {
	$.ajax({
		type: "POST",
		url: "http://api.streamnation.com/api/v1/content/collection",
		data: {auth_token: userDetails.auth_token, title: "YouTube"},
		async: false,
		success: function (data) {
			var content =  data.content;
			localStorage["st_user_youtube_id"] = content.id;
		},
		error: function () {
			$('#messages').prepend("<p id='error'>An error occured, please try again.<span id='dismiss'>x</span></p>");
		}
	});
	return localStorage["st_user_youtube_id"];
}

function appendLatestAdds()
{
	for (var i = 0; i < latestAdds.length; i++)
	{
		$("#latestAdds").append('\
		<div class="add">\
		<a href="http://www.streamnation.com/content/' + latestAdds[i].id + '" class="category-latestTitles">' + latestAdds[i].title + '</a>\
		<figure style="margin: 10px">\
		<img src=' + latestAdds[i].thumbnails[3].uri + ' width="200px" > \
		</figure></div>\
		');
	}
}

function getSubscribes() {
	$.ajax({
		type: "GET",
		url: "http://api.streamnation.com/api/v1/library",
		data: {auth_token: userDetails.auth_token, parent_id: youtubeId, per_page: 5},
		beforeSend: function () {
			$('#subs').prepend("<div class='bar'><div class='circle'></div><p id='wait'>Loading</p></div>");
		},
		success: function (data) {
			$('.bar').fadeOut();
			var content = data.library;
			appendSubscribes(content);
		},
		error: function () {
			$('.bar').fadeOut();
			$('#messages').prepend("<p id='error'>An error occured, please try again.<span id='dismiss'>x</span></p>");
		}
	})
}

function appendSubscribes(content) {
	for (var i = 0; i < content.length; i++) {
		if (content[i].cover_thumbs[0]) {
			$("#subscribes").append('<div class="sub">\
					<a href="http://www.streamnation.com/library/' + content[i].id + '" class="subscribe-title">\
						<img src=' + content[i].cover_thumbs[0].thumbs[0].uri + ' class="subscribe-img">\
						<p class="subscribe-desc">' + content[i].title + '<p></a><span id="' + content[i].id + '" class="delete-subs">x</span>\
					</div>');
		} else {
			$("#subscribes").append('<div class="sub">\
					<a href="http://www.streamnation.com/library/' + content[i].id + '" class="subscribe-title">\
						<img src="https://assets.streamnation.com/assets/mosaic/default_collection-52fd46fb597dd0185cc9701fa1fa8143.png" class="subscribe-img">\
						<p class="subscribe-desc">' + content[i].title + '<p></a><span id="' + content[i].id + '" class="delete-subs">x</span>\
					</div>');
		}
	}
}

function getLatestAdds()
{
	for (var i = 0; i < videoContent.length; i++)
	{
		$.ajax({
			async: false,
			type: "GET",
			url: "http://api.streamnation.com/api/v1/content",
			data: {auth_token: userDetails.auth_token, type: "VideoContent", parent_id: videoContent[i].id},
			success: function (data) {
				for (var i = 0; i < data.contents.length; i++)
				{
					latestAdds.unshift(data.contents[i]);
					if (latestAdds.length > 3)
					{
						latestAdds.sort(function(a, b) { return a.created_at - b.created_at});
						latestAdds.pop();
					}
				}
			}
		});
	}
}
function getAdds() {
	$.ajax({
		type: "GET",
		url: "http://api.streamnation.com/api/v1/content",
		data: {auth_token: userDetails.auth_token, type:"CollectionContent"},
		success: function(data) {
			for (var i = 0; i < data.contents.length; i++)
			{
				if (data.contents[i].parent_id == localStorage["st_user_youtube_id"])
				videoContent.unshift(data.contents[i]);
			}
			getLatestAdds();
			appendLatestAdds();
		}
	});
}

