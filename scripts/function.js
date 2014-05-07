var toggle = 0;
var size_window = $(window).width();
var position = (size_window - 1040) / 2;
var userDetails = null;
var youtubeId = null;
var latestAdds = [];
var videoContent = [];
var nbDownloading = 0;

function isConnect()
{
	if(!userDetails)
	{
		$('#toolbar').append('\
			<span id="close">x</span>\
			<section id="form-connect">\
			<h3 class="title-form">Sign in <small class="sub-title-form">StreamNation</small></h3>\
			<div id="errors"></div>\
			<input type="email" placeholder="E-mail" id="email"/>\
			<input type="password" placeholder="Password" id="password"/></br></br>\
			<input type="checkbox" name="agree" value="yes">I agree with sharing my settings</br></br>\
			<input type="submit" class="" value="Sign In" id="signin"/>\
			</section></br>\
			<section id="form-register">\
				<a href="https://www.streamnation.com/" class="register">Not yet registered ?</a>\
			</section>');
	}
	else
	{
		$('#toolbar').append('\
			<span id="close">x</span>\
			<section id="container-user">\
			<canvas  width="125px" height="125px"></canvas>\
			<input id="loader" value="35" style="display: none; width: 0px; visibility: hidden;">\
			<img id="avatar" src="' + userDetails.user.avatar_url + '">\
			<div id="title-welcome"><small class="sub-title-welcome">Hello, </small> ' + userDetails.user.first_name + '</div>\
			<section id="data-user">\
			<section id="content-button">\
			<a id="signout" class="button">Sign Out</a>\
			<a id="profile" href="https://www.streamnation.com/settings" class="button">Account Details</a></br></br>\
			<a class="nbdownloads button">Downloading videos : <span id="nbDownload">' + nbDownloading + '</span></a>\
			<a class="refresh button">Refresh</a>\
			</section>\
			<div id="messages"></div>\
			</section>\
			<section class="title-category">Latest Adds</section>\
			<section class="triangle"></section>\
			<section id="latestAdds" class="category lastest"></section>\
			<section class="title-category">My Subscribes</section>\
			<section class="triangle"></section>\
			<section id="subscribes" class="category subscribes"></section>\
			</section>\
			');
		initLoader(5);

		getAdds();
		getSubscribes();
		/*var i = 0;
		$('.category').each(function()
		{
			var target = $(this);

			setTimeout(function()
			{
				i++;
				console.log(i);
				$('#category'+i).fadeIn().removeClass('hidden');
			}, i * 3000);
		});*/
	}
}
function initLoader(time)
{
	var count 	= 0;
	var loader 	= $('#loader');

	loader.knob(
	{
		width 			: 100,
		displayinput	: false,
		bgColor			: '#363e47',
		fgColor			: '#00b4ff',
		thickness		: '.1'
	});
	var anim = setInterval(function()
	{
		if(count == 101)
		{
			clearInterval(anim);
			//$('#loader-knob').fadeOut();
		}
		count++;
		loader.val(count);
		loader.change();

	}, time);
}
function showToolbar()
{

	if(toggle == 0)
	{
		$('html').css('right', position + 'px');
		//$('html').css('overflow', 'hidden');
		$('html').css('position', 'absolute');
		$('html').animate(
		{
			right: "310px"
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
			right: "-310px"}, 1000);
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
	for (var i = 0; i < 3; i++)
	{
		$("#latestAdds").html('\
		<div class="add">\
			<a href="http://www.streamnation.com/content/' + latestAdds[i].id + '" class="category-latestTitles">\
				<img src=' + latestAdds[i].thumbnails[3].uri + ' class="subscribe-img"> \
			</a></div><section class="title-video">' + latestAdds[i].title + '</section>\
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
			$("#subscribes").prepend('<div class="sub"  id="id_'+ content[i].id + '">\
					<a href="http://www.streamnation.com/content/' + content[i].id + '" >\
						<img src=' + content[i].cover_thumbs[0].thumbs[0].uri + ' class="subscribe-img">\
					</a><span class="delete-subs" data-target="id_'+ content[i].id + '" id="'+ content[i].id +'" >x</span><section class="title-video">' + content[i].title + '</section></div>');
		} else {
				$("#subscribes").prepend('<div class="sub" id="id_'+ content[i].id + '">\
					<a href="http://www.streamnation.com/content/' + content[i].id + '" >\
						<img src="https://assets.streamnation.com/assets/mosaic/default_collection-52fd46fb597dd0185cc9701fa1fa8143.png" class="subscribe-img">\
					</a><span class="delete-subs" data-target="id_'+ content[i].id + '" id="'+ content[i].id +'">x</span><section class="title-video">' + content[i].title + '</section></div>');
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

function getNbVideosDownloading()
{
	var localnb = 0;
	for (var i = 0; i < videoContent.length; i++)
	{
		$.ajax({
			async: false,
			type: "GET",
			url: "http://api.streamnation.com/api/v1/library",
			data: {auth_token: userDetails.auth_token, parent_id: videoContent[i].id},
			success: function (data) {
				for (var i = 0; i < data.library.length; i++)
				{
					if (data.library[i].transfer)
					{
						localnb++;
					}
				}
			}
		});
	}
	if (localnb != nbDownloading)
		nbDownloading = localnb;
	console.log("nb: " + nbDownloading)
	$('#nbDownload').html(nbDownloading);
}

function refresh() {
	$(".sub").slideUp().remove();
	$(".add").slideUp().remove();
	getAdds();
	getSubscribes();
}

